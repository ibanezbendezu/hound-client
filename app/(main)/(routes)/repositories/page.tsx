"use client";

import {useEffect, useState} from "react";
import {Spinner} from "@/components/spinner";
import { DataTable } from "./_components/data-table";
import { ReposForm } from "./_components/repos-form";
import Repos from "../users/_components/repos";

export default function RepositoriesPage({params}: { params: any }) {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <div className="m-10">
            <div className="py-4 flex">
                <h2 className="text-4xl font-bold font-mono">
                    <kbd> {"Añade tu lista de repositorios"} </kbd>
                </h2>
            </div>
            <div className="flex gap-6 flex-col md:flex-row justify-center items-start">
                <div className="md:w-1/3 w-full px-1 pt-2 md:px-0">
                        <ReposForm setRepos={setRepos}/>
                </div>
                <div className="border-l border-black h-full"></div>
                <div className="md:w-2/3 w-full px-1 pt-2 md:px-0">
                    <Repos repos={repos}/>
                </div>
            </div>
        </div>
    );
};