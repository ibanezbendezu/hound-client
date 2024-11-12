import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import { groupOverallRequest, pairSimilaritiesByGroupShaRequest } from "@/api/server-data";
import { processSimilarityData } from "./utils";
import useThreshold from "@/store/threshold"; // Importa el hook para obtener el valor del umbral
import { useTheme } from "next-themes"; // Importa el hook para obtener el tema

const chartConfig = {
    amount: {
        label: "Pares:",
        color: "#2c4863",
    },
} satisfies ChartConfig

export const GroupChart = ({ groupId }: { groupId: string }) => {
    interface ChartData {
        percent: string;
        amount: number;
    }

    const [chartData, setChartData] = useState<ChartData[]>([]);
    const { value } = useThreshold(); // Obtén el valor del umbral
    const { theme } = useTheme(); // Obtén el tema actual

    useEffect(() => {
        const fetchData = async () => {
            const res = await pairSimilaritiesByGroupShaRequest(groupId);
            const data = res.data;
            setChartData(processSimilarityData(data));
        }
        fetchData().then(r => r);
    }, [groupId]);

    // Determina el color de la línea basado en el tema
    const lineColor = theme === "dark" || theme === "system" ? "white" : "black";

    return (
        <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[140px] w-full"
        >
            <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 4,
                    right: 4,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="percent"
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickMargin={4}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                    dataKey={"amount"}
                    type="number"
                    domain={[0, "dataMax + 1"]}
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
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
                <ReferenceLine x={value * 100} stroke={lineColor} strokeDasharray="3 3" />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={4} barSize={8} />
            </BarChart>
        </ChartContainer>
    );
}