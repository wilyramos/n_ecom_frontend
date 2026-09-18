//File: frontend/components/admin/AdminMenu.tsx

'use client'

import { Fragment } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { SlOptionsVertical } from "react-icons/sl";


import Link from 'next/link';
import { logout } from '@/actions/logout-user-action';
import type { User } from '@/src/schemas';

export default function AdminMenu({ user }: { user: User }) {
    return (
        <Popover className="relative rounded-2xl">
            <PopoverButton className="inline-flex items-center justify-center p-2  transition duration-150 rounded-lg">
                <SlOptionsVertical className="w-4 h-4 text-gray-400" />
            </PopoverButton>


            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <PopoverPanel
                    className="fixed bottom-15 left-5 mb-3  bg-white rounded-2xl ring-1 ring-black/10 p-4"
                >
                    <div className="text-sm text-gray-800">
                        <ul className="space-y-2">
                            <p>{user.email}</p>
                            <li>
                                <Link
                                    href="/admin/profile"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <UserCircleIcon className="w-5 h-5 text-gray-500" />
                                    Mi Perfil 
                                </Link>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={async () => await logout()}
                                    className="flex items-center gap-2 px-3 py-2 w-full rounded-lg hover:bg-gray-100 transition text-left"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500" />
                                    Cerrar Sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                </PopoverPanel>
            </Transition>
        </Popover>
    )
}
