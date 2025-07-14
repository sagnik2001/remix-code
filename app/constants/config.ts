

const _serverEnv = typeof process !== "undefined" && typeof process.env !== "undefined"
  ? process.env
  : {};

export const API_DOMAIN =
  _serverEnv.NEXT_PUBLIC_REACT_APP_API_DOMAIN ||
  import.meta.env.VITE_API_DOMAIN;

export const WEB_URL =
  _serverEnv.NEXT_PUBLIC_REACT_APP_WEB_URL ||
  import.meta.env.VITE_WEB_URL;

export const ENV =
  _serverEnv.NEXT_PUBLIC_REACT_APP_ENV ||
  import.meta.env.VITE_ENV;

export const GTM_ID =
  _serverEnv.NEXT_PUBLIC_REACT_APP_GTM_ID ||
  import.meta.env.VITE_GTM_ID ||
  "";

export const DEFAULT_SORT_BY =
  _serverEnv.NEXT_PUBLIC_REACT_APP_DEFAULT_SORT_BY ||
  import.meta.env.VITE_DEFAULT_SORT_BY;

export const DEEP_LINK =
  _serverEnv.NEXT_PUBLIC_REACT_APP_DEEP_LINK ||
  import.meta.env.VITE_DEEP_LINK;
