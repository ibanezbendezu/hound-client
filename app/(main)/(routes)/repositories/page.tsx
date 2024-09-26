"use client";

import {useEffect, useState} from "react";
import {Spinner} from "@/components/spinner";
import { DataTable } from "./_components/data-table";
import { ReposForm } from "./_components/repos-form";
import Repos from "../users/_components/repos";

export default function RepositoriesPage({params}: { params: any }) {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <div className="m-10">
            <div className="py-4 flex">
                <h2 className="text-4xl font-bold font-mono">
                    <kbd> {"Añade tu lista de repositorios"} </kbd>
                </h2>
            </div>
            <div className="flex gap-10 flex-col md:flex-row justify-center items-start">
                <div className="md:w-1/3 w-full px-1 pt-1 md:px-0">
                        <ReposForm setRepos={setRepos} setLoading={setLoading}/>
                </div>
                <div className="md:w-2/3 w-full px-1 pt-2 md:px-0">
                    {repos.length === 0 && !loading ? (
                        <div className="flex items-center justify-center h-32">
                            Acá se mostrarán los repositorios que añadas.
                        </div>
                    ) : (
                        loading ? (
                            <div className="flex items-center justify-center h-32 md:w-full w-full">
                                <Spinner size="lg"/>
                            </div>
                        ) : (
                        <Repos repos={repos}/>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};