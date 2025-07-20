import {STOCK_STATUS} from '~/constants/common';
import { isNonEmptyArray } from '~/utils/checks';

export const fetchDefaultProductSize = ({ variations } : any) => {
  let defaultSize: string | null = null,
    isOutOfStock = true;

  if (isNonEmptyArray(variations)) {
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];

      if (variation.stock_status === STOCK_STATUS.inStock) {
        if (!defaultSize) defaultSize = variation.size;
        isOutOfStock = false;

        if (variation.fast_delivery) {
          defaultSize = variation.size;

          break;
        }
      }
    }
  }

  return { defaultSize: defaultSize, isOutOfStock: isOutOfStock };
};


export const getParsedCarousalData = (data: any[]) =>
  data?.map((item: any) => ({
    url: item,
    type: "image",
  }));

export const getParsedVideoCarousalData = (data: any[]) =>
  data?.map((item: any) => ({
    ...item,
    type: "video",
  }));