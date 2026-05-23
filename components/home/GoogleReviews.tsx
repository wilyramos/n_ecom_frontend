"use client";

import Carousel, { type ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import HeaderReviews from "@/components/ui/Headerreviews";

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/zj4xWgvhpriccf8e7";

const reviews = [
    { name: "Grassli Cabrera", text: "¡Totalmente recomendados! Tuve temor de pedir un iPhone a provincia, pero su paciencia y excelente atención me dieron toda la confianza.", date: "Hace 4 días" },
    { name: "Guillermo Jiménez", text: "Excelente atención.", date: "Hace 2 semanas" },
    { name: "Ana Ruth Cisneros", text: "Calidad 10/10 y una muy buena atención. Super recomendados.", date: "Hace 2 semanas" },
    { name: "Angel San Martin", text: "Excelentes productos, buenísimos precios y con garantía total!", date: "Hace 2 semanas" },
    { name: "Maria Elena Ramos", text: "Me gustó como me atendieron y tienen productos variados y buenos precios, salí feliz y contenta.", date: "Hace 2 semanas" },
];

const avatarColors: Record<number, { bg: string; text: string }> = {
    0: { bg: "bg-blue-100", text: "text-blue-700" },
    1: { bg: "bg-teal-100", text: "text-teal-700" },
    2: { bg: "bg-rose-100", text: "text-rose-700" },
    3: { bg: "bg-violet-100", text: "text-violet-700" },
    4: { bg: "bg-amber-100", text: "text-amber-700" },
};

function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function StarRating({ count = 5 }: { count?: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <Star key={i} size={14} className="fill-[#FBBC04] text-[#FBBC04]" />
            ))}
        </div>
    );
}

const AbsoluteHeaderWrapper = (props: ButtonGroupProps) => {
    return (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8">
            <HeaderReviews
                {...props}
                title={<>Lo que dicen nuestros clientes</>}
                viewAllHref={GOOGLE_MAPS_LINK}
            />
        </div>
    );
};

export default function GoogleReviews() {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 1, partialVisibilityGutter: 30 },
    };

    return (
        <section className="w-full max-w-7xl mx-auto relative pt-16 pb-8 px-4 md:px-8 bg-surface-primary">
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
                {reviews.map((review, index) => {
                    const { bg, text } = avatarColors[index % 5];
                    const initials = getInitials(review.name);

                    return (
                        <div key={index} className="h-full">
                            <Card className="bg-surface-primary border border-border-default rounded-2xl shadow-none h-full">
                                <CardContent className="p-5 flex flex-col gap-3 h-full">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${bg} ${text}`}>
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-fg-primary leading-tight">{review.name}</p>
                                            <p className="text-xs text-fg-muted">{review.date}</p>
                                        </div>
                                    </div>
                                    <StarRating />
                                    <p className="text-sm text-fg-primary leading-relaxed flex-1 italic">
                                        &quot;{review.text}&quot;
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </Carousel>
        </section>
    );
}