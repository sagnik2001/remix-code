import { memo } from "react";

export interface TagType {
  name: string;
  color: string;
  textColor: string;
}

interface IProductTagProps {
  tag?: TagType;
  isProductCard?: boolean;
}

const ProductTagV2 = ({ tag, isProductCard = false }: IProductTagProps) => {
  return (
    tag && (
      <div
        className={`px-[6px] py-[2px] text-[8px] leading-[12px] text-center font-[700] rounded-[4px] overflow-hidden uppercase ${
          isProductCard
            ? ` absolute top-[8px] left-[6px] `
            : ` h-fit w-fit mb-[10px] `
        }`}
        style={{ color: tag.textColor ?? 'white',  background: tag.color }}
      >
        <div className={`${isProductCard ? 'relative z-10' : ''}`}>{tag.name}</div>
      </div>
    )
  );
};

export default memo(ProductTagV2);