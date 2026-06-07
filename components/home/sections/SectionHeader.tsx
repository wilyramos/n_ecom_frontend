interface SectionHeaderProps {
    title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground whitespace-nowrap">
                {title}
            </h2>
            <div className="flex-1 h-px bg-border" />
        </div>
    );
}