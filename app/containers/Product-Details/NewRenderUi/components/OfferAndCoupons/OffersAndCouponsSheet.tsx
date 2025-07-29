import BottomSheet from "~/components/BottomSheet";
import { isNonEmptyString } from "~/utils/checks";
import { lazy, memo } from "react";
const DynamicParsedHtml=lazy(()=>import('~/components/ParsedHtml'));
const OffersAndCouponsSheet = ({
  open,
  setOpen,
  offersData,
  titleHtml
}) => {
  const handleClose = () => {
    setOpen(false);
  };
  const {coupon_name='',minimum_amount=0, pdp_tandc_html={}}=offersData??{}
  return (
    <>
      <BottomSheet
        open={open}
        handleClose={handleClose}
        bottomSheetStyle={{
          paddingTop: 1,
          paddingBottom: "34px",
          position: "relative",
          height: "max-content",
        }}
        showCloseButton
      >
        {/* Header Section */}
        <div>
          <div className="flex item-center  flex-col px-[20px] pt-[24px] pb-[16px] border-solid border-b-[1px] border-t-0 border-x-0">
            {isNonEmptyString(titleHtml)&&<div className="font-[700] text-[20px] text-left uppercase">{titleHtml}</div>}
            <div className="font-[500] text-[14px] text-nm_light_gray_11 mt-[5px] text-left">
             {isNonEmptyString(coupon_name)&&<><span>Use </span><span className="uppercase">{coupon_name}</span></>}
              {minimum_amount>0&&<>{isNonEmptyString(coupon_name)?' | ':''}<span>Above</span> <span>₹{minimum_amount}</span></>}
            </div>
          </div>
          {/* Terms and Condition section */}
         {isNonEmptyString(pdp_tandc_html) &&<DynamicParsedHtml content={pdp_tandc_html}/>}
        </div>
      </BottomSheet>
    </>
  );
};

export default memo(OffersAndCouponsSheet);

