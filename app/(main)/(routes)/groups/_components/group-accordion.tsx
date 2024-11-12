"use client"

import {useEffect, useState} from "react";
import {useRouter, usePathname} from "next/navigation";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Badge} from "@/components/ui/badge";
import { TooltipHint } from "@/components/tooltip-hint";
import {rgbToHex, colorScale} from "@/lib/utils";
import {Box, Folder, Eye, FileCode, ArrowBigUp, Group} from "lucide-react";
import { groupReportRequest, pairByIdDataRequest } from "@/api/server-data";
import { PairDialog } from "../[id]/graph/_components/pair-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Group {
    id: string;
    date: any;
    numberOfRepos: number;
    numberOfFiles: number;
    totalLines: number;
    repositories: any[];
}

export const GroupAccordion = ({groupId, threshold} : {groupId: string, threshold: number}) => {
    //console.log("GroupAccordion", groupId, threshold);
    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState<Group | null>(null);
    const [pair, setPair] = useState<any | null>(null);
    const [isPairOpen, setIsPairOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname()

    useEffect(() => {
        const fetchData = async () => {
            const res = await groupReportRequest(groupId);
            const data = res.data;

            const matrix:number[][] = []
            for (let i = 0; i < data.repositories.length; i++) {
                matrix.push([]);
                for (let j = 0; j < data.repositories.length; j++) {
                    if (i !== j) {
                        const jId = data.repositories[j].id;
                        const pairs = data.repositories[i].classes
                            .flatMap((c: any) => c.files
                                .flatMap((f: any) => f.pairs
                                    .filter((p: any) => p.repositoryId === jId)));
                        const similarity = pairs.filter((p: any) => p.similarity >= threshold).length / pairs.length;
                        //console.log(data.repositories[i].name, data.repositories[j].name, pairs.length, similarity);
                        matrix[i][j] = similarity;
                    } else {
                        matrix[i][j] = 0;
                    }
                }
                const max = Math.max(...matrix[i]);
                const top = matrix[i].indexOf(max);

                if (top !== -1 && data.repositories[top]) {
                    const topRepository = data.repositories[top];
                    data.repositories[i].top = { repository: topRepository.owner+"/"+topRepository.name, similarity: max };
                } else {
                    data.repositories[i].top = { repository: "Ninguno", similarity: 0 };
                }
            }

            setGroup(data);
        }
        fetchData().then(r => r);
    } , [groupId, threshold]);

    const onSelect = (id: string) => {
        router.push(pathname + `/files/${id}`);
    };

    const handlePair = async (e: any) => {
        const res = await pairByIdDataRequest(e);
        const pair = res.data;

        setPair(pair);
        setIsPairOpen(true);
    }

    if (!group) {
        return <GroupAccordion.Skeleton/>
    }

    return(
        <>
        <Accordion type="multiple" className="w-full border-x-2 border-y-2 rounded">
            {group?.repositories.map((repository, index) => (
                <AccordionItem key={index} value={index.toString()}>
                    <AccordionTrigger className="p-2 border-b-2 bg-muted text-primary hover:bg-primary/10">
                        <TooltipHint text="Repositorio" side="bottom">
                            <div className="flex gap-2">
                                <Box className="h-5 w-5 shrink-0 opacity-50"></Box>
                                <p className="text-sm font-semibold">{repository.owner}/{repository.name}</p>
                            </div>
                        </TooltipHint>
                        <div className="flex gap-2">
                            <TooltipHint text="Repositorio más similar, basado en un umbral de similitud de 75%." side="bottom">
                                <div>
                                    <Badge variant="secondary" className="border-muted-foreground">
                                        <span className="text-xs">
                                            {"Top: "}{repository.top.repository}{" | "}{Math.round(repository.top.similarity * 100)}{"%"}
                                        </span>
                                    </Badge>
                                </div>
                            </TooltipHint>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Accordion type="multiple">
                            {repository.classes.map((c: any, index: any) => (
                                <AccordionItem key={index} value={index.toString()}>
                                    <AccordionTrigger className="p-2 hover:bg-primary/10">
                                        <TooltipHint text="Capa" side="bottom">
                                            <div className="flex gap-2">
                                                <Folder className="ml-2 h-5 w-5 shrink-0 opacity-50"></Folder>
                                                <Badge variant="secondary" className="font-normal">
                                                    <span className="text-xs">
                                                        {c.class.toLowerCase()}
                                                    </span>
                                                </Badge>
                                            </div>
                                        </TooltipHint>
                                        <div className="flex gap-2">
                                            <TooltipHint text="Cantidad de lineas en la capa." side="bottom">
                                                <div>
                                                    <Badge variant="secondary">
                                                        <span className="text-xs">
                                                            {"N.º de lineas totales: "}{c.classLines}
                                                        </span>
                                                    </Badge>
                                                </div>
                                            </TooltipHint>
                                            <TooltipHint text="Cantidad de archivos en la capa." side="bottom">
                                                <div>
                                                    <Badge variant="secondary">
                                                        <span className="text-xs">
                                                            {"N.º de archivos: "}{c.numberOfFiles}
                                                        </span>
                                                    </Badge>
                                                </div>
                                            </TooltipHint>
                                            <TooltipHint text="Promedio de similitud de los archivos de la capa y su desviación estándar." side="bottom">
                                                <div>
                                                    <Badge variant="color" className="pointer-events-none"
                                                        style={{backgroundColor: rgbToHex(colorScale(c.averageMatch * 100))}}>
                                                        <span className="text-xs">
                                                            {"Promedio: "}{(Math.round(c.averageMatch * 100))}{"% | σ: "}{c.standardDeviation.toFixed(2)}
                                                        </span>
                                                    </Badge>
                                                </div>
                                            </TooltipHint>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {c.files.map((file: any, index: any) => (
                                            <div key={index}
                                                className="p-2 flex items-center justify-between hover:bg-primary/5">
                                                <TooltipHint text="Archivo" side="bottom">
                                                    <div className="flex items-center gap-2">
                                                        <FileCode className="ml-4 h-5 w-5 shrink-0 opacity-50"></FileCode>
                                                        <p className="text-xs font-semibold text-current">
                                                            {truncateFilePath(file.filepath)}
                                                        </p>
                                                    </div>
                                                </TooltipHint>
                                                <div className="flex items-center gap-2">
                                                    <TooltipHint text="Cantidad de lineas en el archivo." side="bottom">
                                                        <div>
                                                            <Badge variant="secondary">
                                                                <span className="text-xs">
                                                                    {"Lineas: "}{file.lineCount}
                                                                </span>
                                                            </Badge>
                                                        </div>
                                                    </TooltipHint>
                                                    <TooltipHint text="Porcentaje de coincidencia con los archivos de su misma capa." side="bottom">
                                                        <div>
                                                            <Badge variant="color" className="pointer-events-none"
                                                                style={{backgroundColor: rgbToHex(colorScale(file.classMatch * 100))}}>
                                                                <span className="text-xs">
                                                                    {"Match capa: "}{Math.round(file.classMatch * 100)}{"%"}
                                                                </span>
                                                            </Badge>
                                                        </div>
                                                    </TooltipHint>
                                                    <TooltipHint text="Archivo más similar de su misma capa." side="bottom">
                                                        <div>
                                                            <Badge variant="secondary"
                                                                className="hover:bg-primary/10 cursor-pointer"
                                                                onClick={() => handlePair(file.top.id)}>
                                                                {/* <ArrowBigUp className="h-4 w-4 shrink-0"></ArrowBigUp> */}
                                                                {"Top: "}
                                                                <b>
                                                                    {file.top?.filepath.split("/").pop() + "/" + file.top?.repositoryName}
                                                                </b>
                                                                {" | "}{Math.round(file.top.similarity * 100)}{"%"}
                                                            </Badge>
                                                        </div>
                                                    </TooltipHint>
                                                    <TooltipHint text="Comparar lado a lado." side="bottom">
                                                        <div>
                                                            <Badge variant="secondary"
                                                                className="hover:bg-primary/10 cursor-pointer"
                                                                onClick={() => onSelect(file.sha)}>
                                                                {"ver"}
                                                                <Eye className="h-4 w-4 shrink-0"></Eye>
                                                            </Badge>
                                                        </div>
                                                    </TooltipHint>
                                                </div>
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
        <PairDialog
            isOpen={isPairOpen}
            setIsOpen={setIsPairOpen}
            pair={pair}
        >
        </PairDialog>
        </>
    );
}

GroupAccordion.Skeleton = function GroupAccordionSkeleton() {
    return (
        <Skeleton className="w-full border-x-2 border-y-2 rounded"/>
    );
}

function truncateFilePath(filepath: string): string {
    const parts = filepath.split('/');
    const truncatedParts = parts.slice(-3).join('/');
    return truncatedParts.length > 40 ? '...' + truncatedParts.slice(-40) : truncatedParts;
}