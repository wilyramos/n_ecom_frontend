"use client";

import React, { useState } from "react";
import { Bell, ShoppingBag, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
    type: "order" | "stock" | "system";
    href: string;
}

const mockNotifications: NotificationItem[] = [
    {
        id: "1",
        title: "Nueva orden recibida",
        message: "Orden #1024 realizada por Wily Ramos",
        time: "Hace 5 min",
        unread: true,
        type: "order",
        href: "/admin/orders/1024",
    },
    {
        id: "2",
        title: "Alerta de inventario",
        message: "iPhone 15 Pro tiene menos de 3 unidades",
        time: "Hace 1 hora",
        unread: true,
        type: "stock",
        href: "/admin/products",
    },
];

export function AdminNotifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative"
                aria-label="Notificaciones"
                type="button"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900">Notificaciones</span>
                                {unreadCount > 0 && (
                                    <span className="bg-slate-900 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                                >
                                    <Check className="w-3 h-3" />
                                    Marcar leídas
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-500">
                                    Sin notificaciones recientes.
                                </div>
                            ) : (
                                notifications.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-start gap-3 p-3 text-xs transition-colors hover:bg-slate-50 ${item.unread ? "bg-slate-50/60" : ""
                                            }`}
                                    >
                                        <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                                            {item.type === "order" ? (
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                            ) : (
                                                <Check className="w-3.5 h-3.5" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-0.5">
                                            <p className="font-bold text-slate-900 truncate">{item.title}</p>
                                            <p className="text-slate-500 text-[11px] truncate">{item.message}</p>
                                            <p className="text-[10px] text-slate-400 pt-0.5">{item.time}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
                            <Link
                                href="/admin/notifications"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                            >
                                Ver todas las notificaciones
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}