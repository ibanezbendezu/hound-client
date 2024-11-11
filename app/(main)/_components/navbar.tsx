"use client";

import {usePathname} from "next/navigation";
import {FolderRoot, MenuIcon} from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import {ThresholdSlider} from "@/app/(main)/_components/threshhold-slider";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

export const Navbar = ({isCollapsed, onResetWidth}: NavbarProps) => {
    const pathname = usePathname();

    return (
        <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-3 w-full flex items-center gap-x-4">
            <div className="flex items-center gap-x-4 flex-grow">
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
            </div>

            {pathname.includes("groups") && (
                <div className="ml-auto w-1/3">
                    <ThresholdSlider/>
                </div>
            )}
        </nav>
    );
};
