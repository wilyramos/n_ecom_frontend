//File: frontend/components/home/sections/HomepageSectionsWrapper.tsx

import { getActiveSections } from "@/src/services/section-service";
import HomepageSections2 from "./HomepageSections2";

export default async function HomepageSectionsWrapper() {
    let sections = [];

    try {
        sections = await getActiveSections();
    } catch (error) {
        console.error("Fallo aislado al recuperar secciones del escaparate:", error);
        return null;
    }

    if (sections.length === 0) return null;

    return <HomepageSections2 sections={sections} />;
}