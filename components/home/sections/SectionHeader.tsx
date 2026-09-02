import HeaderConTituloConControles from "@/components/ui/HeaderConTituloConControles";


interface SectionHeaderProps {
    title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <HeaderConTituloConControles title={title} />
    );
}