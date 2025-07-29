import { useState, memo, useRef } from "react";
import CouponV2 from "~/assets/icons/CouponV2.svg";
import OffersAndCouponsSheet from "./OffersAndCouponsSheet";
import { isArray, isNonEmptyArray, isNonEmptyObject } from "~/utils/checks";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from './styles.module.css'
export const CustomDotRenderer = memo(({ customStyle={}, data, currentIndex }) => {
  return (
    <div
      className="absolute right-[0] top-1/2 flex transform -translate-y-1/2 h-[100%] m-width-[50px] bg-nm_white flex items-center justify-center pr-[10px] pl-[30px] overflow-hidden z-[1]"
      style={{
        background: "linear-gradient(270deg, white 65%, transparent)",
        pointerEvents:'none',
        ...(customStyle ?? {})
      }}
    >
      <div className="flex flex-col items-center justify-start overflow-hidden">
        {/* Slide count marker */}
        <div
          className={`text-[12px] font-[600] text-nm_mystique_default ${
            data?.length <= 2 ? "my-[5px]" : "m-[3px]"
          }`}
          style={{ width: '30px', textAlign: 'center' }} // Set fixed width and center text
        >
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{data?.length}</span>
        </div>

        {/* Dot indicators */}
        <div className="flex overflow-hidden justify-center gap-x-1">
          <div
            className={`w-[4px] h-[4px] rounded-[50%] box-border ${
              currentIndex === 0 ? "bg-nm_black_2" : "bg-nm_light_gray_7"
            }`}
          ></div>
          {data?.length >= 3 && (
            <div
              className={`w-[4px] h-[4px] rounded-[50%] box-border ${
                currentIndex > 0 && currentIndex < data.length - 1
                  ? "bg-nm_black_2"
                  : "bg-nm_light_gray_7"
              }`}
            ></div>
          )}
          {data?.length >= 2 && (
            <div
              className={`w-[4px] h-[4px] rounded-[50%] box-border ${
                currentIndex === data.length - 1
                  ? "bg-nm_black_2"
                  : "bg-nm_light_gray_7"
              }`}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
});

function objectToArray(obj) {
  if(isNonEmptyObject(obj))
  return Object.keys(obj).map(key => obj[key]);
  else return []
}
const OffersAndCoupon = ({ couponData = {} }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openOfferSheet, setOpenOfferSheet] = useState(false);
  const [activeOffer, setActiveOffer] = useState({});
  let couponArray=isNonEmptyObject(couponData)? objectToArray(couponData):[]
  const swiperRef = useRef(null);
  
  const onCarouselImageChange = (idx: number) => {
    setCurrentIndex(idx);
  };
  const handleOpen = (offer: any) => {
    setOpenOfferSheet(true);
    setActiveOffer(offer);
  };
  const customRenderItem = (item: any,index:any) => {
    return (
    <SwiperSlide  onClick={() => handleOpen(item)}>
        <div
        key={item?.id}
        className="w-full flex items-center"
      >
        <div className="mr-[10px] relative top-[2px]">
          {/* <CouponV2 /> */}
          <img src={CouponV2} />
        </div>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <div className="font-[700] text-[14px] uppercase w-full text-left">{item?.html}</div>
          <div className="text-[12px] text-nm_light_gray_11 text-left w-full relative flex-1 min-w-0">
            <div className={`${styles.truncate} w-[80%]`}>
           {item?.coupon_dict?.coupon_name&&<><span>Use </span><span className="uppercase">{item?.coupon_dict?.coupon_name}{" "}</span></>}
            {item?.coupon_dict?.minimum_amount>0&&<> {item?.coupon_dict?.coupon_name?' | ':''}<span>Above</span> <span>₹{item?.coupon_dict?.minimum_amount}</span></>}
            </div>
          </div>
        </div>
      </div>
    </SwiperSlide>
    );
  };
  return (
    <div className="flex flex-col item-center  box-border">
      <div className="p-[10px] py-0 font-[700] text-[16px] pl-[16px]">
        Offers and coupons
      </div>
      <div className="p-[16px] flex flex-center rounded-[16px] mx-[16px] mt-[16px] mb-[20px] cursor-pointer relative overflow-hidden border-[1px] border-solid border-nm_light_gray_7">

        <Swiper
        slidesPerView={1}
        onSlideChange={(e) => onCarouselImageChange(e.realIndex)}
        loop
        onInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        style={{width:'100%'}}
      >
        {isNonEmptyArray(couponArray)&& couponArray?.map((item, index) => (
          <div key={index}>{customRenderItem(item, index)}</div>
        ))}
      </Swiper>
        { couponArray&&isArray(couponArray)&&couponArray?.length > 1 && <CustomDotRenderer data={couponArray} currentIndex={currentIndex}/> }
      </div>
      {
        <OffersAndCouponsSheet
          open={openOfferSheet}
          setOpen={setOpenOfferSheet}
          offersData={activeOffer?.coupon_dict}
          titleHtml={activeOffer?.html}
        />
      }
    </div>
  );
};

export default memo(OffersAndCoupon);
