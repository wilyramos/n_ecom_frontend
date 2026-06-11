interface SectionHeaderProps {
    title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-fg-muted">
                {title}
            </h2>
        </div>
    );
}