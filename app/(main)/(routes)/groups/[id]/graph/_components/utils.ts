import {scaleLinear} from 'd3-scale';

export function groupCytoscape(data: any) {
    interface NodeData {
        id: string;
        label: string;
        type: string;
        parent?: string;
        class?: string;
        sha?: string;
        width?: number;
        height?: number;
        fontSize?: number;
    }

    interface Node {
        data: NodeData;
    }

    interface EdgeData {
        id: string;
        source: string;
        target: string;
        sourceName: string;
        targetName: string;
        color: string;
        similarity: string;
        impact?: number;
        width?: number;
        label?: string;
    }

    interface Edge {
        data: EdgeData;
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const colorScale = scaleLinear<string>().domain([0, 100]).range(["#2E9335", "#B82318"]);

    data.repositories.forEach((repo: any) => {
        nodes.push({
            data: {
                id: `repo-${repo.sha}`,
                label: repo.name,
                type: 'repository',
            }
        });
    
        repo.children.forEach((folder: any) => {
            const folderId = `folder-${repo.id}-${folder.name}`;
            nodes.push({
                data: {
                    id: folderId,
                    label: folder.name,
                    parent: `repo-${repo.sha}`,
                    type: 'folder',
                    class: folder.folderType
                }
            });
    
            folder.children.forEach((file: any) => {
                const fileId = `file-${file.sha}`;

                const nameLength = file.name.length;

                const minFontSize = 5;
                const maxFontSize = 15;
                const minWidth = 60;
                const maxWidth = 200;
                const minHeight = 50;
                const maxHeight = 200;

                const width = Math.min(Math.max(minWidth, maxWidth * (file.lines / 100) + nameLength), maxWidth);
                const height = Math.min(Math.max(minHeight, maxHeight * (file.lines / 100)), maxHeight);
                const fontSize = Math.min(Math.max(minFontSize, maxFontSize * (file.lines / 100)), maxFontSize);

                nodes.push({
                    data: {
                        id: fileId,
                        label: file.name,
                        parent: folderId,
                        type: 'file',
                        class: file.fileType,
                        sha: file.sha,
                        width: width,
                        height: height,
                        fontSize: fontSize,
                    }
                });
    
                file.links.forEach((link: any) => {
                    const targetFileId = `file-${link.pairFileSha}`;
                    const targetExists = nodes.some((node) => node.data.id === targetFileId);
    
                    console.log(`Checking for target: ${targetFileId}, exists: ${targetExists}`);
    
                    if (targetExists) {
                        const exist = edges.some((edge) => edge.data.id === `edge-${link.pairId}`);
                        if (!exist) {
                            edges.push({
                                data: {
                                    id: `edge-${link.pairId}`,
                                    source: fileId,
                                    target: targetFileId,
                                    sourceName: file.name,
                                    targetName: link.pairFilePath.split('/').pop(),
                                    similarity: Math.round(link.similarity * 100) + '%',
                                    label: "S:" + Math.round(link.similarity * 100) + '% | I: '
                                    + Math.round(link.normalizedImpact * 100) + '%',
                                    color: colorScale(link.similarity * 100),
                                    impact: link.normalizedImpact,
                                    width: (Math.pow(link.normalizedImpact, 6) * 4) + 1.5,
                                },
                            });
                        }
                    } else {
                        console.warn(`Target file not found for link: ${link.pairId}`);
                    }
                });
            });
        });
    });

    return {nodes, edges};
}

export function fileCytoscape(data: any) {
    console.log("fileCytoscape", data);
    interface NodeData {
        id: string;
        label: string;
        type: string;
        parent?: string;
        class?: string;

        sha?: string;
        width?: number;
        height?: number;
        fontSize?: number;
    }

    interface Node {
        data: NodeData;
    }

    interface EdgeData {
        id: string;
        source: string;
        target: string;
        sourceName: string;
        targetName: string;
        color: string;
        similarity: string;
        impact?: number;
        width?: number;

        label?: string;
    }

    interface Edge {
        data: EdgeData;
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const colorScale = scaleLinear<string>().domain([0, 100]).range(["#2E9335", "#B82318"]);

    const sourceId = `file-${data.file.id}`;
    const sourceName = data.file.filepath.split('/').pop();
    nodes.push({
        data: {
            id: sourceId,
            label: sourceName,
            type: 'file',
            class: 'source'
        }
    });

    data.repositories.forEach((repo: any) => {
        const repoId = `repo-${repo.id}`;
        nodes.push({
            data: {
                id: repoId,
                label: repo.name,
                type: 'repository',
            }
        });

        repo.pairs.forEach((pair: any) => {
            const pairId = pair.id;
            const fileId = `file-${pair.file.id}`;
            const fileName = pair.file.filepath.split('/').pop();

            const nameLength = fileName.length;
            const minFontSize = 5;
            const maxFontSize = 15;
            const minWidth = 60;
            const maxWidth = 200;
            const minHeight = 50;
            const maxHeight = 200;

            const width = Math.min(Math.max(minWidth, maxWidth * (pair.file.lines / 100) + nameLength), maxWidth);
            const height = Math.min(Math.max(minHeight, maxHeight * (pair.file.lines / 100)), maxHeight);
            const fontSize = Math.min(Math.max(minFontSize, maxFontSize * (pair.file.lines / 100)), maxFontSize);
            
            nodes.push({
                data: {
                    id: fileId,
                    label: fileName,
                    parent: repoId,
                    type: 'file',
                    class: pair.file.type,

                    sha: pair.file.sha,
                    width: width,
                    height: height,
                    fontSize: fontSize
                }
            });

            const similarity = pair.similarity * 100;
            edges.push({
                data: {
                    id: `edge-${pairId}`,
                    source: sourceId,
                    target: fileId,

                    sourceName: sourceName,
                    targetName: fileName,
                    similarity: Math.round(similarity) + '%',
                    label: "S:" + Math.round(similarity) + '% | I: ' + Math.round(pair.normalizedImpact * 100) + '%',
                    color: colorScale(similarity),
                    impact: pair.normalizedImpact,
                    width: (Math.pow(pair.normalizedImpact, 6) * 4) + 1.5, 
                },
            });

        });
    });

    return {nodes, edges};
}