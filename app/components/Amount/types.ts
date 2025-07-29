export type AmountType = {
    currency?: string;
    amount: string | number | undefined;
    style?: React.CSSProperties;
    toFixed?: boolean;
    currencyStyle?: React.CSSProperties;
    oldPrice?: boolean;
    strokeWidth?: number;
    symbol?: string;
    isWalletPage?: boolean;
  };
  
  export enum Currency {
    INR = 'INR'
  }
  