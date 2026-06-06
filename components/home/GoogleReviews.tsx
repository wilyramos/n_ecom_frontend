"use client";

import { useState } from "react";
import Image from "next/image";
import Carousel, { type ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ExternalLink } from "lucide-react";
import HeaderReviews from "@/components/ui/Headerreviews";

const GOOGLE_MAPS_LINK = "https://www.google.com/maps/place/Neoshop+Importaciones/@-12.1203426,-76.9977364,10z/data=!4m6!3m5!1s0x9105c7e5102df947:0x3c711f9098ede003!8m2!3d-12.1138673!4d-76.9918252!16s%2Fg%2F11nhlq2d6p?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D";
const reviews = [
    {
        name: "Grassli Cabrera",
        text: "¡Totalmente recomendados! Tuve temor de pedir un iPhone a provincia, pero su paciencia y excelente atención me dieron toda la confianza.",
        date: "Hace 4 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWXwTP0n0861IgJio8xwKhJlsRQZucX6cG5TFnI0WeoRb24CxjQ=w45-h45-p-rp-mo-br100",
        reviewUrl: "https://maps.app.goo.gl/CHPe3jv3H9S8Yw5C7",
    },
    {
        name: "Angel San Martin",
        text: "Excelentes productos, buenísimos precios y con garantía total.",
        date: "Hace 2 semanas",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXjv-fRLTSO8EBbkyzB_T_AQLZju17wUZ67ItDeqvz9ZZMW_gOP3Q=w45-h45-p-rp-mo-br100",
        reviewUrl: "https://maps.app.goo.gl/shvTKMGREAaukkjd7",
    },
    {
        name: "Ana Ruth Cisneros",
        text: "Calidad 10/10 y una muy buena atención. Super recomendados.",
        date: "Hace 2 semanas",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocKz5QwxfgnUBHXDfeLvh32wC1lrxD8A8fc4RB0fOuJ-LP5TZw=w45-h45-p-rp-mo-br100",
        reviewUrl: "https://maps.app.goo.gl/uwxdDEiGeadhBgUC9",
    },
    {
        name: "Stefany Ravello Cueva",
        text: "Me encanta la tienda, pero sobre todo la forma en que me atienden, la paciencia que tienen para explicar y las recomendaciones que dan para llevarme lo mejor.",
        date: "Hace 2 semanas",
        profilePhotoUrl: "",
        reviewUrl: "https://maps.app.goo.gl/dwFJvjaDmBbt7jcS7",
    },
    {
        name: "Maria Elena Ramos",
        text: "Me gustó como me atendieron y tienen productos variados y buenos precios, salí feliz y contenta.",
        date: "Hace 2 semanas",
        profilePhotoUrl: "",
        reviewUrl: "https://maps.app.goo.gl/wKvQGWE1nMBisti9A",
    },
    {
        name: "Mafer cp",
        text: "Excelente atención, muy amables y pacientes. Me ayudaron a elegir el producto que mejor se adaptaba a mis necesidades y presupuesto. Además, los precios son muy competitivos. Sin duda volveré a comprar aquí.",
        date: "Hace 3 semanas",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjVCCk2UGIhgfM6L8hpPcdSEEqQ4Iat_qNHLgkqqg9nMq4VvjbXb=w45-h45-p-rp-mo-ba12-br100",
        reviewUrl: "https://maps.app.goo.gl/fWzhaLVGgskPXqva8",
    },
];

// Paleta suave para los avatares fallback
const avatarPalette = [
    { bg: "bg-blue-50 border border-blue-200", text: "text-blue-700" },
    { bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700" },
    { bg: "bg-rose-50 border border-rose-200", text: "text-rose-700" },
    { bg: "bg-violet-50 border border-violet-200", text: "text-violet-700" },
    { bg: "bg-amber-50 border border-amber-200", text: "text-amber-700" },
];

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}


function StarRating({ count = 5 }: { count?: number }) {
    return (
        <div className="flex gap-0.5" aria-label={`${count} estrellas`}>
            {Array.from({ length: count }).map((_, i) => (
                <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#FBBC04"
                    aria-hidden="true"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
}

interface AvatarProps {
    src?: string;
    name: string;
    index: number;
}

function Avatar({ src, name, index }: AvatarProps) {
    const [error, setError] = useState(false);
    const { bg, text } = avatarPalette[index % avatarPalette.length];
    const isValidUrl = src && src.startsWith("https://") && !error;

    if (isValidUrl) {
        return (
            <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden ring-2 ring-border-default">
                <Image
                    src={src}
                    alt={name}
                    fill
                    sizes="40px"
                    className="object-cover"
                    onError={() => setError(true)}
                />
            </div>
        );
    }

    return (
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${bg} ${text}`}
        >
            {getInitials(name)}
        </div>
    );
}

const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => (
    <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8">
        <HeaderReviews
            {...props}
            title={<>Lo que dicen nuestros clientes</>}
            viewAllHref={GOOGLE_MAPS_LINK}
        />
    </div>
);

function ReviewCard({
    review,
    index,
}: {
    review: (typeof reviews)[0];
    index: number;
}) {
    const hasValidLink =
        review.reviewUrl &&
        !review.reviewUrl.includes("maps.google.com/9") &&
        review.reviewUrl !== "";

    return (
        /* Altura fija para que todas las cards sean iguales */
        <div className="h-[220px] bg-surface-primary border border-border-default rounded-2xl p-5 flex flex-col gap-3">
            {/* Header: avatar + nombre + logo Google */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <Avatar src={review.profilePhotoUrl} name={review.name} index={index} />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-fg-primary leading-tight truncate max-w-[140px]">
                            {review.name}
                        </p>
                        <p className="text-xs text-fg-muted mt-0.5">{review.date}</p>
                    </div>
                </div>

                {/* Google logo + enlace externo */}
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    {hasValidLink && (
                        <a
                            href={review.reviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg-muted hover:text-fg-primary transition-colors"
                            aria-label={`Ver reseña de ${review.name} en Google`}
                        >
                            <ExternalLink size={13}  className="text-gray-200"/>
                        </a>
                    )}
                </div>
            </div>

            {/* Estrellas */}
            <StarRating />

            {/* Texto de la reseña — clamp a 3 líneas para altura uniforme */}
            <p className="text-sm text-fg-primary leading-relaxed line-clamp-3 flex-1">
                {review.text}
            </p>
        </div>
    );
}

export default function GoogleReviews() {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 1, partialVisibilityGutter: 30 },
    };

    return (
        <section className="w-full max-w-7xl mx-auto relative pt-12 pb-6 px-4 md:px-8 ">
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={4000}
                arrows={false}
                renderButtonGroupOutside
                customButtonGroup={<AbsoluteHeaderWrapper />}
                itemClass="px-2 md:px-3 py-4"
                className="pt-12"
            >
                {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} index={index} />
                ))}
            </Carousel>
        </section>
    );
}