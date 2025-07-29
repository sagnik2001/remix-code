import { APITags } from '~/constants/api';
import { baseApi } from '~/services/api';
import { setGetCartValue } from './cartSlice';
import { CART_ACTION_TYPE } from './constants';
import { isObject } from '~/utils/checks';

const cartApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateCart: builder.mutation({
      query: (body) => {
        return {
          url: `cart/update`,
          method: 'POST',
           body: body,
        };
      },
      invalidatesTags: [APITags.GET_CART],
      // TODO figure out why getCartItems is not invalidated after login
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) dispatch(setGetCartValue(data?.cart_data));
        } catch (error) {
          console.log(error)
        }
      }
    }),
    getCartItems: builder.query({
      query: () => ({
        url: 'cart'
      }),
      providesTags: [APITags.GET_CART],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) dispatch(setGetCartValue(data));
        } catch (error) {
          console.log(error)
        }
      }
    }),
    checkCartOffer: builder.mutation({
      query: (body) => ({
        url: `cart/offer`,
        method: 'POST',
        body
      })
    }),
    removeCartOffer: builder.mutation({
      query: (code) => ({
        url: `cart/offer/remove`,
        method: 'POST',
        body: {
          offer: {
            coupon_code: code
          }
        }
      })
    }),
    updateCartv2: builder.mutation({
      query: (body) => {
        return {
          url: `/cart/v2`,
          method: 'POST',
           body: body,
        };
      },
      // invalidatesTags: [APITags.GET_CART],
      // TODO figure out why getCartItems is not invalidated after login
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;        
          if (data) dispatch(setGetCartValue(data));
        } catch (error) {
          console.log(error)
        }
      }
    }),
    getCartItemsv2: builder.query({
      query: (payload) => ({
        url: '/cart/v2',
        params: payload ? { ...payload } : {},
      }),
      // providesTags: [APITags.GET_CART],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) dispatch(setGetCartValue(data));
        } catch (error) {
          console.log(error)
        }
      }
    }),
    checkCartOfferv2: builder.mutation({
      // query: (body) => ({
      //   url: `cart/v2`,
      //   method: 'POST',
      //   body:isObject(body)?{...body,action_type:CART_ACTION_TYPE.COUPON_APPLY}:{}
      // })
      query: (body) => {
        return {
          url: `/cart/v2`,
          method: 'POST',
          body:isObject(body)?{...body,action_type:CART_ACTION_TYPE.COUPON_APPLY}:{}
        };
      },
    }),
    removeCartOfferv2: builder.mutation({
      query: (body) => {
        return {
          url: `/cart/v2`,
          method: 'POST',
           body: {
            applied_coupons:[],
            action_type:CART_ACTION_TYPE.COUPON_REMOVE
          },
        };
      },
    }),
  }),
});

export const {
  useLazyGetCartItemsQuery,
  useCheckCartOfferMutation,
  useUpdateCartMutation,
  useRemoveCartOfferMutation,
  useUpdateCartv2Mutation,
  useLazyGetCartItemsv2Query,
  useCheckCartOfferv2Mutation,
  useRemoveCartOfferv2Mutation
} = cartApis;
