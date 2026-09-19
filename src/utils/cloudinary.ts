// File: src/utils/cloudinary.ts

export function getOptimizedImageUrl(url: string, maxWidth?: number): string {
    if (!url || !url.includes("res.cloudinary.com")) return url;
    if (url.includes("/upload/f_auto")) return url;

    const transformation = maxWidth 
        ? `f_auto,q_auto:best,w_${maxWidth},c_limit` 
        : `f_auto,q_auto:best`;

    return url.replace("/upload/", `/upload/${transformation}/`);
}