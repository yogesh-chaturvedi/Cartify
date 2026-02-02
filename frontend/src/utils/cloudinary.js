

export const getThumbnailImage = (url, size = 150) => {
  if (!url) return "";
  return url.replace(
    "/upload/",
    `/upload/c_fill,g_auto,w_${size},h_${size},q_auto,f_auto/`
  );
};


export const getMainProductImage = (url, w = 900, h = 900) => {
  if (!url) return "";
  return url.replace(
    "/upload/",
    `/upload/c_fit,w_${w},h_${h},q_auto,f_auto,dpr_auto/`
  );
};

// export const getOptimizedImage = (url, w = 500, h = 500) => {
//   if (!url) return "";
//   return url.replace(
//     "/upload/",
//     `/upload/w_${w},h_${h},q_auto,f_auto,dpr_auto/`
//   );
// };

// g_auto c_fill  


// For cards / thumbnails
export const getProductCardImage = (url, w = 300, h = 300) => {
  if (!url) return "";
  return url.replace(
    "/upload/",
    `/upload/c_fit,w_${w},h_${h},q_auto,f_auto/`
  );
};