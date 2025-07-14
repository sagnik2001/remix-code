import type { BaseQueryApi, QueryReturnValue, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { API_DOMAIN } from '~/constants/config';
import { getWindowCustomLandingPage, onLogout } from '~/utils/common';
import { Tokens } from '~/constants/common';
import { API_TAGS, RequestTypes } from '~/constants/api';
import { v4 as uuid } from 'uuid';
import { parse, serialize } from 'cookie';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { isNonEmptyString } from '~/utils/checks';
import { isReactNativeWebView } from '~/utils/webview';
import { store } from '~/store';
import { SessionStorage } from '~/utils/storage';

const mutex = new Mutex();
const ISSERVER = typeof window === 'undefined';

// Helper: get a cookie by name from Remix request or browser
const getCookieRemix = (name: string, context?: LoaderFunctionArgs | ActionFunctionArgs): string | null => {
  if (ISSERVER && context) {
    const cookieHeader = context.request.headers.get('cookie') || '';
    const parsed = parse(cookieHeader);
    return parsed[name] || null;
  }
  // client
  const all = document.cookie;
  const parsed = parse(all);
  return parsed[name] || null;
};

// Helper: set a cookie in Remix response headers
const setCookieRemix = (name: string, value: string, options: any = {}) => {
  return serialize(name, value, options);
};

// Build combined cookie string for API calls
const getLogoutCookie = (context?: LoaderFunctionArgs | ActionFunctionArgs, passedCookies: Record<string, string> = {}) => {
  let logoutCookie: string | null,
      sessionCookie: string | null,
      geo: string | null,
      _ga: string | null,
      sessionIpCookie: string | null,
      deliveryPincode: string | null,
      fbpCookie: string | null,
      fbcCookie: string | null,
      session_id: string | null;

  if (ISSERVER && context) {
    const cookieHeader = context.request.headers.get('cookie') || '';
    const parsed = parse(cookieHeader);
    logoutCookie = parsed._nm ?? null;
    sessionCookie = (passedCookies.sessionCookie as string) 
        ? (passedCookies.sessionCookie as string).replace(/session_id_v2=/g, '') 
        : parsed.session_id_v2 ?? null;
    geo = parsed.geo ?? null;
    _ga = parsed._ga ?? null;
    sessionIpCookie = parsed.session_ip ?? null;
    fbpCookie = parsed._fbp ?? null;
    fbcCookie = parsed._fbc ?? null;
    deliveryPincode = parsed['delivery-pincode'] ?? null;
    session_id = parsed.session_id_test ?? null;
  } else {
    logoutCookie = getCookieRemix('_nm');
    sessionCookie = getCookieRemix('session_id_v2');
    geo = getCookieRemix('geo');
    _ga = getCookieRemix('_ga');
    sessionIpCookie = getCookieRemix('session_ip');
    fbpCookie = getCookieRemix('_fbp');
    fbcCookie = getCookieRemix('_fbc');
    deliveryPincode = getCookieRemix('delivery-pincode');
    session_id = getCookieRemix('session_id_test');
  }

  return `_nm=${logoutCookie};session_id_v2=${sessionCookie};geo=${geo};_ga=${_ga};session_ip=${sessionIpCookie};delivery-pincode=${deliveryPincode};_fbp=${fbpCookie};_fbc=${fbcCookie};Session-Id=${session_id}`;
};

// In server context, forward Set-Cookie headers
const setCookieOnServerResponse = (context: LoaderFunctionArgs | ActionFunctionArgs, response: Response) => {
  if (ISSERVER && context) {
    const cookieValue = response.headers.get('Set-Cookie');
    if (cookieValue) {
      // User should append this to their outgoing Response
      // e.g., headers.append('Set-Cookie', cookieValue)
      return cookieValue;
    }
  }
  return null;
};

const customParamsSerializer = (params: Record<string, any>) =>
  Object.entries({ ...params })
    .map(([key, value]) =>
      Array.isArray(value)
        ? value.map(item => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`).join('&')
        : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');

const CheckIfEndpointIsQuery = (endpoint: string) => {
  const customLanding = getWindowCustomLandingPage();
  const campaign_name = SessionStorage.getItem('page-type') ?? '';
  if (
    ['getCartItemsv2','checkCartOfferv2','removeCartOfferv2','updateCartv2','updateCart','checkout','placeOrder']
      .includes(endpoint) &&
    customLanding
  ) {
    return { multi_buy_now: true, campaign_name };
  }
};

const createCustomFetchBaseQuery = (baseOptions: any) => {
  return async (args: any, api: BaseQueryApi, extraOptions: any) => {
    const { endpoint } = api;
    const extraParams = CheckIfEndpointIsQuery(endpoint);
    if (typeof args === 'string') {
      args = { url: args, params: {} };
    }
    args.params = { ...args.params, ...extraParams };
    const baseQuery = fetchBaseQuery({
      ...baseOptions,
      paramsSerializer: customParamsSerializer
    });
    return baseQuery(args, api, extraOptions);
  };
};

const fetchQ = createCustomFetchBaseQuery({
  baseUrl: API_DOMAIN,
  // client-side include credentials
  ...(!ISSERVER && { credentials: 'include' }),
  prepareHeaders: async (headers, { endpoint }) => {
    const accessToken = getCookieRemix(Tokens.ACCESS_TOKEN as string);
    const url = new URL(window.location.href);
    const appAccessToken = url.searchParams.get('token');
    const session_id = getCookieRemix('session_id_test');
    const params = CheckIfEndpointIsQuery(endpoint);

    headers.set('Content-Type', 'application/json');
    headers.set('caller', 'web_app');
    headers.set('timestamp', Date.now().toString());
    headers.set('Delivery-Pincode', fetchCommonHeaderFunc().home.pincode);
    headers.set('Session-Id', session_id as string);
    if (accessToken || (isReactNativeWebView() && isNonEmptyString(appAccessToken))) {
      headers.set(
        'Authorization',
        `Bearer ${isReactNativeWebView() ? (appAccessToken ?? accessToken) : accessToken}`
      );
    }
    return headers;
  }
});

const getRefreshHeaders = () => {
  const refreshToken = getCookieRemix(Tokens.REFRESH_TOKEN as string);
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${refreshToken}`,
    timestamp: Date.now().toString()
  };
};

const baseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
): Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>> => {
  try {
    await mutex.waitForUnlock();
    let result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta> =
      await fetchQ(args, api, extraOptions);

    if (result.error?.status === 401) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          if (getCookieRemix(Tokens.REFRESH_TOKEN as string)) {
            const refreshResult = await fetch(
              `${API_DOMAIN}token/refresh`,
              {
                method: RequestTypes.POST,
                headers: getRefreshHeaders()
              }
            );
            const data = await refreshResult.json();
            if (data.successful) {
              const { access_token, access_token_expiry } = data;
              document.cookie = setCookieRemix(
                Tokens.ACCESS_TOKEN as string,
                access_token,
                access_token_expiry ? { maxAge: access_token_expiry } : {}
              );
              result = await fetchQ(args, api, extraOptions);
            } else {
              onLogout();
            }
          }
        } catch {
          onLogout();
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await fetchQ(args, api, extraOptions);
      }
    }
    return result;
  } catch (error) {
    return { error } as any;
  }
};

