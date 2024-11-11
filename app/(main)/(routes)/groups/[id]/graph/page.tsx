"use client"

import {Spinner} from "@/components/spinner";
import {useEffect, useState} from "react";
import {Group} from "./_components/group";
import {groupDataRequestBySha, groupGraphRequest} from "@/api/server-data";
//import {groupCytoscape} from "./_components/utils";
import { GroupB } from "./_components/groupB";
import { groupCytoscape } from './_components/utilsB';
import {useTheme} from "next-themes";

export default function GraphPage({params}: { params: any }) {
    const {theme} = useTheme() as { theme: string };
    const [data, setData] = useState<{ data: any }[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await groupGraphRequest(params.id);

            const cytoscapeFormat = groupCytoscape(res.data, theme || '');
            const elements = [
                ...cytoscapeFormat.nodes.map(node => ({data: node.data})),
                ...cytoscapeFormat.edges.map(edge => ({data: edge.data}))
            ];
            console.log(elements);
            setData(elements);
            setLoading(false);
        };

        fetchData().then(r => r);
    }, [params.id, theme]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            {data && <GroupB data={data} groupId={params.id}/>}
        </div>
    );
};