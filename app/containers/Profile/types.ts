export interface HomePageCarousalApiData {
    image_url: string;
    click_event: {
      event_type: string;
      params: {
        tag: string;
      };
    };
  }
  
  export type User = {
    total_orders: number;
    download_app_nudge?: boolean;
    display_name: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    mobile_number: string;
    new_user: boolean;
    successful: boolean;
    username: string;
    wallet: Wallet;
    referral_earnings: string;
    referral_signups: string;
    referred_by: boolean;
  };
  
  export type Wallet = {
    fast_wallet_amount: { value: number; currency: string };
    normal_wallet_amount: { value: number; currency: string };
  };
  
  export type ProfileLink = {
    name: string;
    link?: string;
    icon: string;
    action?: () => void;
    isNew ?: boolean;
    tag_text ?: string;
  };
  