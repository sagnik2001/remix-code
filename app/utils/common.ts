
export const getWindowCustomLandingPage = () =>{
    const custom_landing_page = typeof window !== 'undefined'  ? new URLSearchParams(window.location.search).get('custom_landing_page') ?? '' : '';
    return custom_landing_page;
  }

export const onLogout = {
   
   
}
  