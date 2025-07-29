import { Dialog, DialogContent } from '~/components/shadcn/ui/dialog';
import BackIcon from "~/assets/icons/BottomSheetBackIcon.svg";
import { memo } from 'react';

const CustomDialog = ({
  children,
  open,
  onClose,
  setOpen,
  isBottomSheet = false,
  isRightAnchoredDrawer = false,
  showCloseButton = false,
  showBackIcon = false, 
  onBackClick = () => {},
  customCloseIcon,
  customCloseIconStyles = {},
  customOverlayStyle = {},
  customStyles = {},
  customOverlayClick,
  ...props
}) => {


  return (
    <Dialog open={open} onClose={onClose} onOpenChange={setOpen}>
      <DialogContent  className={`bg-[transparent] border-none`} customOverlayClick={customOverlayClick} removeCloseIcon isBottomSheet={isBottomSheet}  isRightAnchoredDrawer={isRightAnchoredDrawer} customOverlayStyle={customOverlayStyle} style={{
            maxHeight: 'calc(100% - 65px)',
            ...(customStyles && customStyles),
          }} {...props}>
        {showBackIcon && <button className="customButton customButton--noScale customButton--transparent absolute left-0 top-[-42px] px-[16px]" onClick={onBackClick}>
            <img src={BackIcon} alt="Back" className="w-[18px] h-[18px]" />
            </button>}
        {showCloseButton &&
          (customCloseIcon ? (
              <button onClick={onClose} className={'customButton customButton--noScale customButton--transparent px-[16px] absolute top-[-42px] right-0 ' + (!isBottomSheet && !isRightAnchoredDrawer && ' px-[23px]')} style={customCloseIconStyles}>
                <img src={customCloseIcon} alt="Close" className="w-[18px] h-[18px]" />
              </button>
          ) : (
            <div
              onClick={onClose}
              className="rounded-full bg-nm_white text-[10px] p-[2px] h-[18px] w-[18px] flex items-center justify-center absolute right-[15px] top-[-35px] customButton customButton--noScale"
            >
              &#10005;
            </div>
          ))}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default memo(CustomDialog);
