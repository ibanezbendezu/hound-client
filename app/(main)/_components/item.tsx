"use client";

import { groupDataRequestBySha, groupDeleteRequestBySha } from "@/api/server-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import useStore from "@/store/groups";
import {
    LucideIcon,
    MoreHorizontal,
    Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ItemProps {
    id?: number | string;
    active?: boolean;
    isSearched?: boolean;
    isGroup?: number;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
}

export const Item = ({
    id,
    active,
    isSearched,
    isGroup,
    label,
    onClick,
    icon: Icon,
}: ItemProps) => {

    const {removeGroupFromStore} = useStore(state => state);
    const router = useRouter();

    const onDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (id !== undefined && typeof id === 'string') {
            removeGroupFromStore({sha: id});
            const promise = groupDeleteRequestBySha(id).then(() => router.push("/home"));
            toast.promise(promise, {
                loading: "Eliminando grupo...",
                success: "Grupo eliminado!",
                error: "Fallo al eliminar grupo.",
            });
        } else {
            console.error('Invalid group id:', id);
        }
    }

    return (
        <div
            onClick={onClick}
            role="button"
            style={{paddingLeft: "12px"}}
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary",
                isGroup && "text-xs",
            )}
        >
            <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"/>
            <span className="truncate">{label}</span>

            {isSearched && (
                <kbd
                    className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Ctrl+K</span>
                </kbd>
            )}
            {isGroup && (
                <>
                    <kbd
                        className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border dark:border-muted-foreground/20 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 whitespace-nowrap">
                        <span className="text-xs">Rs: {isGroup} </span>
                    </kbd>

                    <div className="ml-auto flex items-center gap-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <div
                                    role="button"
                                    className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                                >
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-60"
                                align="start"
                                side="right"
                                forceMount
                            >
                                <DropdownMenuItem onClick={onDelete}>
                                    <Trash className="h-4 w-4 mr-2" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </>
            )}
        </div>
    );
};

Item.Skeleton = function ItemSkeleton({level}: { level?: number }) {
    return (
        <div
            style={{paddingLeft: level ? `${level * 12 + 25}px` : "12px"}}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4"/>
            <Skeleton className="h-4 w-[30%]"/>
        </div>
    );
};