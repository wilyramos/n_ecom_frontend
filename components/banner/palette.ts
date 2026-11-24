// File: frontend/components/banner/palette.ts
// Colores del banner derivados del tema. El admin ya no permite colores personalizados.

export interface BannerPalette {
    bg: string;
    text: string;
    accent: string;
    isDark: boolean;
}

export function bannerPalette(theme?: string): BannerPalette {
    const isDark = theme !== "light";
    return isDark
        ? { bg: "#000000", text: "#cbcbcb", accent: "#a0a0a0", isDark: true }
        : { bg: "#ffffff", text: "#171411", accent: "#a0a0a0", isDark: false };
}
