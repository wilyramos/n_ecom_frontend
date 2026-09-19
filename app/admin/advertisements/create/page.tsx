// File: frontend/app/admin/advertisements/new/page.tsx
import NewAdvertisementClient from "@/components/admin/advertisements/NewAdvertisementClient";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";

export default function NewAdvertisementPage() {
  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
      <NewAdvertisementClient />
    </AdminPageContainer>
  );
}