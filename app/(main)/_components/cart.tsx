"use client";

import {cn} from "@/lib/utils";
import {
    ChevronsRight,
    SquareSlash,
    Code,
    SquareX
} from "lucide-react";
import {BsSlash} from "react-icons/bs";
import {useRouter} from "next/navigation";
import {ElementRef, useEffect, useRef, useState} from "react";
import {useMediaQuery} from "usehooks-ts";

import {Button} from "@/components/ui/button";
import {ConfirmModal} from "@/components/modals/confirm-modal";
import {groupSummaryRequest, groupCreateRequest} from "@/api/server-data";
import {useLoading} from "@/hooks/use-loading";
import {useAuthStore} from "@/store/auth";
import useStore from "@/store/groups";
import useCart from '@/store/repos';
import {AddDialog} from "./add-dialog"
import AddForm from "./add-form";
import {TooltipHint} from "@/components/tooltip-hint";
import { number } from "zod";
import { LoadingModal } from "@/components/modals/loading-modal";

export const Cart = () => {
    //CORREGIR LOS NOMBRES DE LAS FUNCIONES
    const user = useAuthStore((state) => state.profile);
    const cartItems = useCart(state => state.cart);
    const {store, addGroupToStore} = useStore(state => state);
    const emptyCart = useCart(state => state.emptyCart);

    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    const loading = useLoading();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        collapse();
    }, []);

    const recursiveFactorial = (n: number): number => {
        if (n === 0) {
            return 1;
        }
        return n * recursiveFactorial(n - 1);
    }

    const combinations = (n: number) => {
        // n over k combinations
        const k = 2;
        const nMinusK = n - k;
        const nFactorial = recursiveFactorial(n);
        const kFactorial = recursiveFactorial(k);
        const nMinusKFactorial = recursiveFactorial(nMinusK);
        const nChooseK = nFactorial / (kFactorial * nMinusKFactorial);

        // 6 seconds per request
        return nChooseK;
    }


    const handleRepos = async () => {
        
        const repos = cartItems.map(repo => ({
            owner: repo.owner.login,
            name: repo.name
        }));
        const combs = combinations(repos.length);
        
        setPercentage(0);
        setIsOpen(true);

        const username = user.username;

        const group = await groupCreateRequest(repos, username);
        const pId = setInterval(() => {
            if(percentage >= 99)
                clearInterval(pId);
            setPercentage(prev => prev + 1);
        }, 6 * combs * 10);

        const iId = setInterval(async () => {
            const summary = await groupSummaryRequest(group.data.sha);
            if (summary.data.comparissonsCompleted === combs) {
                clearInterval(pId);
                clearInterval(iId);

                addGroupToStore(summary.data);
                emptyCart();

                setIsOpen(false);
                setPercentage(100);
                collapse();
                
                router.push(`/groups/${group.data.sha}`);
            }
        }, 6000);

    }

    const resetWidth = () => {
        if (sidebarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    const collapse = () => {
        if (sidebarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    return (
        <>
            <LoadingModal isOpen={isOpen} percentage={percentage} />

            <AddDialog
                isOpen={isAddOpen}
                setIsOpen={setIsAddOpen}
                title="Agregar Repositorios"
                description="Puedes añadir los proyectos seleccionados a una comparación que hayas creado anteriormente."
            >
                <AddForm setIsOpen={setIsAddOpen} cartCollapse={collapse}/>
            </AddDialog>

            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}
            >
                <div
                    role="button"
                    onClick={collapse}
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 left-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsRight className="h-6 w-6"/>
                </div>
                <div>
                    <div className="flex justify-end">
                        <div className="text-sm font-medium px-3 py-3 gap-2 flex items-center">
                            <span>Repositorios</span>
                            <SquareSlash className="h-5 w-5"/>
                        </div>

                    </div>

                    <div className="flex justify-center items-center gap-2 px-4 pt-1 pb-4">
                        <ConfirmModal onConfirm={() => handleRepos()}>
                            <div className="flex justify-center w-full"
                                 style={{pointerEvents: cartItems.length <= 1 ? 'none' : 'auto'}}>
                                <TooltipHint text="Comparar" side="bottom" disabled={cartItems.length <= 1}>
                                    <Button disabled={cartItems.length <= 1} className="h-6 w-full">
                                        Comparar
                                    </Button>
                                </TooltipHint>
                            </div>
                        </ConfirmModal>

                        <div className="flex justify-center"
                             style={{pointerEvents: (cartItems.length <= 0 || store.length <= 0) ? 'none' : 'auto'}}>
                            <TooltipHint text="Añadir a comparación" side="bottom" disabled={cartItems.length <= 0 || store.length <= 0}>
                                <Button disabled={cartItems.length <= 0 || store.length <= 0} className="h-6 w-full"
                                        onClick={() => setIsAddOpen(true)}>
                                    +
                                </Button>
                            </TooltipHint>
                        </div>
                    </div>

                    <div className="border-b border-primary/10 mx-4 mb-4"></div>

                    {cartItems.length === 0 ? (
                        <div className="flex h-full justify-center">
                            <p className="text-muted-foreground text-sm whitespace-nowrap">
                                No hay repositorios
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-start">
                            {cartItems.map((item, index) => (
                                <div key={index}
                                     className="mx-3 gap-2 min-h-[27px] text-sm flex items-center text-muted-foreground font-medium">
                                    <Code className="shrink-0 h-[18px] w-[18px]"/>
                                    <span
                                        className="overflow-hidden whitespace-nowrap"> {item.owner.login + "/" + item.name} </span>
                                    <SquareX className="ml-auto shrink-0 h-[18px] w-[18px] items-end cursor-pointer"
                                             onClick={() => {
                                                 useCart.getState().removeItemFromCart({itemIndex: index});
                                             }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            {isCollapsed && (
                <TooltipHint text="Haga clic para abrir el carrito" side="left">
                    <div
                        className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 right-4 z-[99998] cursor-pointer"
                        onClick={resetWidth}
                    >
                        {cartItems.length > 0 && (
                            <div
                                className='absolute aspect-square pointer-events-none h-5 w-5 sm:h-5 grid place-items-center top-0 bg-red-400 text-white rounded-sm right-0 -translate-x-8 translate-y-0.5'>
                                <p className='text-xs sm:text-xs'>{cartItems.length}</p>
                            </div>
                        )}
                        <BsSlash className="h-6 w-6" style={{strokeWidth: '0.5px'}}/>
                    </div>
                </TooltipHint>
            )}
        </>
    );
};
