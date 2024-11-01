import * as React from 'react';
import { useEffect, useState } from 'react';
import { fileContentRequest } from '@/api/server-data';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '../../../../../../../components/ui/badge';
import { Label } from '../../../../../../../components/ui/label';
import { Progress } from '../../../../../../../components/ui/progress';
import { CodeViewer } from '../../../../../../../components/code-viewer';
import { Spinner } from '../../../../../../../components/spinner';
import { GitCompareArrows } from 'lucide-react';

interface PairDialogProps {
    children?: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    pair?: any;
}

export function PairDialog({ isOpen, setIsOpen, pair }: PairDialogProps) {
    const [file1Content, setFile1Content] = useState<any>(null);
    const [file2Content, setFile2Content] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Solo ejecutar si el diálogo está abierto y pair está definido
        if (!isOpen || !pair?.file1?.id || !pair?.file2?.id) return;

        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            setFile1Content(null);
            setFile2Content(null);
            try {
                const [file1Response, file2Response] = await Promise.all([
                    fileContentRequest(pair.file1.id),
                    fileContentRequest(pair.file2.id)
                ]);

                if (isMounted) {
                    setFile1Content(file1Response.data);
                    setFile2Content(file2Response.data);
                }
            } catch (error) {
                console.error('Error fetching file content:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [isOpen, pair?.file1?.id, pair?.file2?.id]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-7xl">
                <DialogHeader className="border-b pb-3 items-center">
                    {pair &&
                        <React.Fragment>
                            <DialogTitle>
                                {pair.file1?.filepath.split("/").pop()}
                                <GitCompareArrows size={20} className="inline-block mx-2" />
                                {pair.file2?.filepath.split("/").pop()}
                            </DialogTitle>

                            <DialogDescription>
                                Comparación del código fuente de los archivos seleccionados.
                            </DialogDescription>
                        </React.Fragment>
                    }
                </DialogHeader>
                <div className="grid gap-6">
                    {pair &&
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Similitud</Label>
                                <Label>{Math.round(pair.similarity * 100)}%</Label>
                            </div>
                            {pair.similarity && (
                                <Progress value={pair.similarity * 100} />
                            )}
                        </div>
                    }
                    {file1Content && file2Content ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center gap-2">
                                    <p className="font-mono text-xs max-w-md truncate">{pair.file1?.filepath}</p>
                                    <Badge variant='secondary' className='max-w-xs truncate'>
                                        {pair.file1.repository.name}
                                    </Badge>
                                </div>
                                {loading ? (
                                    <div className="h-48 flex items-center justify-center">
                                        <Spinner size="lg" />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <CodeViewer
                                            code={file1Content}
                                            language={pair.file1?.language}
                                            highlightRange={pair.file1?.fragments}
                                            color={"#4d4d4d"}
                                            shouldScrollY={true}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center gap-2">
                                    <p className="font-mono text-xs max-w-md truncate">{pair.file2?.filepath}</p>
                                    <Badge variant='secondary' className='max-w-xs truncate'>
                                        {pair.file2.repository.name}
                                    </Badge>
                                </div>
                                {loading ? (
                                    <div className="h-48 flex items-center justify-center">
                                        <Spinner size="lg" />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <CodeViewer
                                            code={file2Content}
                                            language={pair.file2?.language}
                                            highlightRange={pair.file2?.fragments}
                                            color={"#4d4d4d"}
                                            shouldScrollY={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center">
                            <Spinner size="lg" />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
