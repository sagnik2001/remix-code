import { CSSProperties, memo, useMemo } from 'react';
import styles from './styles';
import { isNonEmptyObject, isNonEmptyString } from '~/utils/checks';
import ProductTagV2 from '~/containers/Product-Details/NewRenderUi/components/ProductTagV2';
import { RootState, useAppSelector } from '~/store';
import ItemsSold from '~/containers/Product-Details/NewRenderUi/components/ItemsSold';
import RatingModule from '~/containers/Product-Details/NewRenderUi/components/RatingModule';
import { useInView } from 'react-intersection-observer';
import { getPriceRange } from '~/utils/format';
import Amount from "~/components/Amount";


const disabledTag = {
  textColor: '#FFF',
  color: '#F83849',
  name: 'OUT OF STOCK',
};

const ProductPriceInfoV2 = ({
  isBottomSheet,
  product,
  notifyOosFlag,
  isOutOfStock,
  selectedSize,
  variations,
  // onWishListPress,
  // isInWishList,
  selectedVariant,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
    trackVisibility: false,
    delay: 0,
  }),
   {
      name: title = '',
      display_tag : tag = {},
      rating = '',
      product_id : id,
      show_sku : showSku = false,
      style_id : styleId = '',
    } = product ?? {},
     selectedProductOutOfStock  = useAppSelector(
      (state: RootState) => state?.productDetails?.selectedProductOutOfStock,
    );
    const priceDetails = useMemo(() => getPriceRange(variations), [variations]);
    const disabled = useMemo(
      () => notifyOosFlag && (isOutOfStock || selectedProductOutOfStock),
      [notifyOosFlag, isOutOfStock, selectedProductOutOfStock]
    );
    const disabledStyles = useMemo(() => (disabled ? ' opacity-[0.4] ' : ''), [disabled]);
    

  return (
    <div>
    <div
      style={{
        ...(styles.containerWishlist as CSSProperties),
        ...(isBottomSheet && { paddingLeft: '16px' }),
      }}
    >
      <div
        className={`${
          !isBottomSheet ? 'pl-[16px] w-[80%]' : ''
        } flex flex-col gap-[6px]`}
      >
        <div className="flex gap-[8px] items-center">
          {isNonEmptyObject(tag) && tag?.name && (
            <ProductTagV2 tag={disabled ? disabledTag : tag} />
          )}
          {isNonEmptyString(product?.total_product_sales) && (
            <ItemsSold
              tag={disabled ? disabledTag : tag}
              sales={product?.total_product_sales}
            />
          )}
        </div>
        {isNonEmptyString(title) && (
          <h1
            style={
              !isBottomSheet
                ? styles.productTitle
                : styles.bottomSheetpProductTitle
            }
            className={`disabledStyles w-[260px] whitespace-wrap flex-wrap`}
          >
            {title}
          </h1>
        )}
      </div>
      {!isBottomSheet && rating && Number(rating) > 0 && (
        <RatingModule
          id={id}
          rating={product?.rating}
          ratingCount={product?.rating_count}
          showNewReviewUi={true}
          review={product?.reviews}
        />
      )}
     
    </div>
     <div className={disabledStyles}>
     {showSku ? (
       <div style={styles.visibleProductSku}>{`${styleId} | ${
         id ??  ''
       }`}</div>
     ) : (
       <div style={styles.hiddenProductSku}>{`${styleId} | ${
         id ??  ''
       }`}</div>
     )}
   </div>
   <div
        ref={ref}
        style={styles.productPrice as CSSProperties}
        className={disabledStyles}
      >
        <div style={styles.productNewPrice}>
          {selectedSize === "" ? (
            <div>
              {priceDetails.shouldShowPriceRange ? (
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "1px" }}
                >
                  <Amount
                    amount={priceDetails.minSalePrice}
                    style={styles.productNewPrice}
                    currencyStyle={{ height: "13px", width: "13px" }}
                    strokeWidth={2}
                  />
                  -
                  <Amount
                    amount={priceDetails.maxSalePrice}
                    style={styles.productNewPrice}
                    currencyStyle={{ height: "13px", width: "13px" }}
                    strokeWidth={2}
                  />
                </div>
              ) : (
                <Amount
                  amount={priceDetails.minSalePrice}
                  style={styles.productNewPrice}
                  currencyStyle={{ height: "13px", width: "13px" }}
                  strokeWidth={2}
                />
              )}
            </div>
          ) : (
            <Amount
              amount={selectedVariant?.[0]?.sale_price}
              style={styles.productNewPrice}
              currencyStyle={{ height: "10.5px", width: "10.5px" }}
              strokeWidth={3}
            />
          )}
        </div>
        {priceDetails.discount !== 0 && (
          <>
            <Amount
              amount={priceDetails.regularPrice}
              style={styles.productOldPrice}
              currencyStyle={{ height: "10.5px", width: "10.5px" }}
              oldPrice
            />
          </>
        )}
        {priceDetails.discount !== 0 && (
          <div style={styles.flex}>
            <div style={styles.offerTag}>{`${priceDetails.discount}% off`}</div>
          </div>
        )}
      </div>
   </div>
  );
};

export default memo(ProductPriceInfoV2);
