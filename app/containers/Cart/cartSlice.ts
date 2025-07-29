import { findCartCount, findSelectedCartCount, getCartItems } from '~/utils/cart';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Cart, CartData } from './types';
import {  isNonEmptyString } from '~/utils/checks';

const initialState: Cart = {
  cart_data: {
    cart: {},
    applied_coupons: [],
    cart_totals: {},
    coupon_discount_totals: {},
    product_variations: {},
    potential_coupons: [],
  },
  cart_count: 0,
  cart_quantities: {},
  bag_discount: 0,
  out_of_stock_items: [],
  applied_coupon_code: '',
  is_coupon_applied: false,
  coupon_applied_modal_shown: false,
  show_pdp_add_to_bag_toast: false,
  cart_sheet_open: '',
  selected_item_count:0,
  selected_items:[],
  selected_variations:[],
  open_all_wishlist_bottomsheet:false,
  bundle_milestone : '',
  milestone_progress_value : ''
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setGetCartValue: (state, action: PayloadAction<CartData>) => {
      state.cart_data = action.payload;
      const { count, item_quantities, discount, out_of_stock_items } = findCartCount(
        action.payload.cart,
        true,
        action.payload.product_variations
      );
      const  {selectedCount,selectedProducts,selectedVariationId} =findSelectedCartCount(action.payload.cart)
      state.cart_count = count;
      state.bag_discount = discount;
      state.cart_quantities = item_quantities;
      state.out_of_stock_items = out_of_stock_items;
      state.selected_item_count=selectedCount;
      state.selected_items=selectedProducts;
      state.selected_variations=selectedVariationId
    },
    setUpdatedCartData: (state, action: PayloadAction<CartData>) => {
      state.cart_data = getCartItems(action.payload, state.cart_data.product_variations);
      const { count, discount, out_of_stock_items } = findCartCount(
        action.payload.cart,
        false,
        state.cart_data.product_variations
      );
      const   {selectedCount,selectedProducts,selectedVariationId} =findSelectedCartCount(action.payload.cart)
      state.cart_count = count;
      state.bag_discount = discount;
      state.out_of_stock_items = out_of_stock_items;
      state.selected_item_count=selectedCount;
      state.selected_items=selectedProducts;
      state.selected_variations=selectedVariationId
    },
    updateCartQuantities: (state, action: PayloadAction<Record<string, number>>) => {
      const { id, variation, quantity, isDelete } = action.payload;
      const key = `${id}${variation}`;
      const currentQuantities = { ...state.cart_quantities };

      if (isDelete) delete currentQuantities[key];
      else if (currentQuantities[key]) currentQuantities[key] += quantity;
      else currentQuantities[key] = quantity;

      state.cart_quantities = currentQuantities;
    },
    setCouponCodeState: (state, action: PayloadAction<string>) => {
      state.applied_coupon_code = action.payload;
    },
    setIsCouponApplied: (state, action: PayloadAction<boolean>) => {
      state.is_coupon_applied = action.payload;
    },
    setCouponAppliedModalShown: (state, action: PayloadAction<boolean>) => {
      state.coupon_applied_modal_shown = action.payload;
    },
    resetInvalidCoupon: (state, action: PayloadAction<boolean>) => {
      const { is_coupon_applied, applied_coupon_code } = state;
      const isBuyNow = action.payload;

      if (isBuyNow) {
        state.is_coupon_applied = false;
        state.coupon_applied_modal_shown = false;
        state.applied_coupon_code = '';
      } else if (is_coupon_applied && !isNonEmptyString(applied_coupon_code)) {
        state.is_coupon_applied = false;
        state.coupon_applied_modal_shown = false;
      }
    },
    setPdpToast: (state, action:PayloadAction<boolean>) => {
      state.show_pdp_add_to_bag_toast = action.payload;
    },
    openCartSheet:  (state, action:PayloadAction<string>) => {
      state.cart_sheet_open = action.payload;
    },
    closeCartSheet: (state) => {
      state.cart_sheet_open = '';
    },
    updateSelectedProducts:(state,action)=>{
      state.selected_items=action.payload
    },
    openAllWishlistItemBottomSheet:(state)=>{
      state.open_all_wishlist_bottomsheet=true
    },
    closeAllWishlistItemBottomSheet:(state)=>{
      state.open_all_wishlist_bottomsheet=false
    },
    resetCartSlice: () => initialState
  }
});

export const {
  setGetCartValue,
  setUpdatedCartData,
  updateCartQuantities,
  setCouponCodeState,
  setIsCouponApplied,
  setCouponAppliedModalShown,
  resetInvalidCoupon,
  setPdpToast,
  resetCartSlice,
  openCartSheet, 
  closeCartSheet,
  openAllWishlistItemBottomSheet,
  closeAllWishlistItemBottomSheet
} = cartSlice.actions;
export default cartSlice.reducer;
