// File: frontend/app/admin/banner/new/page.tsx
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CreateSliderBannerForm from "@/components/admin/banner/CreateSliderBannerForm";

export default function NewSliderPage() {
    return (
        <AdminPageWrapper 
            title="Nuevo Banner del Slider"
            
            
        
        >
            <div className="max-screen-2xl mx-auto">
                <CreateSliderBannerForm />
            </div>
        </AdminPageWrapper>
    );
}