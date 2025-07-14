
/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from 'redux';

import { baseApi } from '~/services/api';
// import { LoginSlice as LoginReducer } from '@Containers/Login/loginSlice';
// import { profileSlice } from '@Containers/Profile/profileSlice';
// import { homeSlice } from '@Containers/Home/homeSlice';
// import { guestCartSlice } from '@Containers/GuestCart/guestCartSlice';
// import { cartSlice } from '@Containers/Cart/cartSlice';
// import { addressSlice } from '@Containers/Address/addressSlice';
// import { searchSlice } from '@Containers/Search/searchSlice';
// import { wishlistSlice } from '@Containers/Wishlist/wishlistSlice';
// import { searchKeySlice } from '@Containers/Search/searchKeySlice';
// import { checkoutSlice } from '@Containers/Checkout/checkoutSlice';
// import { scrollSlice } from '@Containers/ScrollRestoration/scrollSlice';
// import { shopSlice } from '@Containers/Shop/shopSlice';
// import { signupSlice } from '@Containers/SignupBottomSheet/signupBottomSheetSlice';
// import { storesSlice } from '@Containers/Stores/storesSlice';
// import { layoutSlice } from '@Layouts/layoutSlice';
// import { recommendedProductsSlice } from '@Components/RecommendedProducts/recommendedProductsSlice';
// import { recommendationSheetSlice } from '@Containers/RecommendationSheet/recommendationSheetSlice';
// import { productDetailsSlice } from '@Containers/Product-Details/productDetailsSlice';
// import { orderItemDetailsSlice } from '@Containers/Orders/orderItemDetailsSlice';
// import { productRatingSlice } from '@Containers/RateProductV2/productRatingSlice';
// import { ratingReviewSheetSlice } from '@Containers/Product-Details/components/RatingsV2/ratingReviewSheetSlice';
// import { navigationBottomSheetSlice } from '@Containers/NavigatorBottomSheet/navigationBottomSheetSlice';
// import {blackFridaySlice} from '@Containers/BlackFridayContainer/blackFridaySlice';
// import { addressSheetSlice } from '@Components/AddressCardV2/addressSheetSlice';
// import { verifyPhoneSlice } from '@Containers/VerifyPhone/verifyPhoneSlice';
// import { saleTimerSlice } from '@Containers/SaleTimer/saleTimerSlice';
// import orderDetailsSlice, { OrderDetailsSlice } from '@Containers/OrderItemDetails/orderDetailsSlice';
// import { customLayoutProductsSlice } from '@Containers/CustomLanding/components/ProductList/productListSlice';
// import { productDetailsTimerSlice } from '@Containers/Product-Detailsv2/pdpTimerSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
//   login: LoginReducer.reducer,
//   profile: profileSlice.reducer,
//   home: homeSlice.reducer,
//   guestCart: guestCartSlice.reducer,
//   cart: cartSlice.reducer,
//   search: searchSlice.reducer,
//   wishlist: wishlistSlice.reducer,
//   address: addressSlice.reducer,
//   searchKey: searchKeySlice.reducer,
//   checkout: checkoutSlice.reducer,
//   scroll: scrollSlice.reducer,
//   shop: shopSlice.reducer,
//   signupSlice: signupSlice.reducer,
//   stores: storesSlice.reducer,
//   layout: layoutSlice.reducer,
//   blackFridayReg: blackFridaySlice.reducer,
//   recommededProducts: recommendedProductsSlice.reducer,
//   recommedationSheet: recommendationSheetSlice.reducer,
//   navigationBottomSheet: navigationBottomSheetSlice.reducer,
//   productDetails: productDetailsSlice.reducer,
//   productTimerDetails : productDetailsTimerSlice.reducer,
//   orderItemDetails: orderItemDetailsSlice.reducer,
//   productRating: productRatingSlice.reducer,
//   rating: ratingReviewSheetSlice.reducer,
//   addressSheet: addressSheetSlice.reducer,
//   verfiyPhone: verifyPhoneSlice.reducer,
//   saleTimer: saleTimerSlice.reducer,
//   orderDetailsEditSheet: OrderDetailsSlice.reducer,
//   customsLayoutProducts: customLayoutProductsSlice.reducer,
});

export default rootReducer;
