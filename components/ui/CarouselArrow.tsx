// File: frontend/components/ui/CarouselArrow.tsx
"use client";

import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

interface ArrowProps {
    onClick?: () => void;
    direction: "left" | "right";
}

export function CarouselArrow({ onClick, direction }: ArrowProps) {
    const baseClasses =
        "absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer " +
        "text-gray-400 hover:text-gray-900 transition-colors duration-200";

    const position = direction === "left" ? "-left-2" : "-right-2";

    return (
        <button onClick={onClick} className={`${baseClasses} ${position}`}>
            {direction === "left" ? (
                <MdArrowBackIosNew size={28} />
            ) : (
                <MdArrowForwardIos size={28} />
            )}
        </button>
    );
}