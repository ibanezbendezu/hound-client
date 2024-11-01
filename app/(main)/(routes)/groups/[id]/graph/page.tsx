"use client"

import {Spinner} from "@/components/spinner";
import {useEffect, useState} from "react";
import {Group} from "./_components/group";
import {groupDataRequestBySha, groupGraphRequest} from "@/api/server-data";
import {groupCytoscape} from "./_components/utils";
import { GroupB } from "./_components/groupB";
//import { groupCytoscape } from './_components/utilsB';

export default function GraphPage({params}: { params: any }) {

    const [data, setData] = useState<{ data: any }[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await groupDataRequestBySha(params.id);

            const cytoscapeFormat = groupCytoscape(res.data)
            const elements = [
                ...cytoscapeFormat.nodes.map(node => ({data: node.data})),
                ...cytoscapeFormat.edges.map(edge => ({data: edge.data}))
            ];
            setData(elements);
            setLoading(false);
        };

        fetchData().then(r => r);
    }, [params.id]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            {data && <Group data={data} groupId={params.id}/>}
        </div>
    );
};