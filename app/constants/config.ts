

// const _serverEnv = typeof process !== "undefined" && typeof process.env !== "undefined"
//   ? process.env
//   : {};

// export const API_DOMAIN =
//   _serverEnv.NEXT_PUBLIC_REACT_APP_API_DOMAIN ||
//   import.meta.env.VITE_API_DOMAIN;

// export const WEB_URL =
//   _serverEnv.NEXT_PUBLIC_REACT_APP_WEB_URL ||
//   import.meta.env.VITE_WEB_URL;

// export const ENV =
//   _serverEnv.NEXT_PUBLIC_REACT_APP_ENV ||
//   import.meta.env.VITE_ENV;

// export const GTM_ID =
//   _serverEnv.NEXT_PUBLIC_REACT_APP_GTM_ID ||
//   import.meta.env.VITE_GTM_ID ||
//   "";

// export const DEFAULT_SORT_BY =
//   _serverEnv.NEXT_PUBLIC_REACT_APP_DEFAULT_SORT_BY ||
//   import.meta.env.VITE_DEFAULT_SORT_BY;

// export const DEEP_LINK =
//   _serverEnv.NEXT_PUBLIC_REACT_APP_DEEP_LINK ||
//   import.meta.env.VITE_DEEP_LINK;


// app/constants/config.ts

// At the very top, ensure you’ve loaded dotenv (if you’re using a .env file)
import 'dotenv/config';

const _env = process.env;

export const API_DOMAIN = _env.NEXT_PUBLIC_REACT_APP_API_DOMAIN 
  ?? _env.VITE_API_DOMAIN 
  ?? (() => { throw new Error('API_DOMAIN is not defined'); })();

export const WEB_URL = _env.NEXT_PUBLIC_REACT_APP_WEB_URL 
  ?? _env.VITE_WEB_URL 
  ?? (() => { throw new Error('WEB_URL is not defined'); })();

export const ENV = _env.NEXT_PUBLIC_REACT_APP_ENV 
  ?? _env.VITE_ENV 
  ?? 'production';

export const GTM_ID = _env.NEXT_PUBLIC_REACT_APP_GTM_ID 
  ?? _env.VITE_GTM_ID 
  ?? '';

export const DEFAULT_SORT_BY = _env.NEXT_PUBLIC_REACT_APP_DEFAULT_SORT_BY 
  ?? _env.VITE_DEFAULT_SORT_BY 
  ?? 'relevance';

export const DEEP_LINK = _env.NEXT_PUBLIC_REACT_APP_DEEP_LINK 
  ?? _env.VITE_DEEP_LINK 
  ?? '';
