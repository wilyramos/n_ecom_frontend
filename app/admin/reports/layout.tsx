// File: frontend/app/admin/reports/layout.tsx
import React from 'react';
import { AdminPageContainer } from '@/src/components/admin/layout/admin-page-container';
import { AdminPageHeader } from '@/src/components/admin/layout/admin-page-header';
import ReportsNavTabs from '@/components/admin/reports/ReportsNavTabs';
import GlobalDateRangePicker from '@/components/admin/reports/GlobalDateRangePicker';

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="default">
      {/* Cabecera con selector de fechas persistente */}
      <AdminPageHeader 
        title="Análisis y Reportes" 
        description="Supervisa el rendimiento de tu tienda y las métricas clave."
        actions={<GlobalDateRangePicker />} 
      />
      
      {/* Menú de pestañas */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-6">
        <ReportsNavTabs />
      </div>

      {/* Contenido dinámico (page.tsx, sales/page.tsx, etc.) */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
      </div>
    </AdminPageContainer>
  );
}