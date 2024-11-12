"use client"

import {useEffect, useState} from "react";
import {useRouter, usePathname} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Spinner} from "@/components/spinner";
import {Badge} from "@/components/ui/badge";

import {
    groupOverallRequest,
} from "@/api/server-data";
import {Box, CalendarClock, ArrowRight, ArrowBigUp} from "lucide-react";
import {PiGraph} from "react-icons/pi";
import {formatDateTime} from "@/lib/utils";
import { TooltipHint } from "@/components/tooltip-hint";
import { GroupChart } from "../_components/group-chart";
import { GroupInfoPopover } from "../_components/group-info-popover";
import { GroupAccordion } from "../_components/group-accordion";
import useThreshold from "@/store/threshold";

interface Group {
    id: string;
    date: any;
    numberOfRepos: number;
    numberOfFolders: number;
    numberOfFiles: number;
    totalLines: number;
    repositories: any[];
}

export default function GroupPage({params}: { params: any }) {
    const [overallData, setOverallData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const {value} = useThreshold();
    console.log(value);

    const router = useRouter();
    const pathname = usePathname()

    useEffect(() => {
        const fetchData = async () => {
            const oRes = await groupOverallRequest(params.id);
            const oData = oRes.data;
            setOverallData(oData);

            setLoading(false);
        };

        fetchData().then(r => r);
    }, [params.id]);

    const onGraph = () => {
        router.push(pathname + `/graph`);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    return (
        <div className="m-10 grid grid-flow-row gap-2">
            <div className="py-4 flex items-baseline justify-between">
                <h2 className="text-4xl font-bold font-mono">
                    <kbd> {"Resultados de comparación"} </kbd>
                </h2>
                <Badge variant="secondary">
                    <CalendarClock className="h-4 w-4 shrink-0"></CalendarClock>
                    {formatDateTime(overallData?.date)}
                </Badge>
            </div>

            <div className="py-2 flex items-center">
                <p className="text-sm font-normal text-muted-foreground">
                    A continuación presentamos los datos recopilados del grupo.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Datalles del grupo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='flex justify-between items-center my-1 text-muted-foreground'>
                            <div className='font-normal text-sm'>
                                N.º de repositorios comparados
                            </div>
                            <Badge variant="secondary">
                                {overallData?.numberOfRepos}
                            </Badge>
                        </div>

                        <div className='flex justify-between items-center my-1 text-muted-foreground'>
                            <div className='font-normal text-sm'>
                                N.º de archivos del grupo
                            </div>
                            <Badge variant="secondary">
                                {overallData?.numberOfFiles}
                            </Badge>
                        </div>

                        <div className='flex justify-between items-center my-1 text-muted-foreground'>
                            <div className='font-normal text-sm'>
                                N.º de lineas totales
                            </div>
                            <Badge variant="secondary">
                                {overallData?.groupLines}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:bg-primary/5 cursor-pointer" onClick={() => onGraph()}>
                    <CardHeader>
                        <CardTitle>Vista de grafo</CardTitle>
                        <CardDescription>Explora las comparaciones entre proyectos de manera visual.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between">
                            <PiGraph className="h-14 w-14 opacity-50"></PiGraph>
                            <div className="flex flex-col justify-end">
                                <ArrowRight className="h-6 w-6 opacity-50"></ArrowRight>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Distribución de similitud</CardTitle>
                    <CardDescription>
                        El gráfico muestra los grados de similitud que podrían resultar interesantes para el análisis.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <GroupChart groupId={params.id}/>
                </CardContent>
            </Card>

            <div className="mt-2 py-2 flex items-center gap-2 justify-between">
                <p className="text-sm font-normal text-muted-foreground">
                    Resumen de los repositorios comparados.
                </p>
                <GroupInfoPopover threshold={0.75}/>
            </div>
            
            <div className="flex items-center gap-2 w-full">
                <GroupAccordion groupId={params.id} threshold={0.75}/>
            </div>
        </div>
    );
};
