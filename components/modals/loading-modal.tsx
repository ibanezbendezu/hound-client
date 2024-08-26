"use client";

import {Dialog, DialogContent, DialogHeader} from "@/components/loading-dialog";
import {useLoading} from "@/hooks/use-loading";
import {Spinner} from "../spinner";
import Image from "next/image";

export const LoadingModal = () => {
    const loading = useLoading();

    return (
        <Dialog open={loading.isOpen}>
            <DialogContent>
                <DialogHeader className="b pb-3">
                    <div className="flex items-center justify-center">
                        <h2 className="text-lg font-medium">Comparando repositorios...</h2>
                        <Image
                            src="/u1f436-g-bw.svg"
                            height={40}
                            width={40}
                            alt="Logo"
                            className="dark:hidden"
                        />
                        <Image
                            src="/u1f436-g-bw.svg"
                            height={40}
                            width={40}
                            alt="Logo"
                            className="hidden dark:block filter invert"
                        />
                    </div>
                </DialogHeader>
                <div className="flex items-center justify-center">
                    <div className="flex flex-col gap-y-1">
                        <Spinner size="lg"/>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
