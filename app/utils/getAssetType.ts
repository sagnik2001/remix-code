export type AssetType = "json" | "svg" | "gif" | "image" | "unknown";

export const determineAssetType = (src: unknown): AssetType => {
  if (typeof src !== "string") return "unknown";
  const extension = src.split('.').pop()?.toLowerCase();
  if (!extension) return "unknown";
  switch (extension) {
    case "json":
      return "json";
    case "svg":
      return "svg";
    case "gif":
      return "gif";
    case "png":
    case "jpg":
    case "jpeg":
    case "bmp":
    case "webp":
      return "image";
    default:
      return "unknown";
  }
};
