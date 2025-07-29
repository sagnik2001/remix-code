import {
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
import { isNonEmptyString, isNonEmptyArray } from "~/utils/checks";
  import {
    getSizeColorVariantEventData,
    getTrackingEventObject,
    isWhiteColorVariant,
  } from "@Utils/common";
  import { SHOW_TRANSPARENT_GLOBAL_LOADER } from "@Constants/storageKeys";
  import { useGetBottomSheetProductDetailMutation } from "@Containers/Product-Details/apiSlice";
  import ColorPill from "@Components/ColorPill";
  import TrendingUp from '@assets/icons/TrendingUp.svg'
  import ProductColorVariationImage from "./ProductColorVariationImage";
  import ProductColorPill from "./ProductColorPill";
  import { COLOR_VARIANT_LENGTH } from "~/containers/Product-Details/NewRenderUi/constants";
import { useNavigate } from "@remix-run/react";
  const getSelectedColor = (selectedProductId: string, variations: Array<any>) =>
    isNonEmptyArray(variations) &&
    variations.find((el) => el?.id === selectedProductId)?.color;
  
  const ProductColorVariationV2 = ({
    variations,
    product_id,
    isSizeSelectorSheet,
    isBottomSheet,
    isJewellery,
    setSelectedSize
  }) => {
    const [newVariation, setNewVariation] = useState(variations);
    const [showMore, setShowMore] = useState(false);
    const [validHexCode,setValidHexCode]=useState(true)
    const router = useNavigate(),
      selectedColor = useMemo(
        () => getSelectedColor(product_id, variations) ?? "",
        [product_id, variations]
      ),
      variantsContainerRef = useRef(null);
    const [
      getRecommendationProductDetails,
      { isLoading: productDetailsLoading },
    ] = useGetBottomSheetProductDetailMutation();
  
    // To ensure current variant is the first variant on server side rendered color variants
    const checkForValidHexCode=useCallback(()=>{
      return variations?.every(item => 
        item.hasOwnProperty('hex_code') && Array.isArray(item.hex_code)
      );
    },[])
    useEffect(() => {
      const hasValidHexCodes= checkForValidHexCode()
      setValidHexCode(hasValidHexCodes)
    }, []);
    useEffect(()=>{
      if(isNonEmptyArray(variations) && !isNonEmptyArray(newVariation)){
        setNewVariation(variations)
      }
    },[variations])
  
    const changeProduct = useCallback(
      (slug: string, color = "") => {
        // Enables transparent loader on route change
        sessionStorage.setItem(
          SHOW_TRANSPARENT_GLOBAL_LOADER,
          JSON.stringify(true)
        );
  
        router({
          pathname: `/product/${slug}`,
        },{replace: true});
      },
      [ isSizeSelectorSheet, product_id]
    );
  
    const bottomSheetChangeProduct = (id) => {
      getRecommendationProductDetails({ product_ids: [id] });
    };
  
    const handleChange = (slug, color, id) => {
      setSelectedSize&&setSelectedSize("")
      isBottomSheet
        ? bottomSheetChangeProduct(slug, color, id)
        : changeProduct(slug, color);
    };
    return (
      <div className="px-[16px] pt-[20px]">
        {isNonEmptyString(selectedColor) && (
          <div
            className={`pb-[4px] font-[700] text-[14px] leading-[20px] text-nm_font_secondary uppercase text-left`}
          >{`${selectedColor}`}</div>
        
        )}
        <div className="text-[10px] text-nm_tertiary_gray font-[500] text-left">This print is non-directional and may differ on each piece</div>
        <div
          className={`hideScrollBar flex overflow-x-hidden z-0 w-full box-border ${newVariation?.length>6?'grid grid-cols-6':'flex flex-wrap gap-[10px]'}`}
          ref={variantsContainerRef}
        >
          {isNonEmptyArray(newVariation)&&newVariation?.map((el:any, idx:number) => {
            const { id, slug, color, hex_code,thumbnail='' } = el ?? {};
            if(newVariation.length===COLOR_VARIANT_LENGTH?.OFFSET_LENGTH){
              return <>{validHexCode? <ProductColorPill id ={id}
              idx={idx}
              slug={slug}
              color={color}
              hex_code={hex_code}
              handleChange={handleChange}
              product_id={product_id} />
              :<ProductColorVariationImage id ={id}
              idx={idx}
              slug={slug}
              color={color}
              thumbnail={thumbnail}
              handleChange={handleChange}
              product_id={product_id} />}</>
            }else if (showMore) {
              return (
               <>{validHexCode? <ProductColorPill id ={id}
                idx={idx}
                slug={slug}
                color={color}
                hex_code={hex_code}
                handleChange={handleChange}
                product_id={product_id} />
                :<ProductColorVariationImage id ={id}
                idx={idx}
                slug={slug}
                color={color}
                thumbnail={thumbnail}
                handleChange={handleChange}
                product_id={product_id} />}</>
              );
            } else {
              if (idx <(COLOR_VARIANT_LENGTH?.OFFSET_LENGTH - 1) && !showMore) {
                return (
                  <>{validHexCode? <ProductColorPill id ={id}
                idx={idx}
                slug={slug}
                hex_code={hex_code}
                color={color}
                handleChange={handleChange}
                product_id={product_id} />
                :<ProductColorVariationImage id ={id}
                  idx={idx}
                  slug={slug}
                  color={color}
                  thumbnail={thumbnail}
                  handleChange={handleChange}
                  product_id={product_id} />}</>
                );
              }
            }
          })}
          {!showMore && variations?.length>COLOR_VARIANT_LENGTH?.OFFSET_LENGTH && validHexCode &&(
            <div
              className={`snap-end rounded-full mr-[8px]  p-[4px] mb-[4px] cursor-pointer h-[40px] w-[40px] mt-[10px] box-border flex items-center justify-center`}
              style={{ border:"1px solid #DDD" }}
              onClick={() => setShowMore(true)}
            >
              <div className="flex justify-center items-center text-nm_black_2 text-[14px] font-[600]">
                <span>+</span><span>{variations?.length - (COLOR_VARIANT_LENGTH?.OFFSET_LENGTH - 1)}</span>
              </div>
            </div>
          )}
           {!showMore && variations?.length>COLOR_VARIANT_LENGTH?.OFFSET_LENGTH && !validHexCode && (
            <div
              className={`h-[58px] w-[46px]  rounded-[6px] mr-[16px]  p-[5px] mb-[4px] cursor-pointer mt-[10px] flex items-center justify-center box-border`}
              style={{ border:"1px solid #DDD" }}
              onClick={() => setShowMore(true)}
            >
              <div className="flex justify-center items-center text-nm_black_2 text-[14px] font-[600] flex-col">
               <div> <span>+</span><span>{variations?.length - (COLOR_VARIANT_LENGTH?.OFFSET_LENGTH - 1)}</span></div>
                <div>more</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default memo(ProductColorVariationV2);
  