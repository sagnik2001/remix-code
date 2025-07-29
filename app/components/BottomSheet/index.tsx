import React from 'react';
import CustomDialog from '~/components/CustomModal/index';
import FilterSheetCloseIcon from '~/assets/icons/FilterSheetCloseIcon.svg';

const BottomSheet = ({ open, handleClose = () => {}, children,customStyles={},showCloseButton=true,customOverlayClick ,onPointerDownOutside = () => {}}) => {
  return (
    <CustomDialog onPointerDownOutside={onPointerDownOutside}  open={open} onClose={handleClose} customOverlayClick={customOverlayClick} setOpen={handleClose} isBottomSheet showCloseButton={showCloseButton} customCloseIcon={<FilterSheetCloseIcon />}>
      <div className="max-w-[450px] w-[100vw] box-border rounded-t-[16px] bg-nm_white overflow-clip" style={customStyles}>{children}</div>
    </CustomDialog>
  );
};

export default BottomSheet;