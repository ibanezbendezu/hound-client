"use client"

import {useEffect, useState} from "react";
import {useRouter, usePathname} from "next/navigation";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Spinner} from "@/components/spinner";
import {Badge} from "@/components/ui/badge";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {Bar, BarChart, CartesianGrid, XAxis, YAxis,} from "recharts"

import {
    groupDataRequestBySha,
    pairByIdDataRequest,
    pairSimilaritiesByGroupShaRequest
} from "@/api/server-data";
import {Box, CalendarClock, Folder, Eye, FileCode, ArrowRight, ArrowBigUp} from "lucide-react";
import {PiGraphLight} from "react-icons/pi";
import {formatDateTime, rgbToHex, colorScale} from "@/lib/utils";
import {processSimilarityData} from "../_components/utils";
import { PairDialog } from "./graph/_components/pair-dialog";

const chartConfig = {
    amount: {
        label: "Pares:",
        color: "#2c4863",
    },
} satisfies ChartConfig

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

    const [group, setGroup] = useState<Group | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [threshold, setThreshold] = useState(0.75);

    const [isPairOpen, setIsPairOpen] = useState(false);
    const [pair, setPair] = useState<any>(null);

    const router = useRouter();
    const pathname = usePathname()

    useEffect(() => {
        const fetchData = async () => {
            const res = await groupDataRequestBySha(params.id);
            const data = res.data;
            const matrix:number[][] = []
            for (let i = 0; i < data.repositories.length; i++) {
                matrix.push([]);
                for (let j = 0; j < data.repositories.length; j++) {
                    if (i !== j) {
                        const jId = data.repositories[j].id;
                        const links = data.repositories[i].children
                            .flatMap((p: any) => p.children
                                .flatMap((f: any) => f.links
                                    .filter((l: any) => l.pairFileRepository === jId)));
                        const similarity = links.filter((l: any) => l.similarity >= threshold).length / links.length;
                        console.log(data.repositories[i].name, data.repositories[j].name, links.length, similarity);
                        matrix[i][j] = similarity;
                    } else {
                        matrix[i][j] = 0;
                    }
                }
                const max = Math.max(...matrix[i]);
                const top = matrix[i].indexOf(max);

                if (top !== -1 && data.repositories[top]) {
                    const topRepository = data.repositories[top];
                    data.repositories[i].top = { repository: topRepository.name, similarity: max };
                } else {
                    console.error(`Top repository not found for index ${i}`);
                }
            }
            setGroup(data);

            const cRes = await pairSimilaritiesByGroupShaRequest(params.id);
            const cData = cRes.data;
            setChartData(processSimilarityData(cData));

            setLoading(false);
        };

        fetchData().then(r => r);
    }, [params.id]);

    const onSelect = (id: string) => {
        router.push(pathname + `/files/${id}`);
    };

    const handlePair = async (e: any) => {
        const res = await pairByIdDataRequest(e);
        const pair = res.data;

        setPair(pair);
        setIsPairOpen(true);
    }

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
                    {formatDateTime(group?.date)}
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
                                {group?.numberOfRepos}
                            </Badge>
                        </div>

                        <div className='flex justify-between items-center my-1 text-muted-foreground'>
                            <div className='font-normal text-sm'>
                                N.º de folders del grupo
                            </div>
                            <Badge variant="secondary">
                                {group?.numberOfFolders}
                            </Badge>
                        </div>

                        <div className='flex justify-between items-center my-1 text-muted-foreground'>
                            <div className='font-normal text-sm'>
                                N.º de archivos del grupo
                            </div>
                            <Badge variant="secondary">
                                {group?.numberOfFiles}
                            </Badge>
                        </div>

                        <div className='flex justify-between items-center my-1 text-muted-foreground'>
                            <div className='font-normal text-sm'>
                                Cantidad de lineas totales
                            </div>
                            <Badge variant="secondary">
                                {group?.totalLines}
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
                            <PiGraphLight className="h-20 w-20 opacity-50"></PiGraphLight>
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
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[150px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 4,
                                right: 4,
                            }}
                        >
                            <CartesianGrid vertical={false}/>
                            <XAxis
                                dataKey="percent"
                                type="number"
                                domain={[0, 100]}
                                tick={{fontSize: 11}}
                                tickMargin={4}
                                ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <YAxis
                                dataKey={"amount"}
                                type="number"
                                domain={[0, "dataMax + 1"]}
                                allowDecimals={false}
                                tick={{fontSize: 11}}
                                tickMargin={4}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey="amount"
                                        labelFormatter={(value) => `Similitud: ${value}%`}
                                    />
                                }
                            />
                            <Bar dataKey="amount" fill="var(--color-amount)" radius={4} barSize={8}/>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="mt-2 py-2 flex items-center gap-2">
                <p className="text-sm font-normal text-muted-foreground">
                    Resumen de los repositorios comparados.
                </p>
            </div>

            <div className="flex items-center gap-2 w-full">
                <Accordion type="multiple" className="w-full border-x-2 border-y-2 rounded">
                    {group?.repositories.map((repository, index) => (
                        <AccordionItem key={index} value={index.toString()}>
                            <AccordionTrigger className="p-2 border-b-2 bg-muted text-primary hover:bg-primary/5">
                                <div className="flex gap-2">
                                    <Box className="h-5 w-5 shrink-0 opacity-50"></Box>
                                    <p className="text-sm font-semibold">{repository.name}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="border-muted-foreground">
                                        <span className="text-xs">
                                            {"Top: "}
                                            {repository.top.repository}
                                            {" | "}
                                            {Math.round(repository.top.similarity * 100)}
                                            {"%"}
                                        </span>
                                    </Badge>
                                    <Badge variant="secondary" className="border-muted-foreground">
                                        <span className="text-xs">
                                            {"Nro. de folders: "}
                                            {repository.numberOfFolders}
                                        </span>
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Accordion type="multiple">
                                    {repository.children.map((folder: any, index: any) => (
                                        <AccordionItem key={index} value={index.toString()}>
                                            <AccordionTrigger className="p-2 hover:bg-primary/5">
                                                <div className="flex gap-2">
                                                    <Folder className="ml-2 h-5 w-5 shrink-0 opacity-50"></Folder>
                                                    <p className="text-sm font-semibold text-muted-foreground">{folder.name}</p>
                                                    <Badge variant="secondary">
                                                        <span className="text-xs">
                                                            {folder.folderType.charAt(0)}
                                                        </span>
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant="secondary">
                                                        <span className="text-xs">
                                                            {"Nro. de archivos: "}
                                                            {folder.numberOfFiles}
                                                        </span>
                                                    </Badge>
                                                    <Badge variant="color" className="pointer-events-none"
                                                           style={{backgroundColor: rgbToHex(colorScale(folder.fever * 100))}}>
                                                        <span className="text-xs">
                                                            {"promedio: "}
                                                            {(Math.round(folder.fever * 100))}
                                                            {"% | σ: "}
                                                            {folder.standardDeviation.toFixed(2)}
                                                        </span>
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {folder.children.map((file: any, index: any) => (
                                                    <div key={index}
                                                         className="p-2 flex items-center justify-between hover:bg-primary/5">
                                                        <div className="flex items-center gap-2">
                                                            <FileCode
                                                                className="ml-4 h-5 w-5 shrink-0 opacity-50"></FileCode>
                                                            <p className="text-xs font-semibold text-current">{file.name}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            
                                                            <Badge variant="secondary">
                                                                <span className="text-xs">
                                                                    {"Nro. lineas: "}
                                                                    {file.lines}
                                                                </span>
                                                            </Badge>
                                                            <Badge variant="color" className="pointer-events-none"
                                                                   style={{backgroundColor: rgbToHex(colorScale(file.fever * 100))}}>
                                                                <span className="text-xs">
                                                                    {"match clase: "}
                                                                    {Math.round(file.fever * 100)}
                                                                    {"%"}
                                                                </span>
                                                            </Badge>
                                                            <Badge variant="secondary"
                                                                className="hover:bg-primary/10 cursor-pointer"
                                                                onClick={() => handlePair(file.top.pairId)}>
                                                                <ArrowBigUp className="h-4 w-4 shrink-0"></ArrowBigUp>
                                                                <span className="text-xs">
                                                                    {"Top: "}
                                                                    {file.top.repositoryName}
                                                                    {" | "}
                                                                </span>
                                                                <b>
                                                                    {file.top.pairFilePath.split('/').pop()}
                                                                </b>
                                                                <span className="text-xs">
                                                                    {" | "}
                                                                    {Math.round(file.top.similarity * 100)}
                                                                    {"%"}
                                                                </span>
                                                            </Badge>
                                                            <Badge variant="secondary"
                                                                   className="hover:bg-primary/10 cursor-pointer"
                                                                   onClick={() => onSelect(file.sha)}>
                                                                {"ver"}
                                                                <Eye className="h-4 w-4 shrink-0"></Eye>
                                                            </Badge>
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
            </div>
            <PairDialog
                isOpen={isPairOpen}
                setIsOpen={setIsPairOpen}
                pair={pair}
            >
            </PairDialog>
        </div>
    );
};
