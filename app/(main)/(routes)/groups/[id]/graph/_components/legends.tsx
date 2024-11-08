"use client"

import {Badge} from "@/components/ui/badge"
import {useTheme} from "next-themes";

export const Legend = () => {

    const {theme} = useTheme();

    return (
        <div className='flex justify-center items-end absolute bottom-0 p-3 gap-2 left-0 right-0'>
            <Badge variant='secondary'>
                <div className='w-3 h-3 bg-[#5b7792] dark:bg-[#293540] rounded-sm'></div>
                <span>Servicios</span>
            </Badge>
            <Badge variant='secondary'>
                <div className='w-3 h-3 bg-[#7b8b9a] dark:bg-[#384047] rounded-sm'></div>
                <span>Controladores</span>
            </Badge>
            <Badge variant='secondary'>
                <div className='w-3 h-3 bg-[#85857e] dark:bg-[#41413e] rounded-sm'></div>
                <span>Repositorios</span>
            </Badge>
        </div>
    )
}