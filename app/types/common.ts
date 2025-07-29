export type VariationType = {
    fast_delivery: boolean;
    id: number;
    regular_price: string;
    sale_price: string;
    size: string;
    stock_status: string;
    variation: { attribute_pa_size: string };
    variation_id: number;
    parent_variation_id?: number;
  };
  
  export type VariationId = {
    id: number;
  };
  
  export type DeepLinkParams = {
    tag?:string;
    category?: string;
    sort_by?: string;
    subcategory?: string;
    size?: string;
    color?: string;
  }

  import { VariationType } from '@Containers/Shop/type';

export interface CartProduct {
  product_id: number;
  parent_id?: number;
  variation_id: number;
  quantity: number;
  variation: {
    attribute_pa_size: string;
  };
  is_returnable?: boolean;
  is_selected?:boolean;
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
}

export interface CartItem {
  title: string;
  line_subtotal: number;
  line_discount: number;
  line_total: number;
  product_id: number;
  slug?: string;
  thumb_url: string;
  variation: { attribute_pa_size?: string };
  data_hash?: string;
  key?: string;
  quantity?: number;
  variation_id?: number;
  variations?: Array<VariationType>;
  fast_delivery_date?: string;
  normal_delivery_date?: string;
  is_returnable?: boolean;
}

export interface CartData {
  cart: Array<CartItem>;
  cart_totals: CartTotals;
  cart_item_count: number;
}

export interface GuestCart {
  cart_data: CartData;
  products: Array<CartProduct>;
}

export interface UpdateCart {
  newId: number;
  newSize: string;
  quantity: number;
  index: number;
  itemFoundAt: number;
}
