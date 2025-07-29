import React, {
    FC,
    memo,
    useEffect,
    useState,
  } from "react"; // Import necessary hooks and FC
  import { determineAssetType } from "~/utils/getAssetType"; // Assuming determineAssetType is in a utility file
  
  // Dynamically import LottieLoader as it's likely client-side only
  const DynamicLottieLoader = React.lazy(() => import("~/components/LottieLoader")); // Adjust the path as necessary
  
  // Refactored function into a functional component
  interface RenderedAssetProps {
    CenterAsset: any; // The asset source (string URL or SVG component)
    customClass?: string;
    // Add any other props needed for specific asset types (e.g., loop for Lottie)
    loop?: boolean;
    onComplete ?: () => {}
  }
  
  const RenderedAsset: FC<RenderedAssetProps> = ({ CenterAsset, customClass = "", loop = false,onComplete = ()=> {} }) => { // Use CenterAsset here
    const type = determineAssetType(CenterAsset); // Use CenterAsset here
    const [animationData, setAnimationData] = useState<any>(null); // State for fetched JSON
  
    // Effect to fetch JSON data only for Lottie assets
    useEffect(() => {
      if (type === "json" && !animationData && typeof CenterAsset === 'string') { // Use CenterAsset here
        fetch(CenterAsset) // Fetch the JSON file - Use CenterAsset here
          .then((res) => res.json())
          .then(setAnimationData)
          .catch((err) => console.error("Failed to load Lottie JSON", err));
      }
      // No cleanup needed for fetch in this case
    }, [CenterAsset, animationData, type]); // Dependencies - Use CenterAsset here
  
    switch (type) {
      case "gif":
        return <img src={CenterAsset} alt="asset gif" className={customClass} />; // Use CenterAsset here
      case "svg":
        // Check if the asset is a string URL or a React Component
        return typeof CenterAsset === 'string' // Use CenterAsset here
          ? <img className={customClass} src={CenterAsset} alt="asset svg" /> // Use CenterAsset here
          : <CenterAsset className={customClass} />; // Render as a component if it's one - Use CenterAsset here
      case "json":
        // Render the dynamic Lottie loader only when animationData is available
        if (!animationData) {
            // You might return a placeholder or null while loading
            return null; // Example placeholder
        }
        return (
          <DynamicLottieLoader
            customClass={customClass}
            animationData={animationData}
            loop={loop} // Pass loop prop
            onComplete={onComplete}
          />
        );
      case "image":
        return <img src={CenterAsset} className={customClass} alt="asset image" />; // Use CenterAsset here
      default:
        // Fallback if type is unknown or asset is a React component
        // Assuming asset could be a component directly if type is not matched
        if (typeof CenterAsset === 'function') { // Use CenterAsset here
            return <CenterAsset className={customClass} />; // Use CenterAsset here
        }
        return null; // Or handle other unknown types
    }
  };
  
  export default memo(RenderedAsset);