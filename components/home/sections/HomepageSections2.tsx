import { SectionResponse } from "@/src/schemas/section.schema";
import RichTextSection from "./RichTextSection";
import ProductGridSection from "./ProductGridSection";
import FeaturedCollectionsSection from "./FeaturedCollectionsSection";

interface HomepageSectionsProps {
    sections: SectionResponse[];
}

export default function HomepageSections2({ sections }: HomepageSectionsProps) {
    return (
        <div className="space-y-16 md:space-y-24 my-8 md:my-14">
            {sections.map((section) => {
                // Filtro preventivo estructural de nodos vacíos
                if (section.type !== "rich_text" && (!section.blocks || section.blocks.length === 0)) {
                    return null;
                }

                const columns = section.settings?.gridColumns ?? 4;

                return (
                    <article key={section._id} className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        {section.type === "rich_text" && (
                            <RichTextSection section={section} />
                        )}

                        {section.type === "product_grid" && (
                            <ProductGridSection section={section} columns={columns} />
                        )}

                        {section.type === "featured_collections" && (
                            <FeaturedCollectionsSection section={section} columns={columns} />
                        )}
                    </article>
                );
            })}
        </div>
    );
}