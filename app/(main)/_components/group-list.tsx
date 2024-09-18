"use client";

import {useParams, useRouter} from "next/navigation";
import {Item} from "./item";
import {formatDateTime} from "@/lib/utils";
import {Boxes} from "lucide-react";
import useStore from "@/store/groups";

export const GroupList = () => {
    const params = useParams();
    const router = useRouter();

    const groups = useStore((state) => state.store);

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
                        onClick={() => onRedirect(group.sha)}
                        isGroup={group.numberOfRepos}
                        label={formatDateTime(group.date)}
                        icon={Boxes}
                        active={params.id == group.sha}
                    />
                </div>
            ))}
        </>
    );
};