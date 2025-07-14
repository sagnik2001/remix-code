// app/utils/webview.ts

declare global {
    interface Window {
      ReactNativeWebView?: {
        postMessage: (message: string) => void;
      };
    }
  }
  
  import { isNonEmptyString } from '~/utils/checks';
  
  export const TOKEN_SEARCH_PARAM = 'token';
  
  export enum WEBVIEW_MSG_TYPES {
    LINK = 'LINK',
    API_ERROR = 'ERROR',
    EVENTS = 'EVENTS',
  }
  
  /**
   * Detects if the app is running inside a React Native WebView.
   * Only safe on the client.
   */
  export function isReactNativeWebView(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!window.ReactNativeWebView &&
      typeof window.ReactNativeWebView.postMessage === 'function'
    );
  }
  
  /**
   * Sends a named event to the React Native WebView.
   */
  export function handleSendAppEvents(eventName = ''): void {
    if (isReactNativeWebView()) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: WEBVIEW_MSG_TYPES.EVENTS,
          payload: eventName,
        })
      );
    }
  }
  
  /**
   * Instructs the React Native WebView to navigate to a new link.
   */
  export function handleAppRedirect(link = ''): void {
    if (isReactNativeWebView()) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: WEBVIEW_MSG_TYPES.LINK,
          payload: link,
        })
      );
    }
  }
  
  /**
   * Notifies the WebView of an API error condition.
   */
  export function handleApiError(): void {
    if (isReactNativeWebView()) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: WEBVIEW_MSG_TYPES.API_ERROR })
      );
    }
  }
  
  /**
   * Parses the `token` search param from the current URL inside WebView.
   * Returns whether the user is logged in on app and the token itself.
   */
  export function rnWebview(): { loggedInOnApp: boolean; appAccessToken: string | null } {
    if (isReactNativeWebView()) {
      const params = new URL(window.location.href).searchParams;
      const appAccessToken = params.get(TOKEN_SEARCH_PARAM);
      return {
        loggedInOnApp: isNonEmptyString(appAccessToken),
        appAccessToken,
      };
    }
  
    return { loggedInOnApp: false, appAccessToken: null };
  }
  