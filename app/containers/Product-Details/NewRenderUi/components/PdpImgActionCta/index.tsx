import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CONTAINER_IDS } from "~/containers/Product-Details/NewRenderUi/constants";
import { RootState, useAppDispatch, useAppSelector } from "~/store";
import RenderAssets from "~/components/RenderAssets";
import { PdpCtaIcon2, PdpCtaIcon3,ChevronForwardNewIconUrl ,ChevronBackwardUrl} from "~/constants/imageUrls";
  const IconSection = memo(() => {
     const icons = [PdpCtaIcon2, PdpCtaIcon3, PdpCtaIcon2];
     return (
       <div className="flex rounded-[8px_0px_0px_8px] bg-nm_white w-fit px-[6px] relative">
         {icons.map((icon, i) => (
           <div key={i} className={`relative ${i>0 ? '-ml-[10px]' : 'ml-[10px]'} mt-1`}>
             <RenderAssets CenterAsset={icon} />
           </div>
         ))}
       </div>
     );
   });
const PdpImgActionCta = ({
  isRecommendedProducts = false,
  productId,
  title = "View Similar",
  scrollToSimilarProducts,
  scrollToComponent
}) => {
  const [open,setOpen]=useState(false)
  const dispatch = useAppDispatch(),
    showRecommendedProductsSheet = useCallback(
      () => {},
      [dispatch]
    );  
    const {skip_bottom_sheet_matching_jewellery_live}=useAppSelector((state:RootState)=>state.layout.app_config_data)??{}

     const handleClick = useCallback(() => {
         if (skip_bottom_sheet_matching_jewellery_live && isRecommendedProducts) {
           scrollToComponent?.({}, CONTAINER_IDS.PDP_RECOMMENDED_PRODUCTS);
         } else if (isRecommendedProducts) {
           showRecommendedProductsSheet();
         } else {
           scrollToSimilarProducts?.();
         }
       }, [
         skip_bottom_sheet_matching_jewellery_live,
         isRecommendedProducts,
         scrollToComponent,
         showRecommendedProductsSheet,
         scrollToSimilarProducts,
         productId,
       ]);

  const toggleButtonWidth=(e)=>{
    e.stopPropagation()
    setOpen(!open)
  }
  if( title!=='View Similar')
  return(
    <div
    className={`flex items-center z-[100] box-border m-0 p-0 overflow-hidden cursor-pointer bg-nm_white justify-center border-none rounded-[8px] whitespace-nowrap transition-all duration-500 ${(!open) ? 'w-[75px]' : 'w-[120px]'} box-border text-nm_black_2 ml-[12px] px-0 font-[600] text-[12px] leading-[16px] customButton customButton--noScale `}
    onClick={handleClick}
    style={{
      pointerEvents: 'auto',
      transition: '0.1s ease-in-out',
    }}
  >
    {open ? (
      <div
        className={`px-[6px] bg-nm_white rounded-[8px_0px_0px_8px] capitalize whitespace-nowrap py-[6px] truncate ${!open ? 'max-w-0 overflow-hidden' : ''}`}
        style={{
          transition: '0.5s ease-in-out',
        }}
      >
        {title}
      </div>
    ) : (
      <IconSection />
    )}
    <div
      className={`px-[0px] flex items-center  justify-center h-full bg-nm_white_smoke ${!open ? 'pr-[6px] py-[6px] rounded-[0px_8px_8px_0px]' : 'py-[6px] pr-[2px] rounded-[0px_8px_8px_0px]'}`}
      onClick={toggleButtonWidth}
    >
      {!open? <RenderAssets CenterAsset={ChevronForwardNewIconUrl}/> : <RenderAssets CenterAsset={ChevronBackwardUrl}/>}
    </div>
  </div>
  )
  return (
    <button
      id={CONTAINER_IDS.SIMILAR_PRODUCTS_BTN}
      className={`flex items-center z-[100] justify-center text-nm_black_2 ml-[12px] py-[6px] px-[12px] rounded-[16px] font-[600] text-[12px] leading-[16px] bg-nm_white customButton customButton--noScale `}
      onClick={handleClick}
    >
      {title}
    </button>
  )
};

export default memo(PdpImgActionCta);
