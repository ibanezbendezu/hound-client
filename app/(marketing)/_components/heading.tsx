"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const Heading = () => {

    return (
        <div className="max-w-3xl space-y-4 text-left m-5">
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold mb-3">
                Tu aliado en la detección de similitudes entre códigos fuente, {" "}
                <span className="underline text-muted-foreground inline-flex items-center">
                    Hound.
                    <Image
                        src="/u1f415.svg"
                        height={50}
                        width={50}
                        alt="Logo"
                        className="inline-block"
                    />
                </span>
            </h1>
            <h3 className="text-left text-base sm:text-lg md:text-xl lg:text-base xl:text-xl font-medium mr-20">
                Compara fácilmente tus proyectos Spring Boot monolíticos almacenados en GitHub.
            </h3>
            <div className="pt-4">
                <Button variant="normal" size="sm" asChild>
                    <Link href="/login">
                        Inicia Sesión
                    </Link>
                </Button>
            </div>
        </div>
    );
};
