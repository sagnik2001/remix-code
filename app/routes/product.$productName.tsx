// app/routes/products/$productName.tsx
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
// import NewRenderUi from '~/containers/Product-Detailsv2/indexV2';
import { fetchDefaultProductSize } from '~/containers/Product-Details/utils';
import { nextFetch } from '~/services/api';
import { VISUAL_SEARCH } from '~/constants/hash';
import { getOptimizedImageUrl } from '~/utils/getOptimizedImgUrl';
import { getProductCanonicalUrl } from '~/utils/common';
import NewRenderUi from '~/containers/Product-Details/NewRenderUi';

export const loader: LoaderFunction = async ({ request, params }) => {
  const productName = params.productName;
  const url = new URL(request.url);
  const fromPage = url.searchParams.get('from_page');
  const fromVisualSearch = fromPage === VISUAL_SEARCH;

  const { data, setCookie } = await nextFetch.post(
    { request },
    'products/details?gallery=true&reviews=true&variations=true&features=true&description=true&product_info=true&size_guide=true',
    {
      product_ids: [productName],
      from_pdp: true,
      ...(fromVisualSearch && { from_vs: fromVisualSearch }),
    }
  );

  console.log(data,'data')

  const productDetails = data?.product_details ?? [];
  // if (productDetails.length === 0) {
  //   throw redirect('/shop', {
  //     status: 308,
  //     headers: {
  //       'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  //     }
  //   });
  // }

  // Determine stock status
  const { variations } = productDetails[0] ?? {};
  const { isOutOfStock } = fetchDefaultProductSize({ variations });

  // Prepare single preload image
  const defaultImageUrl = productDetails[0]?.image_url;
  const imageGalleryMeta = productDetails[0]?.image_gallery_metadata?.[0] || [];
  const imageGalleryPrefix = productDetails[0]?.image_gallery_prefixes?.[0] || '';
  const baseUrl = productDetails[0]?.base_image_url || '';
  const optimized = getOptimizedImageUrl(imageGalleryMeta, defaultImageUrl, 380);
  const singlePreloadImageUrl = optimized
    ? { ...optimized, url: `${baseUrl}${imageGalleryPrefix}${optimized?.url}` }
    : null;

  // Set any cookies returned from API
  const headers: HeadersInit = {};
  if (setCookie) {
    headers['Set-Cookie'] = setCookie;
  }

  return json(
    {
      isOutOfStock,
      show_pdp_change_v2: data?.product_details[0]?.show_pdp_change_v2 || false,
      notifyOosProduct: data?.notify_oos_product || 0,
      showPdpOffer: data?.show_pdp_offer || 0,
      showNewReviewUi: data?.show_new_review_ui || false,
      productData: productDetails,
      singlePreloadImageUrl
    },
    { headers }
  );
};

// export const links: LinksFunction = ({ data }) => {
//   const single = data?.singlePreloadImageUrl;
//   return [
//     { rel: 'preconnect', href: 'https://assets.newme.asia', crossOrigin: 'anonymous' },
//     { rel: 'dns-prefetch', href: 'https://assets.newme.asia' },
//     single && { rel: 'preload', as: 'image', href: single.url, fetchpriority: 'high' },
//     { rel: 'canonical', href: getProductCanonicalUrl(data.productData[0].name) }
//   ].filter(Boolean);
// };

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://assets.newme.asia", crossOrigin: "anonymous" },
  { rel: "dns-prefetch", href: "https://assets.newme.asia" },
];

export default function ProductDetailsPage() {
  const {
    isOutOfStock,
    show_pdp_change_v2,
    bannerHeight,
    notifyOosProduct,
    showPdpOffer,
    showNewReviewUi,
    productData,
    singlePreloadImageUrl,
    ...props
  } = useLoaderData<typeof loader>();

  console.log("hey",productData)

  return (
    <>
    {/* <head>
    <link rel="preconnect" href="https://assets.newme.asia" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://assets.newme.asia" />
      {singlePreloadImageUrl?.url && (
        <link
          rel="preload"
          as="image"
          href={singlePreloadImageUrl.url}
          fetchPriority="high"
        />
      )}
      </head> */}
        <NewRenderUi
        bannerHeight={bannerHeight}
        productData={productData}
        show_pdp_change_v2={show_pdp_change_v2}
        singlePreloadImageUrl={singlePreloadImageUrl}
        {...props}
      />
    </>
  );
}
