"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useMemo, useCallback } from "react";

export function useCatalogNav() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();

    const slugs = useMemo(() => {
        return (params.slug as string[]) || [];
    }, [params.slug]);

    const createUrl = useCallback((newPath: string, currentParams: URLSearchParams = new URLSearchParams(searchParams.toString())) => {
        const paramsString = currentParams.toString();
        return paramsString ? `${newPath}?${paramsString}` : newPath;
    }, [searchParams]);

    const setCategory = useCallback((categorySlug: string) => {
        if (slugs.includes(categorySlug)) return;
        const newPath = `/catalogo/${categorySlug}`;
        router.push(createUrl(newPath));
    }, [slugs, router, createUrl]);

    const setBrand = useCallback((brandSlug: string) => {
        if (slugs.includes(brandSlug)) {
            const newSlugs = slugs.filter(s => s !== brandSlug);
            const newPath = newSlugs.length > 0 ? `/catalogo/${newSlugs.join('/')}` : '/catalogo';
            router.push(createUrl(newPath));
            return;
        }
        const newPath = `/catalogo/${[...slugs, brandSlug].join('/')}`;
        router.push(createUrl(newPath));
    }, [slugs, router, createUrl]);

    const setLine = useCallback((lineSlug: string) => {
        if (slugs.includes(lineSlug)) {
            const newSlugs = slugs.filter(s => s !== lineSlug);
            const newPath = newSlugs.length > 0 ? `/catalogo/${newSlugs.join('/')}` : '/catalogo';
            router.push(createUrl(newPath));
        } else {
            const newPath = `/catalogo/${[...slugs, lineSlug].join('/')}`;
            router.push(createUrl(newPath));
        }
    }, [slugs, router, createUrl]);

    const isCategoryActive = (slug: string) => slugs.includes(slug);
    const isBrandActive = (slug: string) => slugs.includes(slug);
    const isLineActive = (slug: string) => slugs.includes(slug);

    const updateFilter = useCallback((key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('page');

        if (key === 'sort') {
            newParams.set(key, value);
        } else {
            if (newParams.has(key, value)) {
                newParams.delete(key, value);
            } else {
                newParams.append(key, value);
            }
        }

        const pathname = window.location.pathname;
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [searchParams, router]);

    // Métodos dedicados para el manejo del precio
    const setPriceRange = useCallback((min: number, max: number) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('page');
        newParams.set('priceRange', `${min}-${max}`);

        const pathname = window.location.pathname;
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const clearPriceRange = useCallback(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('priceRange');
        newParams.delete('page');

        const pathname = window.location.pathname;
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const currentPriceRange = useMemo(() => {
        const raw = searchParams.get('priceRange');
        if (!raw) return null;
        const [min, max] = raw.split('-').map(Number);
        return isNaN(min) || isNaN(max) ? null : { min, max };
    }, [searchParams]);

    const clearFilters = useCallback(() => {
        router.push(window.location.pathname);
    }, [router]);

    return {
        currentSlugs: slugs,
        hasFilters: slugs.length > 0 || searchParams.toString().length > 0,
        isCategoryActive,
        isBrandActive,
        isLineActive,
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        setPriceRange,
        clearPriceRange,
        currentPriceRange,
        clearFilters,
        searchParams
    };
}