// import CurrencyIcon from '@assets/icons/CurrencyIcon.svg';
import { AmountType, Currency } from "./types";
import { memo, useCallback } from "react";

const Amount: React.FC<AmountType> = ({
  isWalletPage = false,
  currency,
  amount,
  style = {},
  toFixed = false,
  currencyStyle,
  oldPrice = false,
  strokeWidth = 1,
  symbol,
}) => {
  const updatedAmount = toFixed ? Number(amount)?.toFixed(2) : amount;

  const getCurrency = useCallback(() => {
    if (!amount) return;
    <div style={style}>{"₹0"}</div>;

    switch (currency) {
      case Currency.INR:
        return `${updatedAmount
          ?.toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
      // TODO: Add currencies as required

      default:
        return null;
    }
  }, [amount, updatedAmount, currency, style]);

  return (
    <div
      className="flex flex-row items-center relative w-fit z-0"
      style={style}
    >
      {symbol && <div>{symbol}</div>}
      {oldPrice && (
        <hr
          style={{ height: "-0.9px" }}
          className="w-full h-[1px] bg-nm_tertiary_gray border-0 absolute"
        />
      )}
      {/* <CurrencyIcon
        style={{
          ...(currencyStyle ?? { height: '10px', width: '10px' }),
          ...{ overflow: 'visible' }
        }}
        strokeWidth={strokeWidth}
      /> */}
      <div>{!isWalletPage ? "₹" + (getCurrency() || "0") : getCurrency()}</div>
    </div>
  );
};

Amount.defaultProps = { currency: Currency.INR };

export default memo(Amount);
