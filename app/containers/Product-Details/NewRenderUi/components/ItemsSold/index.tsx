import { memo } from "react";
import className from "./styles.module.css"
const ItemsSold = ({ tag, sales }) => {
  return (
    <div className={`text-nm_black_2 font-[600] pb-[2px] text-[12px] leading-[16px] ${className.bg}`}>
      {sales}
    </div>
  );
};

export default memo(ItemsSold);
