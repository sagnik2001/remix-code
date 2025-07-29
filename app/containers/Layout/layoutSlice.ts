import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  app_config_data: {},
  showMarquee: true,
  showAppDownloadBanner: true,
  isNavigating : false,
  showCategoryBottomSheet : false,
  isWebAppLoading : false,
  bottomSheetStack : [],
  verifyAuthResponse : {},
  bogo_cart_scroll : false,
  header_banner_height : 0
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setAppConfigData: (state, action: PayloadAction<any>) => {
      state.app_config_data = action.payload;
    },
    setWebAppLoading : (state,action) => {
      state.isWebAppLoading = action.payload
    },
    closeMarquee: (state) => {
      state.showMarquee = false;
    },
    closeAppDownloadBanner: (state) => {
      state.showAppDownloadBanner = false;
    },
    handleNavigation : (state,action) => {
      state.isNavigating = action.payload;
    },
    resetBannerState: (state) => {
      state.showMarquee = true;
      state.showAppDownloadBanner = true;
    },
    setCategoryBottomSheet : (state,action) => {
       state.showCategoryBottomSheet = action.payload
    },
    setBottomSheetStack : (state,action) => {
        state.bottomSheetStack.push(action?.payload)
    },
    setVerifyAuthResponse : (state,action) => {
        state.verifyAuthResponse = action.payload
    },
    popBottomSheetStack : (state,action) => {
        state.bottomSheetStack.pop() 
    },
    setBogoCartScroll : (state,action) => {
        state.bogo_cart_scroll = action.payload
    },
    setHeaderBannerHeight : (state,action) => {
        state.header_banner_height = action.payload
    },
    resetLayoutSlice: () => initialState
  }
});

export const { setAppConfigData, closeMarquee, closeAppDownloadBanner, resetBannerState, resetLayoutSlice, handleNavigation,setCategoryBottomSheet,setWebAppLoading,setBottomSheetStack,popBottomSheetStack,setVerifyAuthResponse,setBogoCartScroll,setHeaderBannerHeight } = layoutSlice.actions;
export default layoutSlice.reducer;