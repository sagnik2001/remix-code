export const isNonEmptyString = (str: any) => typeof str === 'string' && str?.trim().length > 0;

export const isNonEmptyArray = (arr: any) => Array.isArray(arr) && arr.length > 0;
