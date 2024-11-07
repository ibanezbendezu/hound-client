import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {Info} from "lucide-react";

export const GroupInfoPopover = ({threshold} : {threshold: number}) => {
    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary" className="text-xs" size="sm">
                    <Info className="h-5 w-5 shrink-0"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-[500px]">
                <div className="p-2">
                    <p className="text-sm font-semibold pb-1 underline">
                        {"Repositorios"}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground">
                            Top
                        </span>
                        {" Repositorio más similar, basado en un umbral de similitud de " + (threshold * 100) + "%."}
                    </p>
                </div>
                <div className="p-2">
                    <p className="text-sm font-semibold pb-1 underline">
                        {"Capas"}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground">
                            Nro. de archivos:
                        </span>
                        {" Cantidad de archivos en la capa."}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground">
                            Promedio:
                        </span>
                        {" Promedio de similitud de los archivos de la capa."}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground">
                            σ:
                        </span>
                        {" Desviación estándar del promedio de similitud de los archivos de la capa."}
                    </p>
                </div>
                <div className="p-2">
                    <p className="text-sm font-semibold pb-1 underline">
                        {"Archivos"}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground">
                            Nro. lineas:
                        </span>
                        {" Cantidad de lineas en el archivo."}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground">
                            Match capa:
                        </span>
                        {" Porcentaje de coincidencia con los archivos de su misma capa."}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                        <span className="text-sm font-semibold text-muted-foreground">
                            Top:
                        </span>
                        {" Archivo más similar de su misma capa."}
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    );
}
