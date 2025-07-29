import { memo, useCallback, useContext, useMemo } from 'react';
import { CONTAINER_IDS } from '../../constants';
import { scrollToContainer } from '~/utils/common';
import { RootState, useAppSelector } from '~/store';

const RatingModule = ({ id, rating, ratingCount, showNewReviewUi, review }) => {

  const { bottom_sheet_open: configKey } = useAppSelector(
    (state: RootState) => state?.recommedationSheet,
  ) ?? {}; 

  const numericRating = useMemo(() => parseFloat(rating), [rating]);

  const hasReviews = useMemo(
    () => Boolean(review?.length) && numericRating > 0,
    [review, numericRating],
  );

  const handleRatingsClick = useCallback(() => {
    const { getTrackingEventObject } = require('@Utils/common');


    const target = hasReviews
      ? `#${CONTAINER_IDS.RATING_FRAME}`
      : `#${CONTAINER_IDS.RATING_CONTAINER}`;

    scrollToContainer(target, {});
  }, [configKey, id, hasReviews]);

  const Tag = hasReviews ? 'button' : 'div';
  const wrapperProps = hasReviews
    ? { id: CONTAINER_IDS.RATING_BTN, onClick: handleRatingsClick }
    : {};

  return (
    <Tag
      className={`customButton p-0 customButton--noScale absolute cursor-pointer right-[12px] rounded-[16px] bg-nm_white text-nm_black_2 uppercase w-fit items-center`}
      {...wrapperProps}
    >
      <div
        className={`text-nm_mystique_default leading-[22px] font-[700] text-[16px] py-[2px] px-[8px] bg-nm_light_mystique_green ${hasReviews ? 'border border-solid border-nm_light_gray_7 rounded-[8px_8px_0px_0px]' :'rounded-[8px]'}`}
      >
        <span className="mr-[4px] relative top-[-1px] text-[14px]">★</span>
        {rating}
      </div>
      {hasReviews && ratingCount && (
        <div className="p-[4px] text-[10px] capitalize rounded-[0px_0px_8px_8px] border border-t-0 border-solid border-nm_light_gray_7 leading-[14px] font-normal text-nm_light_gray_11">
          {' '}
          {ratingCount} {ratingCount > 1 ? 'Ratings' : 'Rating'}
        </div>
      )}
    </Tag>
  );
};

export default memo(RatingModule);
