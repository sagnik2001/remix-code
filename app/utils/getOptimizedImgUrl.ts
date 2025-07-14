type ImageInfo = {
    width: number;
    height: number;
    path: string; // Assuming the URL is stored in a 'path' property
  };
  
  // Define the return type of the function to be an object with url, width, and height
  type OptimizedImageResult = {
    url: string;
    width: number | undefined; // Use undefined as width might not always be available on fallback
    height: number | undefined; // Use undefined as height might not always be available on fallback
  };
  
  
  export const getOptimizedImageUrl = (
    images: ImageInfo[], // Expecting an array of ImageInfo objects
    fallbackUrl: string,
    targetRenderedWidth: number = 380, 
  ): OptimizedImageResult => { // Specify the return type
    // Calculate the required pixel width based on device pixel ratio (assuming 2x for high density displays)
    // We multiply by 2 because screens often have a device pixel ratio of 2 (Retina displays, etc.)
    // A 380px wide element on a 2x display needs a 760px wide image for sharp rendering.
    const effectiveTargetWidth = typeof targetRenderedWidth === 'number' && targetRenderedWidth > 0 ? targetRenderedWidth : 380;
    const requiredPixelWidth = effectiveTargetWidth * 1.5; // Target pixel width for a 2x display
  
  
    // --- Step 1: Handle empty or invalid images array ---
    // If no valid images array is provided, return the fallback URL with no dimensions.
    if (!images || images.length <= 0) {
      return {
        url: fallbackUrl,
        width: undefined,
        height: undefined,
      };
    }
  
    // --- Step 2: Initialize candidates ---
    // Initialize candidates for the best match.
    // We need the smallest image *larger* than the required width,
    // and the largest image *smaller* than the required width (as a fallback).
    let smallestLargerImage: ImageInfo | null = null; // Smallest width >= requiredPixelWidth
    let largestSmallerImage: ImageInfo | null = null; // Largest width < requiredPixelWidth
    let largestImageOverall: ImageInfo = images[0]; // Keep track of the largest image just in case (fallback)
  
  
    for (const image of images) {
      // Ensure the image object has a width property before comparing
      if (typeof image.width !== 'number') {
          continue; // Skip images without a valid width
      }
  
      if (image.width >= requiredPixelWidth) {
        // Found an image that meets or exceeds the required width
        if (!smallestLargerImage || image.width < smallestLargerImage.width) {
          // This is the smallest one found so far that is larger than or equal to the required width
          smallestLargerImage = image;
        }
      } else {
        // Found an image that is smaller than the required width
        if (!largestSmallerImage || image.width > largestSmallerImage.width) {
          // This is the largest one found so far that is smaller than the required width
          largestSmallerImage = image;
        }
      }
  
      // Update the largest image overall if a wider image is found
      if (image.width > largestImageOverall.width) {
          largestImageOverall = image;
      }
    }
  
    // --- Step 4: Select the best image based on priority ---
    let selectedImage: ImageInfo | null = null;
  
    if (smallestLargerImage) {
      // Priority 1: If we found an image that meets or exceeds the required density, use the smallest one.
      selectedImage = smallestLargerImage;
    } else if (largestSmallerImage) {
      // Priority 2: If no image met the required density, use the largest image that was smaller than the required width.
      selectedImage = largestSmallerImage;
    } else {
        // Fallback: If no image had a valid width or none met the above criteria, use the largest image overall.
        // In a well-structured image gallery, images[0] might be the smallest, so largestImageOverall is a safer final fallback.
        selectedImage = largestImageOverall;
    }
  
    
  
    // --- Step 5: Return the selected image details ---
    // Return an object containing the url, width, and height of the selected image.
    // Use optional chaining (?.) and fallback to fallbackUrl for the URL if the selectedImage or its path is missing.
    return {
      url: selectedImage?.path || fallbackUrl,
      width: selectedImage?.width,
      height: selectedImage?.height,
    };
  };
  