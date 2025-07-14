import { WEB_URL } from '~/constants/config';



export const getWindowCustomLandingPage = () =>{
    const custom_landing_page = typeof window !== 'undefined'  ? new URLSearchParams(window.location.search).get('custom_landing_page') ?? '' : '';
    return custom_landing_page;
  }

export const onLogout = {
   
   
}
  
export const getProductCanonicalUrl = (productName: string) => {
    if(typeof productName === 'string')
        productName = productName.toLowerCase().split(' ').join('-');
  
    return `${WEB_URL}product/${productName}`
  };