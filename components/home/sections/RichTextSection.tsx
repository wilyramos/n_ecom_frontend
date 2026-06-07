import { SectionResponse } from "@/src/schemas/section.schema";

interface RichTextSectionProps {
    section: SectionResponse;
}

export default function RichTextSection({ section }: RichTextSectionProps) {
    return (
        <div
            className="prose prose-sm md:prose-base dark:prose-invert max-w-3xl mx-auto text-foreground"
            dangerouslySetInnerHTML={{ __html: section.settings?.bodyText || "" }}
        />
    );
}