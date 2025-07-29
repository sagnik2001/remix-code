export const isNonEmptyString = (str: any) => typeof str === 'string' && str?.trim().length > 0;

export const isNonEmptyArray = (arr: any) => Array.isArray(arr) && arr.length > 0;

export const isNonEmptyObject = (obj: any) => obj && Object.keys(obj).length > 0;

export const isArray = (obj: any): boolean => Boolean(isObject(obj) && obj instanceof Array);

export const isObject = (obj: any): boolean => Boolean(obj && typeof obj === 'object');
