import TrendingDown from "~/assets/icons/TrendingDownBlock.svg";
import { lazy, memo } from "react";
import { isNonEmptyString } from "~/utils/checks";
const DynamicParsedHtml=lazy(()=>import("~/components/ParsedHtml"))
const PriceDrop = ({pdpBestPriceData}) => {
  const {bg_color='',svg_key='',html=''}=pdpBestPriceData || {}
  return (
    <div className={`flex items-center mb-[6px] px-[16px]`} style={{background:bg_color}}>
    {svg_key==='trending_down'&&<div className="relative pr-[8px] top-[2px]  ">
        <img src={TrendingDown} alt="Price Drop Icon" className="w-[16px] h-[16px]" />
        </div>}
    {isNonEmptyString(html)&&<DynamicParsedHtml content={html}/>}
    </div>
  );
};

export default memo(PriceDrop);