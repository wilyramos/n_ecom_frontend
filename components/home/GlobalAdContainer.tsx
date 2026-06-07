import { AdvertisementService } from "@/src/services/advertisement-service";
import TopBarAd from "./TopBarAd";
import ModalPopupAd from "./ModalPopupAd";

export default async function GlobalAdContainer() {
    let ads = [];
    
    try {
        ads = await AdvertisementService.getActiveAds();
    } catch (error) {
        console.error("Fallo al recuperar avisos para storefront:", error);
        return null;
    }

    if (ads.length === 0) return null;

    // 1. Agrupamos todos los anuncios activos con layout de barra superior
    const topBarAds = ads.filter(ad => ad.layout === "top_bar");
    
    // 2. Mantenemos el primer modal popup prioritario que deba saltar
    const currentModal = ads.find(ad => ad.layout === "modal_popup");

    return (
        <>
            {topBarAds.length > 0 && <TopBarAd ads={topBarAds} />}
            {currentModal && <ModalPopupAd ad={currentModal} />}
        </>
    );
}