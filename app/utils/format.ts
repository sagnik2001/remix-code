import { format, parse } from 'date-fns';

import { VariationType } from '~/types/common';
import { isNonEmptyArray, isNonEmptyString } from './checks';
import { IND_PHONE_COUNTRY_CODE_REGEX, PHONE_NUMBER_PARSE_REGEX } from '~/constants/regex';

const formatWord = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const formatPrice = (value: number, currencySymbol = '₹') =>
  `${currencySymbol}${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

const formatDiscount = (oldPrice: number, newPrice: number) => Math.round(((oldPrice - newPrice) / oldPrice) * 100);

const formatDateString = (date: string, oldFormat = 'dd/MM/yyyy, HH:mm:ss', newFormat = 'MMM dd, yyyy') => {
  const formatOld = parse(date, oldFormat, new Date());
  const updatedDate = format(new Date(formatOld), newFormat);

  return updatedDate;
};


const epochConverter = (epoch: number | undefined | null): Date | null => {
  if (!epoch || typeof epoch !== 'number' || epoch <= 0) {
    console.warn("Invalid epoch value:", epoch);
    return null;
  }
  try {
    return new Date(epoch);
  } catch (error) {
    console.error("Error converting epoch:", error);
    return null;
  }
};

const formatDateToWords = (date: string) => {
  const dateObj = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions;
  const dateWords = dateObj.toLocaleDateString('en-US', options);

  return dateWords;
};

export const getDiscountPercentage = (regularPrice: number, salePrice: number) => {
  const regular = Number(regularPrice);
  const sale = Number(salePrice);
  const discount = ((regular - sale) / regular) * 100;

  return Math.ceil(discount);
};

const getPriceRange = (variations: Array<VariationType>) => {
  if (!variations || variations?.length === 0)
    return {
      minSalePrice: 0,
      maxSalePrice: 0,
      regularPrice: 0,
      discount: 0,
      shouldShowPriceRange: false
    };
  const minSalePrice = variations.reduce(
    (min, variation) => (Number(variation.sale_price) < min ? Number(variation.sale_price) : min),
    Number(variations[0].sale_price)
  );
  const maxSalePrice = variations.reduce(
    (max, variation) => (Number(variation.sale_price) > max ? Number(variation.sale_price) : max),
    Number(variations[0].sale_price)
  );

  const regularPrice = Number(variations[0].regular_price);

  const discount = getDiscountPercentage(regularPrice, minSalePrice);

  const shouldShowPriceRange = minSalePrice !== maxSalePrice;

  return {
    minSalePrice: Math.ceil(minSalePrice),
    maxSalePrice: Math.ceil(maxSalePrice),
    regularPrice: Math.ceil(regularPrice),
    discount,
    shouldShowPriceRange
  };
};

const convertDateString = (date: string, oldFormat = 'dd/MM/yyyy, HH:mm:ss', newFormat = 'dd MMM yyyy') => {
  try {
    const formatOld = parse(date, oldFormat, new Date());
    const updatedDate = format(new Date(formatOld), newFormat);

    return updatedDate;
  } catch (e) {
    return '';
  }
};

const extractProductName = (name: string) => {
  if (!name) return;

  const separatorIndex = name.lastIndexOf(' - ');

  if (separatorIndex === -1) return name;

  return name.substring(0, separatorIndex);
};

const getDateRangeInText = (date: string) => {
  const newDates = date.split(' - ');

  if (newDates.length > 1) {
    const startDateValues = newDates[0].split('-');
    const endDateValues = newDates[1].split('-');

    return `${convertDateString(startDateValues.join('-'), 'yyyy-MM-dd', 'dd MMM')} - ${convertDateString(
      endDateValues.join('-'),
      'yyyy-MM-dd',
      'dd MMM'
    )}`;
  }
  const startDateValues = newDates[0].split('-');

  return convertDateString(startDateValues.join('-'), 'yyyy-MM-dd', 'dd MMM');
};

const getSubCategoryPostfix = (category?: string) => {
  switch(category?.toLowerCase()){
    case 'dresses': 
      return ' Dresses';
    default:
      return '';
  }
}

const parsePhoneNumber = (value: string) : string => {
  if(isNonEmptyString(value))
    return value.replace(PHONE_NUMBER_PARSE_REGEX, '').replace(IND_PHONE_COUNTRY_CODE_REGEX, '')

  return value;
}

function moveElementToStart(arr, targetId, key = 'id') {
  const newArr = [...arr]
  if (Array.isArray(newArr)) {
    const index = newArr.findIndex(item => item[key] === targetId);
    if (index !== -1) {
        const element = newArr.splice(index, 1)[0];
        newArr.unshift(element);
    }
  }
  return newArr;
}

function getDateAndYear(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }) 
  const year = date.getFullYear();
  const suffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // Covers 4th-20th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  return { date: formattedDate, year,month,suffix: suffix(formattedDate) };
}




function splitIntoHalves(arr) {
  if (!isNonEmptyArray(arr)) return [[], []];

  if (arr.length < 5) {
    return [arr, null];
  }

  const midIndex = Math.ceil(arr.length / 2);
  const firstHalf = arr.slice(0, midIndex);
  const secondHalf = arr.slice(midIndex);

  return [firstHalf, secondHalf];
}

const formatPriceV2 = ({ amount, minFractionDigits = 2 }) => amount && amount.toLocaleString('en-US', { style: 'currency', currency: 'INR', minimumFractionDigits: minFractionDigits }) 

const formatPriceV3 = ({ amount, minFractionDigits = 2 }) => {
  const amountInt = Math.trunc(amount);
  
  const fractionDigits = amountInt !== amount ? minFractionDigits : 0;
  const truncatedAmount = Math.trunc(amount * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
  
  return formatPriceV2({ amount:truncatedAmount, minFractionDigits: fractionDigits });
};

export {
  formatPrice,
  formatPriceV2,
  formatPriceV3,
  formatDiscount,
  formatDateString,
  formatWord,
  getPriceRange,
  formatDateToWords,
  convertDateString,
  extractProductName,
  getDateRangeInText,
  parsePhoneNumber,
  getSubCategoryPostfix,
  moveElementToStart,
  splitIntoHalves,
  epochConverter,
  getDateAndYear
};
