import { CouponItem } from '@Containers/Coupons/types';
import { VariationType } from '@Containers/Shop/type';

export interface CartItem {
  title: string;
  line_subtotal: number;
  line_discount: number;
  line_total: number;
  product_id: number;
  parent_id?: number;
  slug?: string;
  thumb_url: string;
  variation: { attribute_pa_size?: string };
  data_hash?: string;
  key?: string;
  quantity?: number;
  variation_id?: number;
  parent_variation_id?: number;
  variations?: Array<VariationType>;
  fast_delivery_date?: string;
  normal_delivery_date?: string;
}

export interface CartTotals {
  subtotal?: number;
  subtotal_tax?: number;
  shipping_total?: string;
  shipping_tax?: number;
  shipping_taxes?: unknown;
  shipping_discount?: number;
  discount_total?: number;
  discount_tax?: number;
  cart_contents_total?: string;
  cart_contents_tax?: number;
  cart_contents_taxes?: unknown;
  fee_total?: string;
  bag_discount?: number;
  fee_tax?: number;
  fee_taxes?: unknown;
  total?: string;
  total_tax?: number;
  _via_wallet?: number;
  _via_wallet_msg?: string;
  _cod_charge?: number;
  _bogo_sale_discount?: number;
  bundle_discount ?: number;
  custom_fee_lines?: Array<Record<string, string>>;
}
export interface CartData {
  cart: Record<string, CartItem>;
  applied_coupons?: Array<string>;
  cart_totals?: CartTotals;
  coupon_discount_totals?: Record<string, number>;
  product_variations?: Record<string, Array<VariationType>>;
  potential_coupons: Array<CouponItem>;
  applied_bogo?: Record<string, number>;
}

export interface OutOfStockRecord {
  product_id: number;
  variation_id: number;
  quantity: number;
  variation: {
    attribute_pa_size: string;
  };
  title: string;
  line_subtotal: number;
}

export interface Cart {
  cart_data: CartData;
  cart_count: number;
  cart_quantities: { [key: string]: number };
  bag_discount: number;
  out_of_stock_items: Array<OutOfStockRecord>;
  applied_coupon_code: string;
  is_coupon_applied: boolean;
  coupon_applied_modal_shown: boolean;
  show_pdp_add_to_bag_toast : boolean;
  cart_sheet_open: string;
  selected_items:Array<string>;
  selected_item_count:number;
  selected_variations:any;
  open_all_wishlist_bottomsheet:boolean;
  bundle_milestone ?: string;
  milestone_progress_value ?: string;
}

export interface UpdateCartBody {
  product_id: number;
  variation_id: number;
  variation: { attribute_pa_size: string };
  quantity: number;
  request_feed_type ?: string;
}

export interface GradientText {
  message: string;
  note?: string;
}

