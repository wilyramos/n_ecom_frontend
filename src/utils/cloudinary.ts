// File: src/utils/cloudinary.ts

export function getOptimizedImageUrl(url?: string | null, maxWidth: number = 1920): string {
    if (!url || typeof url !== "string") return "";
    
    if (!url.includes("res.cloudinary.com") || url.includes("f_auto")) {
        return url;
    }

    if (url.includes("/video/upload/")) {
        return url;
    }

    // w_1920 con c_limit: si mide más de 1920px la reduce a 1920px; si es menor, no la agranda.
    const transformation = `f_auto,q_auto:best,w_${maxWidth},c_limit`;

    return url.replace(/\/upload\/(?:v\d+\/)?/, (match) => {
        const versionMatch = match.match(/v\d+\//);
        const versionStr = versionMatch ? versionMatch[0] : "";
        return `/upload/${transformation}/${versionStr}`;
    });
}