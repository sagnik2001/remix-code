import React, { CSSProperties, memo, useCallback, useMemo, useRef, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { getParsedCarousalData, getParsedVideoCarousalData } from "../utils";
import 'swiper/css';
import { CarouselDataItem } from "./types";
import { isNonEmptyArray, isNonEmptyString } from "~/utils/checks";
import { getOptimizedImageUrl } from "~/utils/getOptimizedImgUrl";
import styles from '~/containers/Product-Details/NewRenderUi/styles.ts';
import { colors } from "~/constants/colors";
import { CONTAINER_IDS } from "./constants.ts";
import { scrollToContainer, scrollToContainerWithOffset } from "~/utils/common.ts";
import ProductInfoWrapper from "./components/ProductInfoWrapper/index.tsx";

const PdpImgActionCtaModule = React.lazy(
  () => import('./components/PdpImgActionCta/index.tsx'),
);

const NewRenderUi = ({
  productData,
  singlePreloadImageUrl,
  isBottomSheet = false,
  eventSrc = '',
  notifyOosProduct,
  isOutOfStock,
}: any) => {

  const product = productData?.[0];
  const [currentIndex, setCurrentIndex] = useState(0);


  const {
    image_gallery_metadata: imageMetadata = [],
    view_similar_text: viewSimilarText,
    image_gallery_prefixes: imagePrefixes = [],
    base_image_url,
    best_price_image,
    referral_banner,
    delivery_info,
    slug,
    id
  } = product ?? {};

  const swiperRef = useRef<SwiperCore | null>(null);
  const videoRef = useRef(null)


  const isStretchedFromMeta = (metaArray) => {
    if (!Array.isArray(metaArray) || metaArray.length === 0) return false;

    const { width, height } =
      metaArray.reduce((largest, current) =>
        current?.width > largest?.width ? current : largest
      ) || {};

    if (!width || !height) return false;

    const aspectRatio = width / height;
    const expectedAspectRatio = 2 / 3;

    return Math.abs(aspectRatio - expectedAspectRatio) > 0.01;
  };

  const scrollToSimilarProducts = useCallback(
    () => {
      scrollToContainer(`#${CONTAINER_IDS.PDP_SIMILAR_PRODUCT}`, {});

    },
    [id],
  );

  const scrollToComponent = useCallback((meta, id) => {
    scrollToContainerWithOffset(id);
  }, []);



  let memomizedImgMetaGallery = useMemo(() => {
    const data = [...imageMetadata];
    const lastItem = data[data.length - 1];
    data.push(lastItem);
    return data;
  }, [imageMetadata]);

  let memonizedImagePrefixGallery = useMemo(() => {
    if (!isNonEmptyArray(imagePrefixes)) return [];
    const data = [...imagePrefixes];
    const lastItem = data[data.length - 1];
    data.push(lastItem);
    return data;
  }, [imagePrefixes]);


  const carouselData = useMemo(
    () => getParsedCarousalData(product?.gallery),
    [product?.gallery],
  );
  const carouselVideoData = useMemo(
    () => getParsedVideoCarousalData(product?.video_gallery),
    [product?.video_gallery],
  );

  const { carousel_data, videoIndex } = useMemo(() => {
    const data = [...carouselData];
    data.splice(1, 0, ...carouselVideoData);
    const lastItem = data[data.length - 1];
    data.push(lastItem);
    const videoIdx = data.findIndex((item) => item.type === 'video');
    return { carousel_data: data, videoIndex: videoIdx };
  }, [carouselData, carouselVideoData]);

  const customDotRenderer = useCallback(() => {
    return (
      <div style={styles.customDotsContainer as CSSProperties}>
        {carousel_data.map((item, idx) =>
          item.type === 'video' ? (
            <VideoDot key={`video-dot-${idx}`} color={colors.WHITE} />
          ) : (
            <div
              key={`image-dot-${idx}`}
              style={{
                ...styles.customDot,
                ...(idx === currentIndex && styles.activeCustomDot),
              }}
            />
          )
        )}
      </div>
    );
  }, [carousel_data, currentIndex]);


  const onCarouselImageChange = (index: number) => {
    setCurrentIndex(index);
  }

  const customRenderItem = useCallback(
    (item: CarouselDataItem, idx: number) => {
      if (item.type === 'video') {
        // videoIndex set in useMemo
      }
      const relIndex =
        idx === 0 || item.type !== 'image'
          ? idx
          : idx - (carouselVideoData?.length ?? 0);
      const imgSrcSet = memomizedImgMetaGallery[relIndex];

      let optimizedFinalUrl = '';
      if (item.type === 'image') {
        const optimizedUrl = getOptimizedImageUrl(imgSrcSet, '').url;
        const prefixUrl = memonizedImagePrefixGallery[relIndex];
        optimizedFinalUrl =
          isNonEmptyString(prefixUrl) && isNonEmptyString(base_image_url)
            ? base_image_url + prefixUrl + optimizedUrl
            : optimizedUrl;
      }

      const isStretched = isStretchedFromMeta(imgSrcSet);

      return (
        <SwiperSlide
          key={idx}
          style={{ height: '100%', width: '100%', position: 'relative' }}
          onClick={() =>
            item.type === 'video'
              ? undefined
              : handleCarouselItemClick(
                idx >= carouselVideoData.length
                  ? idx - carouselVideoData.length
                  : idx
              )
          }
        >
          {item.type === 'image' ? (
            <img
              fetchPriority={idx < 1 ? 'high' : 'auto'}
              loading={idx < 1 ? 'eager' : 'lazy'}
              src={optimizedFinalUrl}
              alt="pdp-img"
              height={singlePreloadImageUrl?.height}
              width={singlePreloadImageUrl?.width}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '2 / 3',
                display: 'block',
                objectFit: isStretched ? 'cover' : 'fill',
              }}
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              height={singlePreloadImageUrl?.height}
              width={singlePreloadImageUrl?.width}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '2 / 3',
                objectFit: 'cover',
                display: 'block',
              }}
              playsInline
            >
              <source src={item.url} />
              Your browser does not support the video tag.
            </video>
          )}
        </SwiperSlide>
      );
    },
    [
      carousel_data,
      carouselVideoData.length,
      //   handleCarouselItemClick,
      //   memoizedImgMetaGallery,
      //   memoizedImagePrefixGallery,
      singlePreloadImageUrl,
      //   base_image_url,
    ]
  );

  return (
    <div className="text-nm_black_2 h-full max-w-[450px] w-full box-border">
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Swiper
          slidesPerView={1}
          onSlideChange={(e) => onCarouselImageChange(e.realIndex)}
          loop
          onInit={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {carousel_data.map((item, idx) => customRenderItem(item, idx))}
          {customDotRenderer()}
          {/* 
        <CustomBackButton />
        <CustomCartRenderIcon />
        <CustomArrowRender handlePrevious={handlePrevious} handleNext={handleNext} /> */}
        </Swiper>
        <div
            className={`w-full absolute flex items-center bottom-[12px] ${
              !isBottomSheet ? 'justify-between' : 'justify-end'
            }`}
          >
            <PdpImgActionCtaModule
              productId={id}
              title={viewSimilarText}
              scrollToSimilarProducts={scrollToSimilarProducts}
              scrollToComponent={scrollToComponent}
            />
          </div>
      </div>
      <div>
         <ProductInfoWrapper
          id={id}
          product={product}
          notifyOosProduct={notifyOosProduct}
          isOutOfStock={isOutOfStock}
          isBottomSheet={isBottomSheet}
          productCachedData={productData}
         />
      </div>
    </div>
  )
}

export default memo(NewRenderUi)