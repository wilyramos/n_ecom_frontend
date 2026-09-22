"use client";

import { useState } from "react";
import Image from "next/image";
import Carousel, { type ButtonGroupProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ExternalLink } from "lucide-react";
import HeaderReviews from "@/components/ui/Headerreviews";

const GOOGLE_MAPS_LINK = "https://www.google.com/maps/place/Neoshop+Importaciones/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m6!3m5!1s0x9105c7e5102df947:0x3c711f9098ede003!8m2!3d-12.1138673!4d-76.9918252!16s%2Fg%2F11nhlq2d6p";

const reviews = [
    {
        name: "Brenda Huallpa",
        text: "Excelente atención al cliente! Te explican a detalle las características del producto",
        date: "hace 2 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocIRwpPdjFuSZ6BAZw0M_exPcJ_bfrXmmfCsUO13u1LdKP4mRg=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Julio C. Patiño",
        text: "Trato amable desde el ingreso a la tienda, buenos precios y buena experiencia para la compra en Neoshop",
        date: "hace 2 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWO637N56NDNxsb141AIyKzKhRf88kLFZsybwLcIauNhX7-TcKRIg=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Ada angella Quispe ayala",
        text: "Excelente atención y muy buena experiencia de compra. Me orientaron muy bien y respondieron todas mis dudas. La tienda es 100% confiable.",
        date: "hace 2 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXDlc10-DTeBklFbxpWP0NXDhUTw-Rkv728nX5HFPhGrH-HUHzk=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Diego PremYT",
        text: "Muy buena atención y excelente calidad de productos , muy recomendado.",
        date: "hace 4 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocLvdub-BnkUzF_rJk9wC29Yjak0pfDhZdaj7rvidLQ3AKoaYg=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Diana Millones",
        text: "Buena experiencia, la atención excelente! Recomendado!",
        date: "hace 4 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWedBBkmNvyrr-s2tEoyVKWExiVwFnRNh6yaaCndEaNeJtSHI-O=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Paula Aranda",
        text: "Muy bonita tienda y muy buena atención recomendado",
        date: "hace 5 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocK8B3TuPgTT_ELQpB9-DgdF4QT-RglNNhyEJfOKL7wEaUdY2V4=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "aracely inga silva",
        text: "Lugar muy bonito y personal super amable qué me explico los diferentes modelos que tienen disponibles y me dio mucha comodidad comprar. Recomendado!!!",
        date: "hace 5 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocLO9to_0zaQZjOkhc6p2KJR3Tv1JLNNmQrDZqpMMQJs1Y9hPQ=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Flavio Sm",
        text: "Todo bien, iphone sellado",
        date: "hace 6 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocLDfDfZvpOwK81FJBrtr44pfN4TYICL954K59SR4yepIQm7Ug=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Yamile Abarca",
        text: "Muy buena experiencia, buena atención! Lo recomiendo ✨️",
        date: "hace 6 días",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocLYZQ6lz9mCwi3sOJktoyWmVP1L_bPUrt8oKCAV85JZ0pz0XQ=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "heyser Ruiz Garay",
        text: "Excelente servicio, te enseñan todas las características del equipo y te brindan seguridad al comprarlo. 💪🏻🙌🏻…",
        date: "Hace una semana",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocKoT_y0-4aO4TlgeE-mDepK-ox15ZpRHuz1tR7_a5nBl7DVeA=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "xiomara cabana meza",
        text: "Muy contenta con mi compra, El iPhone en perfectas condiciones, tal como se mostraba, bien protegido y dentro del tiempo acordado. Excelente atención y servicio. ¡100% recomendado! 😊…",
        date: "Hace una semana",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWF72rfW3SxAL5WevNbRPaeLBxLQpuWFsDWqNaXRnAy5iYk-Ox7=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "José Luis AT",
        text: "Adquirí mi primer iPhone y me encanto se los recomiendo.Gracias Neoshop!!",
        date: "Hace una semana",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjVWK4NdTgjMqCRMCkfW-vDAPhkhK0TwlGc4X8olbmIBUiSlmDUZ=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Richard David Luna Olave",
        text: "La atención es sumamente rápida, no hubo demora, y sobre todo que es empresa y te da la seguridad ante cualquier imprevisto.",
        date: "Hace 2 semanas",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXM97NauZjwd_2aNkZLM3FMH2l3Yn5WgP2G_9ct25yIWOxDFdi66w=w50-h50-p-rp-mo-ba12-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "SOFIA OROZCO",
        text: "muy buena atención de ani, muy amable, quede contenta con mi compra 🥰…",
        date: "Hace 2 semanas",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocKjHYZhzOLygtif582hhj50JXYTSsvS8SSbPF46-PVEgsHuxQ=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Betsabe Ardela",
        text: "Excelente y tienen mucha paciencia y te brinda confiabilidad",
        date: "Hace 3 semanas",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjUuI3dm7_pD2TNyQj6CpZ1ITNApRp0AzV3Rc-eRDPF36R36TTqW1A=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Lizbethd Alexandra Condori Fajardo",
        text: "Buen trato\nBuen precio",
        date: "Hace 3 semanas",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjUosFy_lJGbeFIKEwICPK5n7jv_VSenk3fH7_w6wlkc43h_kAT6Lw=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Mariluz Cochachin",
        text: "Muy buena atención y excelente servicio. Mi pedido llegó a provincia en perfectas condiciones y todo salió muy bien. Siempre estuvieron atentos y respondieron mis dudas con mucha amabilidad. ¡Muy contenta con mi compra!",
        date: "Hace 3 semanas",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocIUV9duqUj5hynK_yy3ZyVH8n0tU1eqWBYqR_xqBzUxmnBvUA=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Carlos Chicoma",
        text: "Buenos precios!",
        date: "Hace un mes",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjV-gw52fEB26mzm8Xz6g8Sr3yh56bb1nA-KfB3RpQoXoGuVhbw9vA=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Alejandro García",
        text: "TODO MUY EXCELENTE. LA ATENCION Y EL TRATO DE PARTE DE LAS SEÑORITAS, MI PEDIDO ME LLEGO A MI PROVINCIA, GRACIAS A NEOSHOP, PRONTO PEDIRE MAS COSAS",
        date: "Hace un mes",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXwbmqMoCUasRCw1we1yesEMzFgmrqFPMTkjCB6tvcCWSHQJ65Y=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "fanny lu",
        text: "Excelente atencion",
        date: "Hace un mes",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjUO79A928LgfsI6Tg7GHChYvv_-WE4eYZ7hI-SB75L3TwpHswQqog=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Victoria Herebia",
        text: "Excelente atención. Me ayudaron a elegir el equipo que necesitaba y resolvieron todas mis dudas con mucha paciencia. El proceso de compra fue rápido y todo salió perfecto. Muy recomendados!",
        date: "Hace un mes",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWdUr0M-2aT6txyg21nHEfPlqcBQ14enxYBuXMKSD5mbRU5phWC=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Antoni Llallico",
        text: "Hace poco adquirí un equipo sellado y todo va muy bien, al principio tenia mis dudas obviamente pero me dieron mucha confianza, revisaron los IMEIs y estaban ok. Algo que destaco es la comunicación y acompañamiento que tienen con el cliente…",
        date: "Hace un mes",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocLZj4VcqN5OuDbdXvdvY52CoaANHU9mxIE6RN_-LUAJ1pLD1Q=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Noemi Anabella Ledesma De La Cruz",
        text: "Excelente atencion, te atienden con amabilidad y brindan toda Información del producto",
        date: "Hace un mes",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXiYtRbgfhdhY38S5g2I0566diKEIh4utKFfcRknzy29XDbo84X=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Eglyhec Chirinos",
        text: "Una atención personalizada, un grato ambiente y excelente equipos",
        date: "Hace 2 meses",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjVE2hXSJhHg7jpwhRg3KYOAaCx4z8JyMHHqJjmv6GEp31WeYsmx=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Pedro Cárdenas Cabrera",
        text: "Muy buena experiencia, muy atentos todos los chicos. Recomendado!",
        date: "Hace 2 meses",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjVeLueseKOsDj-ZAcfbFyLfklXFFDWGLDFHF60VNj7fNVyuOik=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Marcelo Cruz Aguilar",
        text: "Compré un iPhone 17 en esta tienda y la experiencia fue excelente. Desde que llegué recibí una atención muy amable y profesional. Además, ofrecen bebidas de cortesía mientras esperas, un detalle que hace la experiencia aún más agradable.…",
        date: "Hace 2 meses",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjU2nfyUmziEfJcstuSodSrzF98J-UjKM9feXABXpMIdZP_kI28Z=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Milagros motta jesus",
        text: "Excelente atención, muy amable y atentos. Quedé muy satisfecha con el servicio. ¡Totalmente recomendado!",
        date: "Hace 2 meses",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjW5-5bkgOndWf7101lp_T4AU8esvsoETsN5yDI5UZAEeKfatDhI=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Alison Andrea",
        text: "Super buena atención, confiable e inmediato",
        date: "Hace 2 meses",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjUAfteV3aNldMAoI7Wq8Cs2iirUkF1AMr1PyoTRpfuijRth8uq6hg=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "CARLOS HENDRHYS VASQUEZ SANCHEZ",
        text: "Excelente servicio, muy amables y con respecto al equipo todo original y un 100/10. 100% confiables 😎✌🏻…",
        date: "Hace 2 meses",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocK9jfYbmuc10Q7UHGlILnRdvzsPVCQiFS2CfAN7jxhpWNtljQ=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Cristina",
        text: "Excelente atención, 100% confiable y recomendable.",
        date: "Hace 2 meses",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a/ACg8ocKmhRFiwxUmaW1fVcr6qBeHsHCRya3GHVeWEgYqV-z_pJ2nsNCS=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
    {
        name: "Monica Quispe Gomez",
        text: "100% seguro , equipo registrado en lista blanca que era lo más importante para mí , totalmente nuevo y sellado , buena atención por parte de los trabajadores ✨",
        date: "Hace 2 meses",
        profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjW48dsLDXvw9k8Xh6jXh3ZwvFNW5Zfq_FEg_kl7M--jue5BAJou=w50-h50-p-rp-mo-br100",
        reviewUrl: "https://www.google.com/maps/contrib/115036562531835912416/reviews/@-12.1138673,-76.9918252,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=es-PE",
    },
];

const avatarPalette = [
    { bg: "bg-brand-silver-border border border-brand-silver", text: "text-brand-charcoal" },
    { bg: "bg-brand-action-muted border border-brand-action/40", text: "text-brand-charcoal" },
    { bg: "bg-brand-silver/20 border border-brand-silver", text: "text-brand-charcoal" },
    { bg: "bg-brand-action/15 border border-brand-action/30", text: "text-brand-charcoal" },
    { bg: "bg-brand-silver-border/60 border border-brand-silver", text: "text-brand-charcoal" },
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
            <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden ring-2 ring-brand-silver-border">
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
    const hasValidLink = Boolean(review.reviewUrl);

    return (
        <div className="h-[220px] bg-background border border-brand-silver-border rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <Avatar src={review.profilePhotoUrl} name={review.name} index={index} />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand-charcoal leading-tight truncate max-w-[140px]">
                            {review.name}
                        </p>
                        <p className="text-xs text-brand-gris mt-0.5">{review.date}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    {hasValidLink && (
                        <a
                            href={review.reviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-gris hover:text-brand-charcoal transition-colors"
                            aria-label={`Ver reseña de ${review.name} en Google`}
                        >
                            <ExternalLink size={13} className="text-brand-silver hover:text-brand-charcoal transition-colors" />
                        </a>
                    )}
                </div>
            </div>

            <StarRating />

            <p className="text-sm text-brand-charcoal leading-relaxed line-clamp-3 flex-1">
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
        <section className="w-full max-w-7xl mx-auto relative pt-12 pb-6 px-4 md:px-8">
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