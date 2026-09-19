// File: src/utils/cloudinary.ts
export function getOptimizedImageUrl(url: string, maxWidth = 1200): string {
    if (!url || !url.includes("res.cloudinary.com")) return url;
    if (url.includes("/upload/f_auto")) return url;

    // f_auto: formato óptimo (WebP/AVIF)
    // q_auto:best: máxima calidad perceptible
    // w_*: ajusta la dimensión al tamaño real necesario
    return url.replace("/upload/", `/upload/f_auto,q_auto:best,w_${maxWidth},c_limit/`);
}