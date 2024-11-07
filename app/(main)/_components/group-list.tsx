"use client";

import {useParams, useRouter} from "next/navigation";
import {Item} from "./item";
import {formatDateTime} from "@/lib/utils";
import {Boxes} from "lucide-react";
import useStore from "@/store/groups";
import {groupReportRequest, groupsByUsernameRequest} from "@/api/server-data";
import {useAuthStore} from "@/store/auth";
import {useEffect, useState} from "react";

export const GroupList = () => {
    const params = useParams();
    const router = useRouter();
    const user = useAuthStore((state) => state.profile);
    const [groups, setGroups] = useState<any[]>([]);

    //const groups = useStore((state) => state.store);

    useEffect(() => {
        const fetchData = async () => {
            const groups = await groupsByUsernameRequest(user.username);
            useStore.setState({store: groups.data});
            const sortedGroups = groups.data.sort((b:any, a:any) => new Date(b.groupDate).getTime() - new Date(a.groupDate).getTime());
            setGroups(sortedGroups);
        }
        fetchData();
    }, [groups]);

    const onRedirect = (groupId: string) => {
        router.push(`/groups/${groupId}`);
    };

    if (groups === undefined) {
        return (
            <Item.Skeleton/>
        );
    }

    return (
        <>
            {groups.map((group) => (
                <div key={group.id}>
                    <Item
                        id={group.sha}
                        onClick={() => onRedirect(group.sha)}
                        isGroup={group.numberOfRepos}
                        label={formatDateTime(group.groupDate)}
                        icon={Boxes}
                        active={params.id == group.sha}
                    />
                </div>
            ))}
        </>
    );
};