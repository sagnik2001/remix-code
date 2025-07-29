// app/layout.tsx
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useContext,
    useMemo,
  } from "react";
  import {
    useLocation,
    useNavigate,
    Link,
    useNavigation,
  } from "@remix-run/react"; // ← Remix equivalents
  import {
    getHoardingURL,
    useLoggedIn,
    parseMilliSeconds,
    verifyUtmParamsChange,
    getWindowCustomLandingPage,
    rand1to10,
  } from "~/utils/common";
  import {
    useLazyGetCartItemsQuery,
    useLazyGetCartItemsv2Query,
  } from "~/containers/Cart/apiSlice";
import { useGetProfileMutation } from "~/containers/Profile/apiSlice";
  import {
    useLazyGetSystemConfigQuery,
    useLazyGetPageConfigQuery,
    useSendUserLocationMutation,
  } from "@Containers/Onboarding/apiSlice";
  import { RootState, useAppDispatch, useAppSelector } from "~/store";
  import { getProductIdsFromCart } from "@Utils/cart";
  import { useGetProductDetailsMutation } from "@Containers/Product-Details/apiSlice";
  import { addCartItemsToGtmProductList } from "@Utils/gtm";
  import {
    hasAuthToken,
    isEmptyString,
    isNonEmptyObject,
    isNonEmptyString,
  } from "@Utils/checks";
  import { setShowLoginBottomSheet } from "@Containers/Login/loginSlice";
  import TopHeader from "@Components/TopBanner";
  import AppBanner from "@Components/AppBanner";
  import Loader from "@Components/Loader";
  import LocalStorage, { SessionStorage } from "@Utils/storage";
  import styles from "./styles";
  import CanonicalHead from "@Components/CanonicalHead";
  import { generate_deep_link } from "@Utils/deeplinkgenerator";
  import { WebPopup } from "@Constants/common";
  import PopupBanner from "./components/PopupBanner";
  import { useLazyGetWishlistQuery } from "@Containers/Wishlist/apiSlice";
  import {
    SHOW_TRANSPARENT_GLOBAL_LOADER,
    SIGNUP_SHEET_MODAL_SHOWN,
    SHOW_SIGN_UP_SUCCESS_OR_FAILURE_MODAL,
  } from "@Constants/storageKeys";
  import {
    setSignupFailurePopupOpen,
    setSignupSuccessPopupOpen,
  } from "@Containers/SignupBottomSheet/signupBottomSheetSlice";
  import { HandleContext } from "_app";
  import LoginBottomSheetV2 from "@Components/LoginBottomSheet/indexV2";
  import { handleNavigation, setHeaderBannerHeight } from "./layoutSlice";
  import usePreventInspectTools, {
    handleKeyDown,
    preventDefaultContextMenu,
  } from "@Hooks/usePreventInspectTools";
  import {
    setCachedShopProducts,
    setShopPageNumber,
  } from "@Containers/ScrollRestoration/scrollSlice";
  import SaleTimerInit from "@Containers/SaleTimer/SaleTimerInit";
  import {
    resetOrderDetailsSlice,
    setOrderDetailSheet,
  } from "@Containers/OrderItemDetails/orderDetailsSlice";
  import { Toaster } from "sonner";
  
  const paddingRegex =
      /^\/(shop|collection\/.+|womens-collection\/.+|register\/.+|custom-layout\/.+|zip-landing\/.)$/,
    bannerUrlRegex =
      /(new-store|store-register|\/womens-collection\/|\/christmas-registration\/|\/custom-layout|\/zip-landing|\/valentine-registration|\/campus-challenge-registration|\/refer-and-earn)/,
    BANNER_HEIGHT = 60,
    MARQUEE_HEIGHT = 40;
  
  const isTopPaddingAllowed = ({
    pathname,
    asPath,
  }: {
    pathname: string;
    asPath: string;
  }) => {
    if (!isNonEmptyString(pathname)) return false;
    return !(paddingRegex.test(pathname) || bannerUrlRegex.test(asPath));
  };
  
  const excludePopupPaths = ["/valentine", "/login"],
    bannerPaths = [
      "/surprise-registration",
      "/popup",
      "/shop",
      "/collection",
      "/fresher-party-registration",
      "/black-friday",
      "/christmas-registration",
      "/custom-layout",
      "/zip-landing",
      "/valentine-registration",
      "/campus-challenge-registration",
      "/refer-and-earn",
    ],
    bannerUrlSubstring = [
      "new-store",
      "store-register",
      "/womens-collection/",
      "/christmas-registration",
      "custom-layout",
      "zip-landing",
      "valentine-registration",
      "campus-challenge-registration",
      "refer-and-earn",
    ],
    topHeaderPaths = [
      "/surprise-registration",
      "/popup",
      "/shop",
      "/collection",
      "/fresher-party-registration",
      "/black-friday",
      "/christmas-registration",
      "/custom-layout",
      "/zip-landing",
      "/valentine-registration",
      "/campus-challenge-registration",
      "/refer-and-earn",
    ],
    topHeaderUrlSubstring = [
      "new-store",
      "store-register",
      "/womens-collection/",
      "/christmas-registration",
      "/valentine-registration",
      "/campus-challenge-registration",
      "/refer-and-earn",
    ];
  
  const showComponentByPath = (type, pathname, asPath) => {
    let pathnames = null,
      urlSubstrings = null;
    switch (type) {
      case "banner":
        pathnames = bannerPaths;
        urlSubstrings = bannerUrlSubstring;
        break;
      case "topHeader":
        pathnames = topHeaderPaths;
        urlSubstrings = topHeaderUrlSubstring;
        break;
    }
  
    return (
      !(pathnames && pathnames.some((p) => pathname.includes(p))) &&
      !(urlSubstrings && urlSubstrings.some((s) => asPath.includes(s)))
    );
  };
  
  const getDefaultPopupData = (appConfig = {}) => {
    const { popup } = appConfig ?? {},
      { imageUrl } = popup?.default ?? {};
    return imageUrl ? { imageUrl } : {};
  };
  
  export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const handleFirstLoad = useContext(HandleContext);
    const location = useLocation();
    const navigate = useNavigate();
    const transition = useNavigation();
  
    const { pathname, search } = location;
    const asPath = pathname + search;
  
    const [getProfile] = useGetProfileMutation();
    const [getCartData, { data: getCartDataResponse }] =
      useLazyGetCartItemsQuery();
    const [getCartDataV2, { data: getCartDataResponseV2 }] =
      useLazyGetCartItemsv2Query();
    const [getProductDetails, { data: getProductDetailsResponse }] =
      useGetProductDetailsMutation();
    const [getWishlistData] = useLazyGetWishlistQuery();
    const [getPageConfig, { isLoading: isWebAppConfigLoading }] =
      useLazyGetPageConfigQuery();
    const [getSystemConfig] = useLazyGetSystemConfigQuery();
    const [sendUserLocation] = useSendUserLocationMutation();
    const dispatch = useAppDispatch();
  
    const {
      app_config_data: webAppDefaultConfig,
      showMarquee,
      showAppDownloadBanner,
      bogo_cart_scroll,
    } = useAppSelector((s: RootState) => s.layout);
  
    const {
      cart_v2_enabled,
      is_internal,
      shoplist_config,
      additional_meta_data,
    } = webAppDefaultConfig ?? {};
    const bannerData = additional_meta_data?.top_header ?? {};
    const defaultBannerData = { ...(bannerData["default"] ?? {}) };
    const { text } = defaultBannerData;
    const { giveaway_banner = "" } = shoplist_config ?? {};
  
    const appBarRef = useRef<HTMLDivElement>(null);
    const appDownloadBarRef = useRef<HTMLDivElement>(null);
  
    const [height, setHeight] = useState("0");
    const [open, setOpen] = useState(false);
    const [popupData, setPopupData] = useState<Record<string, string>>({});
    const [loginImageUrl, setLoginImageUrl] = useState("");
    const [loginRedirectUrl, setLoginRedirectUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const custom_landing_page = getWindowCustomLandingPage();
  
    /** parse fbclid & campaign from URL */
    const searchParams = useMemo(() => new URLSearchParams(search), [search]);
    const fbclid = searchParams.get("fbclid") ?? "";
    const campaign_name = searchParams.get("page_type") ?? "";
  
    const hasToken = hasAuthToken();
    const { user, isUserfetched } = useAppSelector(
      (s: RootState) => s.profile
    );
    const { isUserLoggedIn } = useLoggedIn();
    const { showLoginBottomSheet } = useAppSelector((s: RootState) => s.login);
    const isLoginBottomSheetOpen = showLoginBottomSheet && !isUserLoggedIn;
  
    /** ROUTE CHANGE HANDLING */
    const handleRouteChange = useCallback(
      (url: string) => {
        if (
          !isEmptyString(url) &&
          !url.includes("/product") &&
          !url.includes("/shop") &&
          !url.includes("/collection") &&
          !url.includes("/womens-collection") &&
          !url.includes(
            `/custom-layout?page_type=${sessionStorage.getItem("page-type")}`
          ) &&
          !url.includes(
            `/zip-landing?page_type=${sessionStorage.getItem("page-type")}`
          )
        ) {
          dispatch(setCachedShopProducts([]));
          dispatch(setShopPageNumber(0));
        }
        dispatch(handleNavigation(true));
        setIsLoading(true);
      },
      [dispatch]
    );
  
    const handleRouteChangeComplete = useCallback(
      (url: string) => {
        dispatch(handleNavigation(false));
        setIsLoading(false);
        dispatch(setOrderDetailSheet(""));
        dispatch(resetOrderDetailsSlice());
  
        if (SessionStorage.getItem(SHOW_TRANSPARENT_GLOBAL_LOADER)) {
          SessionStorage.removeItem(SHOW_TRANSPARENT_GLOBAL_LOADER);
        }
  
        const signupState = SessionStorage.getItem(
          SHOW_SIGN_UP_SUCCESS_OR_FAILURE_MODAL
        );
        if (signupState) {
          SessionStorage.setItem(SIGNUP_SHEET_MODAL_SHOWN, "true");
          if (signupState === "success") dispatch(setSignupSuccessPopupOpen(true));
          else dispatch(setSignupFailurePopupOpen(true));
          SessionStorage.removeItem(SHOW_SIGN_UP_SUCCESS_OR_FAILURE_MODAL);
        }
      },
      [dispatch]
    );
  
    /** fire on transition */
    useEffect(() => {
      if (transition.state === "loading") handleRouteChange(asPath);
      else if (transition.state === "idle")
        handleRouteChangeComplete(asPath);
    }, [transition.state, asPath, handleRouteChange, handleRouteChangeComplete]);
  
    /** INITIAL DATA LOAD */
    const handleLayoutFirstLoad = useCallback(async () => {
      await handleFirstLoad();
      // TagManager.initialize({ gtmId: GTM_ID });
  
      if (hasToken) {
        if (
          cart_v2_enabled ||
          custom_landing_page ||
          pathname === "/custom-layout"
        ) {
          getCartDataV2(
            pathname === "/custom-layout"
              ? { multi_buy_now: true, campaign_name }
              : {}
          );
        } else getCartDataV2({});
        getProfile({});
        getWishlistData({});
      } else if (custom_landing_page || pathname === "/custom-layout") {
        getCartDataV2({});
      }
  
      const utmString = verifyUtmParamsChange({ searchParams });
      getPageConfig({
        page_type: "default",
        utmString: utmString || null,
      });
      getSystemConfig({});
    }, [
      handleFirstLoad,
      getCartDataV2,
      getProfile,
      getWishlistData,
      getPageConfig,
      getSystemConfig,
      hasToken,
      custom_landing_page,
      pathname,
      campaign_name,
      searchParams,
    ]);
  
    useEffect(() => {
      handleLayoutFirstLoad();
    }, [handleLayoutFirstLoad]);
  
    /** FBCLID & INSPECT PREVENTION */
    useEffect(() => {
      if (fbclid) SessionStorage.setItem("fbclid", fbclid);
      return usePreventInspectTools(is_internal);
    }, [fbclid, is_internal]);
  
    useEffect(() => {
      if (is_internal) {
        document.removeEventListener("contextmenu", preventDefaultContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      }
    }, [is_internal]);
  
    /** CART → GTM PRODUCT DETAILS */
    useEffect(() => {
      if (cart_v2_enabled || custom_landing_page) {
        if (isUserLoggedIn && getCartDataResponseV2) {
          const ids = getProductIdsFromCart(getCartDataResponseV2.cart);
          if (ids.length) getProductDetails({ product_ids: ids });
        }
      } else {
        if (isUserLoggedIn && getCartDataResponse) {
          const ids = getProductIdsFromCart(getCartDataResponse.cart);
          if (ids.length) getProductDetails({ product_ids: ids });
        }
      }
    }, [
      cart_v2_enabled,
      custom_landing_page,
      getCartDataResponse,
      getCartDataResponseV2,
      isUserLoggedIn,
      getProductDetails,
    ]);
  
    useEffect(() => {
      const details = getProductDetailsResponse?.product_details || [];
      if (details.length) addCartItemsToGtmProductList(details);
    }, [getProductDetailsResponse]);
  
    /** HEADER HEIGHT CALC */
    const topPaddingAllowed = useMemo(
      () => isTopPaddingAllowed({ pathname, asPath }),
      [pathname, asPath]
    );
    const notPdp = pathname !== "/product/[productName]";
  
    useEffect(() => {
      const base = showAppDownloadBanner && !bogo_cart_scroll ? BANNER_HEIGHT : 0;
      const marquee =
        showMarquee && isNonEmptyString(text) && notPdp
          ? MARQUEE_HEIGHT
          : 0;
      const total = base + marquee;
      dispatch(setHeaderBannerHeight(`${total}px`));
      setHeight(`${total}px`);
    }, [
      dispatch,
      showAppDownloadBanner,
      bogo_cart_scroll,
      showMarquee,
      text,
      notPdp,
    ]);
  
    /** POPUP LOGIC **/
    useEffect(() => {
      let popupTimer: number;
      const pagePopup = webAppDefaultConfig?.additional_meta_data?.page_popup || {};
      const popupMap = webAppDefaultConfig?.additional_meta_data?.popup || {};
      const hoardings = webAppDefaultConfig?.additional_meta_data?.hoardings || {};
      const [url, redirect] = getHoardingURL(hoardings);
      setLoginImageUrl(url);
      setLoginRedirectUrl(redirect);
  
      if (
        pathname.includes("/surprise-registration") ||
        pathname.includes("/popup") ||
        asPath.includes("/login/?callback=")
      )
        return;
  
      // page-specific popup
      if (pagePopup[pathname]) {
        clearTimeout(popupTimer);
        setPopupData(pagePopup[pathname]);
        popupTimer = window.setTimeout(
          () => setOpen(true),
          parseMilliSeconds(pagePopup[pathname].timeout) || 10
        );
      }
      // purchased user popup
      else if (
        user?.download_app_nudge &&
        popupMap.purchased_user &&
        !SessionStorage.getItem(WebPopup.APP_DOWNLOAD_POPUP) &&
        !excludePopupPaths.some((p) => pathname.includes(p))
      ) {
        clearTimeout(popupTimer);
        const temp = { ...popupMap.purchased_user };
        const deeplinkUrl = generate_deep_link(
          window.location.href,
          temp.deeplink
        );
        if (deeplinkUrl) temp.redirectUrl = deeplinkUrl;
        setPopupData(temp);
        popupTimer = window.setTimeout(
          () => setOpen(true),
          parseMilliSeconds(temp.timeout) || 5000
        );
      }
      // default popup
      else if (
        !SessionStorage.getItem(WebPopup.WEB_POPUP) &&
        getDefaultPopupData(webAppDefaultConfig?.additional_meta_data)
          .imageUrl &&
        !SessionStorage.getItem(WebPopup.APP_DOWNLOAD_POPUP) &&
        !excludePopupPaths.some((p) => pathname.includes(p))
      ) {
        clearTimeout(popupTimer);
        setPopupData(getDefaultPopupData(webAppDefaultConfig?.additional_meta_data));
        popupTimer = window.setTimeout(
          () => setOpen(true),
          parseMilliSeconds(
            getDefaultPopupData(webAppDefaultConfig?.additional_meta_data)
              .timeout
          ) || 5000
        );
      }
  
      return () => {
        clearTimeout(popupTimer);
        setOpen(false);
        setPopupData({});
      };
    }, [webAppDefaultConfig, pathname, asPath, user, isUserfetched]);
  
    const handleClose = useCallback(() => setOpen(false), []);
    const handleLoginBottomSheetClose = useCallback(
      () => dispatch(setShowLoginBottomSheet(false)),
      [dispatch]
    );
  
    const loginBannerImage = LocalStorage.getItem("loginBanner");
  
    const updatedChildren = React.Children.map(children, (child) =>
      React.cloneElement(child as React.ReactElement, {
        bannerHeight: height,
        isUserLoggedIn,
        is_bogo_live_for_user:
          webAppDefaultConfig?.is_bogo_live_for_user,
        isWebAppConfigLoading,
        skipReferAndEarn:
          webAppDefaultConfig?.additional_meta_data
            ?.skip_refer_and_earn ?? false,
      })
    );
  
    const handleTopHeaderClick = useCallback(() => {
      const data = getDefaultPopupData(
        webAppDefaultConfig?.additional_meta_data
      );
      if (isNonEmptyObject(data)) {
        setOpen(true);
        setPopupData(data);
      }
    }, [webAppDefaultConfig]);
  
    /** GEOLOCATION **/
    useEffect(() => {
      try {
        if (navigator.permissions?.query) {
          hasAuthToken() &&
            navigator.permissions.query({ name: "geolocation" }).then((p) => {
              if (["granted", "prompt"].includes(p.state)) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  sendUserLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                  });
                });
              }
            });
        }
      } catch {}
    }, [sendUserLocation]);
  
    /** SERVICE WORKER **/
    useEffect(() => {
      async function registerSW() {
        if (!("serviceWorker" in navigator)) return;
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          if (regs.length) return;
          const reg = await navigator.serviceWorker.register(
            "/service-worker.js"
          );
          console.log("SW registered:", reg.scope);
        } catch (err) {
          console.error("SW failed:", err);
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
      }
      registerSW();
    }, []);
  
    return (
      <div id="root" style={styles.root}>
        <CanonicalHead />
  
        {showComponentByPath("banner", pathname, asPath) &&
          !bogo_cart_scroll && (
            <AppBanner
              ref={appDownloadBarRef}
              showCloseIcon
              giveaway_banner={giveaway_banner}
            />
          )}
  
        {showComponentByPath("topHeader", pathname, asPath) && notPdp && (
          <TopHeader
            ref={appBarRef}
            onClick={handleTopHeaderClick}
            customStyles={{
              ...(isNonEmptyObject(popupData) && { cursor: "pointer" }),
            }}
            top={showAppDownloadBanner && !bogo_cart_scroll ? BANNER_HEIGHT : 0}
          />
        )}
  
        <div
          style={{
            position: "relative",
            height: `calc(100vh - ${
              topPaddingAllowed ? height : "0px"
            })`,
            paddingTop: topPaddingAllowed ? height : 0,
          }}
        >
          <Loader
            isLoading={isLoading}
            isWhiteBackground={
              !SessionStorage.getItem(SHOW_TRANSPARENT_GLOBAL_LOADER)
            }
            customStyles={{ zIndex: 3000 }}
          />
  
          <SaleTimerInit />
  
          {updatedChildren}
        </div>
  
        {showComponentByPath("topHeader", pathname, asPath) && (
          <PopupBanner
            open={open}
            handleClose={handleClose}
            popupData={popupData}
            handleWebPopUpClose={handleClose}
          />
        )}
  
        {isLoginBottomSheetOpen && (
          <LoginBottomSheetV2
            open={isLoginBottomSheetOpen}
            onClose={handleLoginBottomSheetClose}
            imageUrl={loginImageUrl}
            redirectUrl={loginRedirectUrl}
          />
        )}
  
        <div className="flex justify-center items-center">
          <Toaster
            position="bottom-center"
            richColors
            closeButton={false}
            className="pointer-events-auto"
          />
        </div>
  
        <div style={{ display: "none" }}>
          <img
            src={loginBannerImage || ""}
            loading="lazy"
            alt="login-banner"
          />
        </div>
      </div>
    );
  };
  