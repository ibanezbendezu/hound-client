"use client";

import {usePathname} from "next/navigation";
import {FolderRoot, MenuIcon} from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

export const Navbar = ({isCollapsed, onResetWidth}: NavbarProps) => {
    const pathname = usePathname();
    console.log(pathname);

    return (
        <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-3 w-full flex items-center gap-x-4">
            {isCollapsed && (
                <MenuIcon
                    role="button"
                    onClick={onResetWidth}
                    className="h-6 w-6 text-muted-foreground"
                />
            )}

            {(!pathname.includes("users") && !pathname.includes("repositories")) ? (
                <div className="pl-2">
                    <Breadcrumbs/>
                </div>
            ) : (
                <div className="pl-2">
                    <FolderRoot className="h-5 w-5 text-muted/60"/>
                </div>
            )}

            {/* {pathname.includes("graph") && (
                <div className="flex flex-row items-center gap-x-4 ml-auto mr-auto font-mono text-muted-foreground">
                    <div className="flex flex-row items-center hover:text-primary">
                        <button>grid</button>
                    </div>
                    <div className="flex flex-row items-center hover:text-primary">
                        <button>círculo</button>
                    </div>
                    <div className="flex flex-row items-center hover:text-primary">
                        <button>cola</button>
                    </div>
                </div>  
            )} */}
        </nav>
    );
};
