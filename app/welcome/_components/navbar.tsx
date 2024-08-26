"use client";

import {useScrollTop} from "@/hooks/use-scroll-top";
import {cn} from "@/lib/utils";
import {Logo} from "./logo";
import {ModeToggle} from "@/components/mode-toggle";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/api/auth-server";
import useStore from "@/store/groups";


export const Navbar = () => {
    const scrolled = useScrollTop();
    const router = useRouter();

    const handleLogout = async () => {
        logout();
        useStore.getState().emptyStore();
        router.push("/login");
    };

    return (
        <div
            className={cn(
                "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-3",
                scrolled && "border-b shadow-sm"
            )}
        >
            <Logo/>
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                <Button variant="normal" size="sm" onClick={handleLogout}>
                    Log out
                </Button>
                <ModeToggle/>
            </div>
        </div>
    );
};
