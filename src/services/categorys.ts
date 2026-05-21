import "server-only";

import { cache } from 'react';
import { notFound } from 'next/navigation';
import { apiCategorySchema, apiCategoryListSchema } from "@/src/schemas";

export const getCategory = cache(async (id: string) => {

    const url = `${process.env.API_URL}/category/${id}`;

    const req = await fetch(url, {
        method: 'GET',
    });

    const json = await req.json();
    if (!req.ok) {
        notFound();
    }

    const category = apiCategorySchema.parse(json);
    return category;
});

export const getCategoryBySlug = cache(async (slug: string) => {
    const url = `${process.env.API_URL}/category/slug/${slug}`;

    const req = await fetch(url, {
        method: 'GET',
    });

    const json = await req.json();
    if (!req.ok) {
        notFound();
    }

    const category = apiCategorySchema.parse(json);
    return category;
});

export const getCategories = cache(async () => {
    const url = `${process.env.API_URL}/category`;
    const res = await fetch(url, {
        method: "GET",
    });
    if (!res.ok) {
        notFound();
    }

    const json = await res.json();
    const categories = apiCategoryListSchema.parse(json);
    return categories;
});

export const getPatternCategories = cache(async () => {
    const url = `${process.env.API_URL}/category/patterns/all`;
    const res = await fetch(url, {
        method: "GET",
    });
    if (!res.ok) {
        notFound();
    }

    const json = await res.json();
    const categories = apiCategoryListSchema.parse(json);
    return categories;
});

export const getAllSubcategories = cache(async () => {
    const url = `${process.env.API_URL}/category/all/subcategories`;
    const res = await fetch(url, {
        method: "GET",
    });
    if (!res.ok) {
        notFound();
    }

    const json = await res.json();
    const categories = apiCategoryListSchema.parse(json);
    return categories;
});