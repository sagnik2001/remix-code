import { CartItem } from '~/types/common';
import { STOCK_STATUS } from '~/constants/common';
import { isNonEmptyObject } from './checks';

export const findCartCount = (
  cart_items: Record<string, CartItem>,
  calculate_quantity: any,
  product_variations: any
) => {
  let count = 0;
  let discount = 0;
  const out_of_stock_items: any = [];
  const item_quantities: any = {};

  Object.keys(cart_items).forEach((item) => {
    const { product_id, variation_id, quantity, line_discount, variation, line_subtotal, title ,is_selected=true} = cart_items[item];

    count += quantity || 0;
    discount += is_selected&&line_discount;
    if (calculate_quantity) item_quantities[`${product_id}${variation_id}`] = quantity;

    if (product_variations) {
      const itemVariation = product_variations[product_id]?.find(
        (itemVariations: any) => itemVariations.variation_id === variation_id
      );

      if (itemVariation?.stock_status === STOCK_STATUS.outOfStock && is_selected) {
        const data = {
          product_id,
          variation_id,
          quantity,
          variation,
          line_subtotal,
          title
        };

        out_of_stock_items.push(data);
      }
    }
  });

  return { count, item_quantities, discount, out_of_stock_items };
};

export const findSelectedCartCount = (cartData:any) => {
  let selectedCount = 0;
  let selectedProducts=[]
  let selectedVariationId=[]
  Object.values(cartData).forEach(item => {
    const isSelected = item?.is_selected ?? true; // Default to true if is_selected is not present

    if (isSelected) {
      selectedCount += item.quantity; // Increase count by the item's quantity
      selectedProducts.push(item.product_id)
      selectedVariationId.push(item.variation_id)
    }
  });

  return {selectedCount,selectedProducts,selectedVariationId};
}
export const getCartItems = (payload: any, product_variations: any) => {
  let data = { ...payload };
  if (isNonEmptyObject(payload.cart) && !payload.product_variations) data = { ...data, product_variations };

  return data;
};

export const calculateDiscountPercentage = (price: number, discount: number) => {
  if (price === 0) return;
  const discountPercentage = (discount / price) * 100;

  return Math.round(discountPercentage);
};

export const getProductIdsFromCart = (cartItems: Record<string, CartItem>) => {
  const cartItemsArray = Object.keys(cartItems).map((key) => cartItems[key]);

  if (cartItemsArray.length === 0) return null;
  const productIds = cartItemsArray.map((item) => item.product_id);

  return productIds;
};
