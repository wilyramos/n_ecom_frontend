import Link from "next/link";
import Logo from "../ui/Logo";
import ButtonShowCart from "../ui/ButtonShowCart";
import ServerCategorias from "./ServerCategorias";
import NavBarClient from "./NavBarClient";
import ServerSheetMobile from "./ServerSheetMobile";
import ButtonSearchMobile from "./ButtonSearchMobile";
import { HiOutlineUserCircle } from "react-icons/hi2";

export default function NavBar() {
    return (
        <NavBarClient>
            <div
                id="navbar-fixed"
                className="h-18 flex flex-col justify-center text-fg-primary bg-surface-primary border-b border-border-default transition-colors duration-300"
            >
                <div className="max-w-7xl w-full mx-auto flex items-center justify-between md:justify-start px-4 md:px-6 relative h-full">

                    {/* Mobile: Logo centrado */}
                    <div className="md:hidden absolute left-1/2 top-0 bottom-0 flex items-center justify-center -ml-16">
                        {/* Cambiar -translate-x-1/2 por -ml-[50%] del ancho */}
                        <Link href="/">
                            <Logo
                                color="black"
                                className="h-8 w-32"
                                // Añadir estilos inline para Safari
                                style={{
                                    WebkitFontSmoothing: 'antialiased',
                                    willChange: 'transform',
                                }}
                            />
                        </Link>
                    </div>

                    {/* Mobile: Menú a la izquierda */}
                    <div className="md:hidden">
                        <ServerSheetMobile />
                    </div>

                    {/* Desktop: Logo a la izquierda ocupando espacio */}
                    <div className="hidden md:flex items-center flex-1 h-full max-w-[250px]">
                        <Link href="/" className="flex items-center">
                            <Logo color="black" className="h-10 w-44" />
                        </Link>
                    </div>

                    {/* Right: Categorías integradas + Iconos de Acción */}
                    <div className="flex items-center gap-2 md:gap-4 shrink-0 md:ml-auto">

                        {/* Categorías de Escritorio */}
                        <div className="hidden md:block">
                            <ServerCategorias />
                        </div>

                        {/* Separador sutil visible en desktop */}
                        <div className="hidden md:block h-5 w-px bg-border-default" />

                        {/* Grupo de Iconos de Acción */}
                        <div className="flex items-center gap-1 md:gap-2">
                            <ButtonSearchMobile />

                            <Link
                                href="/auth/registro"
                                className="hidden md:flex items-center text-fg-muted rounded-full transition-colors duration-200"
                                aria-label="Cuenta"
                            >
                                <div className="hover:bg-fg-action rounded-full p-2 transition-colors duration-200">
                                    <HiOutlineUserCircle className="h-6 w-6" />
                                </div>
                            </Link>

                            <ButtonShowCart />
                        </div>
                    </div>

                </div>
            </div>
        </NavBarClient>
    );
}