import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}



export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "PEN",
    }).format(amount);
}

export function getProvincesByDepartment(department: string): string[] {

    const data = [
        { department: "Amazonas", provinces: ["Chachapoyas", "Bagua", "Bongará", "Condorcanqui", "Luya", "Rodríguez de Mendoza", "Utcubamba"] },
        { department: "Áncash", provinces: ["Huaraz", "Aija", "Antonio Raymondi", "Asunción", "Bolognesi", "Carhuaz", "Carlos Fermín Fitzcarrald", "Casma", "Corongo", "Huari", "Huarmey", "Huaylas", "Mariscal Luzuriaga", "Ocros", "Pallasca", "Pomabamba", "Recuay", "Santa", "Sihuas", "Yungay"] },
        { department: "Ucayali", provinces: ["Atalaya", "Coronel Portillo", "Padre Abad", "Purús"] }
    ];

    return data.find(item => item.department === department)?.provinces || [];
}

export function getSearchHistory(): string[] {
    if (typeof window === "undefined") return [];
    const saved = JSON.parse(localStorage.getItem("search-history") || "[]");
    return Array.isArray(saved) ? saved : [];
}

export function saveSearchTerm(term: string): void {
    if (typeof window === "undefined" || !term) return;
    const history = getSearchHistory();
    const updated = [term, ...history.filter(h => h !== term)].slice(0, 5);
    localStorage.setItem("search-history", JSON.stringify(updated));
}

export function getDeliveryRange(days: number): string {
    const today = new Date();

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + days);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 1);

    const format = (date: Date) =>
        date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
        });

    return `${format(startDate)} – ${format(endDate)}`;
}


export function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        minimumFractionDigits: 2,
    }).format(price);
}

export const toDateKey = (d: Date | string): string =>
    new Date(d).toISOString().slice(0, 10);

export function isSameDay(
    a: Date | string | number,
    b: Date | string | number,
    timeZone = 'America/Lima'
): boolean {
    const opts: Intl.DateTimeFormatOptions = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(a).toLocaleDateString('en-CA', opts) ===
           new Date(b).toLocaleDateString('en-CA', opts);
}

export const formatTime = (date: Date | string): string =>
    new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });



/**
 * Transforma horas en formato decimal (ej. 7.87) a un formato de horas y minutos (ej. 7h 52m)
 */
export function formatDecimalHours(decimalHours: number): string {
    const totalMinutes = Math.round(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
}