const authQuery = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: any) => fetchQ(args, api, extraOptions);

export const fetchCommonHeaderFunc = () => store.getState();

export const nextFetch = {
  get: async (
    context: LoaderFunctionArgs | ActionFunctionArgs,
    url: string,
    optHeaders: Record<string, string> = {},
    passedCookies: Record<string, string> = {}
  ) => {
    try {
      const accessToken = getCookieRemix(Tokens.ACCESS_TOKEN as string, context);
      const session_id = getCookieRemix('session_id_test', context);
      const logoutCookie = getLogoutCookie(context, passedCookies);
      const headers: Record<string, any> = {
        timestamp: Date.now(),
        ...(logoutCookie && ISSERVER && { cookie: logoutCookie }),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...optHeaders,
        ...passedCookies,
        // ...(!ISSERVER && store.getState().home.pincode && { 'Delivery-Pincode': store.getState().home.pincode }),
        ...(session_id && { session_id })
      };
      const res = await fetch(`${API_DOMAIN}${url}`, { method: 'GET', ...(!ISSERVER && { credentials: 'include' }), headers });
      let setCookie = null;
      if (res.ok) setCookie = setCookieOnServerResponse(context, res);
      const data = res.ok ? await res.json() : {};
      return { data, setCookie };
    } catch {
      return { data: {}, setCookie: null };
    }
  },
  post: async (
    context: LoaderFunctionArgs | ActionFunctionArgs,
    url: string,
    body: any,
    passedCookies: Record<string, string> = {},
    onApiFailure: (() => void) | null = null
  ) => {
    try {
      const accessToken = getCookieRemix(Tokens.ACCESS_TOKEN as string, context);
      const logoutCookie = getLogoutCookie(context, passedCookies);
      const session_id = getCookieRemix('session_id_test', context);
      const headers: Record<string, any> = {
        'Content-Type': 'application/json',
        caller: 'web_app',
        timestamp: Date.now().toString(),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(logoutCookie && ISSERVER && { cookie: logoutCookie }),
        ...passedCookies,
        // ...(!ISSERVER && store.getState().home.pincode && { 'Delivery-Pincode': store.getState().home.pincode }),
        ...(session_id && { session_id })
      };
      const res = await fetch(`${API_DOMAIN}${url}`, { method: 'POST', ...(!ISSERVER && { credentials: 'include' }), headers, body: JSON.stringify(body) });
      let setCookie = null;
      if (res.ok) setCookie = setCookieOnServerResponse(context, res);
      const data = res.ok ? await res.json() : {};
      if (!res.ok) onApiFailure?.();
      return { data, setCookie };
    } catch {
      onApiFailure?.();
      return { data: {}, setCookie: null };
    }
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
  tagTypes: API_TAGS,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true
});

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: authQuery,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: false,
  refetchOnReconnect: false
});
