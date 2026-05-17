// frontend/components/navigation/NavBar.tsx
import Link from "next/link";
import Logo from "../ui/Logo";
import ButtonShowCart from "../ui/ButtonShowCart";
import ServerCategorias from "./ServerCategorias";
import NavBarClient from "./NavBarClient";
import ServerSheetMobile from "./ServerSheetMobile";
import { AiOutlineUser } from "react-icons/ai";
import ButtonSearchMobile from "./ButtonSearchMobile";

export default function NavBar() {
    return (
        <NavBarClient>
            <header className="sticky top-0 z-50 h-20 flex flex-col justify-center text-fg-primary bg-surface-primary border-b border-border-default transition-colors duration-300">
                <div className="max-w-screen-2xl w-full mx-auto flex items-center justify-between px-4 md:px-6">

                    {/* Left: Logo siempre a la izquierda alineado */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="md:hidden">
                            <ServerSheetMobile />
                        </div>
                        <Link href="/" className="flex items-center max-w-[140px]">
                            <Logo color="black" size={50} />
                        </Link>
                    </div>

                    {/* Right: Categorías integradas en el flujo principal + Iconos de Acción */}
                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        
                        {/* Categorías de Escritorio integradas directamente al lado de las acciones */}
                        <div className="hidden md:block">
                            <ServerCategorias />
                        </div>

                        {/* Separador sutil visible en desktop */}
                        <div className="hidden md:block h-5 w-px bg-border-default" />

                        {/* Grupo de Iconos de Acción End-to-End */}
                        <div className="flex items-center gap-1 md:gap-2">
                            <ButtonSearchMobile />

                            <Link
                                href="/auth/registro"
                                className="hidden md:flex items-center text-fg-primary rounded-full transition-colors duration-200 hover:text-action-primary"
                                aria-label="Cuenta"
                            >
                                <div className="hover:bg-surface-secondary rounded-full p-2 transition-colors duration-200">
                                    <AiOutlineUser className="h-5 w-5" />
                                </div>
                            </Link>

                            <ButtonShowCart />
                        </div>
                    </div>

                </div>
            </header>
        </NavBarClient>
    );
}