/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
export const NAME = /^[A-Za-z0-9,'\-/.\\()\s]{3,50}$/;
export const EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
export const ADDRESSNAME = /^[A-Za-z0-9,'\-/.\\()\s]{5,255}$/;
export const DISPLAY_NAME = /^[A-Za-z0-9,'\-/.\\()\s]{1,30}$/;
export const PINCODE = /^[1-9][0-9]{5}$/;
export const PHONE = /^(\+\d{1,3}[- ]?)?\d{10}$/;
export const ALLPASS = /.*/;
export const COUPON = /^[0-9A-Z-]+$/;
export const NUMBER_INPUT_REGEX = /^[0-9\b]+$/;
export const PHONE_NUMBER_INPUT_REGEX = /^[0-9 \b+\-]+$/;
export const NON_NUMBER_INPUT_REGEX = /[^0-9]/;
export const PHONE_NUMBER_PARSE_REGEX = /[\s-]+/g;
export const IND_PHONE_COUNTRY_CODE_REGEX = /^\+91/;

export const PROFILE_NAME = /^[A-Za-z,'\-/.\\()\s]{1,30}$/;
export const FIRST_NAME = /^[A-Za-z,'\-/.\\()]{2,20}$/;

export const ADDRESS_FULL_NAME = /^[A-Za-z\-\s]{3,50}$/;
// export const ADDRESS_PHONE = /^(\+\d{1,3}[- ]?)?(([6789]\d{9})|^(?=.*(\d)(?=\d)(?!\1))\d{10}$)$/;
export const ADDRESS_PHONE = /^(\+\d{1,3}[- ]?)?([6789]\d{9})$/;
// export const ADDRESS_NAME = /^[A-Za-z0-9,'\-/.\\()\s]{10,255}$/;