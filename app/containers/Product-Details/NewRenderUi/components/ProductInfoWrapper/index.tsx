import { lazy, memo, useCallback, useMemo, useState } from "react"
import ProductPriceInfo from "../ProductPriceInfo"
import { RootState, useAppSelector } from "~/store";
import { isNonEmptyObject } from "~/utils/checks";
import styles from "../../styles";

const PriceDropSection = lazy(() => import('../PriceDropSection'));
const OffersAndCouponsModule = lazy(() => import('../OfferAndCoupons'));

const ProductInfoWrapper = ({product,notifyOosProduct,
    isOutOfStock,isBottomSheet,productCachedData,id}) => {

    const [selectedSize, setSelectedSize] = useState('')
    const user = useAppSelector((state: RootState) => state?.profile?.user) ?? '';
    const  {
        size_remarks: sizeRemarks,
        color_variants: colorVariants,
        show_size,
        disable_size_autoselect,
      } = product ?? {}


    const getVariation = useCallback(
        () =>
          product?.variations?.filter(
            (variation) => variation.size === selectedSize,
          ),
        [product?.variations, selectedSize, user?.id],
      )

    const selectedVariant = useMemo(
        () => getVariation(),
        [product?.variations, selectedSize],
      );

    return (
        <>
        <div className="mb-[12px]">
           <ProductPriceInfo
              selectedVariant={selectedVariant}
              variations={product?.variations ?? []}
              selectedSize={selectedSize}
              title={product?.name ?? ''}
              showSku={product?.show_sku ?? false}
              styleId={product?.style_id ?? ''}
              productId={product?.product_id ?? 0}
              tag={product?.display_tag}
              isBottomSheet={isBottomSheet}
              productCachedData={productCachedData}
              product={product}
              id={id}
              notifyOosFlag={notifyOosProduct}
              isOutOfStock={isOutOfStock}
            />
             {product?.pdp_best_price_title &&
            isNonEmptyObject(product?.pdp_best_price_title) && (
              <PriceDropSection
                pdpBestPriceData={product?.pdp_best_price_title}
              />
            )}
            {
                isNonEmptyObject(product?.coupon_offer_mapping) && (
                    <OffersAndCouponsModule
                      couponData={product?.coupon_offer_mapping}
                    />
                  )}
                    <hr style={styles.divider} />
          {colorVariants?.length > 0 && (
            <>
                {/* <ProductColorVariationV2
                  variations={colorVariants}
                  product_id={id}
                  isBottomSheet={isBottomSheet}
                  isJewellery={isJewellery}
                /> */}
              <hr style={{ ...styles.divider, marginTop: '20px' }} />
            </>
          )}
        </div>
        </>
    )
}

export default memo(ProductInfoWrapper)