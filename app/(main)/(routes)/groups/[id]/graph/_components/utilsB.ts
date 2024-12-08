import {scaleLinear} from 'd3-scale';

export function groupCytoscape(data: any, theme: string) {
    interface NodeData {
        id: string;
        label: string;
        type: string;
        parent?: string;
        layer?: string;
        sha?: string;
        width?: number;
        height?: number;
        fontSize?: number;
        bgColor?: string;
        show?: boolean;
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
        similarity: number;
        impact?: number;
        width?: number;
        label?: string;
        longest?: number;
        totalOverlap?: number;
        sourceRepo?: string;
        targetRepo?: string;
    }

    interface Edge {
        data: EdgeData;
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const colorScale = theme === 'dark' || theme === 'system' ? scaleLinear<string>().domain([0, 100]).range(["#2E9335", "#B82318"]) : scaleLinear<string>().domain([0, 100]).range(["#62bc4e", "#cd4843"]);
    const maxRepoFontSize = 35;
    const minRepoFontSize = 27;
    const layerFontSize = 20;

    const minFontSize = 5;
    const maxFontSize = 15;
    const minWidth = 60;
    const maxWidth = 200;
    const minHeight = 50;
    const maxHeight = 200;

    const largestRepo = data.repositories.reduce((acc: number, repo: any) => Math.max(acc, repo.layers.reduce((acc: number, layer: any) => acc + layer.files.length, 0)), 0);

    data.repositories.forEach((repo: any) => {
        const repoId = `repo-${repo.sha}`;
        nodes.push({
            data: {
                id: repoId,
                label: repo.owner + "/" + repo.name,
                type: 'repository',
                fontSize: Math.min(Math.max(minRepoFontSize, maxRepoFontSize * (repo.layers.reduce((acc: number, layer: any) => acc + layer.files.length, 0) / largestRepo)), maxRepoFontSize),
                sha: repo.sha,
                show: true
            }
        });
    
        repo.layers.forEach((layer: any) => {
            const layerId = `layer-${repo.sha}-${layer.name}`;
            nodes.push({
                data: {
                    id: layerId,
                    label: layer.name,
                    parent: repoId,
                    type: 'layer',
                    layer: layer.layer,
                    fontSize: layerFontSize,
                    show: true
                }
            });
    
            layer.files.forEach((file: any) => {
                const fileId = `file-${file.sha}`;
                const fileName = file.filepath.split('/').pop();

                const nameLength = fileName.length;

                const width = Math.min(Math.max(minWidth, maxWidth * (file.lineCount / 100) + nameLength), maxWidth);
                const height = Math.min(Math.max(minHeight, maxHeight * (file.lineCount / 100)), maxHeight);
                const fontSize = Math.min(Math.max(minFontSize, maxFontSize * (file.lineCount / 100)), maxFontSize);

                nodes.push({
                    data: {
                        id: fileId,
                        label: fileName,
                        parent: layerId,
                        type: 'file',
                        layer: file.layer,
                        sha: file.sha,

                        width: width,
                        height: height,
                        fontSize: fontSize,
                        bgColor: "",
                        show: true
                    }
                });
    
                file.pairs.forEach((pair: any) => {
                    const targetFileId = `file-${pair.sha}`;
                    const targetExists = nodes.some((node) => node.data.id === targetFileId);
    
                    console.log(`Checking for target: ${targetFileId}, exists: ${targetExists}`);
    
                    if (targetExists) {
                        const exist = edges.some((edge) => edge.data.id === `edge-${pair.id}`);
                        if (!exist) {
                            edges.push({
                                data: {
                                    id: `edge-${pair.id}`,
                                    source: fileId,
                                    target: targetFileId,
                                    sourceName: file.filepath.split('/').pop(),
                                    targetName: pair.filepath.split('/').pop(),
                                    similarity: pair.similarity,
                                    label: "S:" + Math.round(pair.similarity * 100) + '% | I: ' + Math.round(pair.normalizedImpact * 100) + '%',
                                    color: colorScale(pair.similarity * 100),
                                    impact: pair.normalizedImpact,
                                    totalOverlap: pair.totalOverlap,
                                    longest: pair.longestFragment,
                                    width: (Math.pow(pair.normalizedImpact, 6) * 4) + 1.7,

                                    sourceRepo: repo.name,
                                    targetRepo: pair.repositoryName,
                                },
                            });
                        }
                    } else {
                        console.warn(`Target file not found for link: ${pair.id}`);
                    }
                });
            });
        });
    });

    return {nodes, edges};
}

export function fileCytoscape(data: any, theme: string) {
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
        bgColor?: string;
        show?: boolean;
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
        similarity: number;
        impact?: number;
        width?: number;

        label?: string;
        longest?: number;
        totalOverlap?: number;
    }

    interface Edge {
        data: EdgeData;
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const colorScale = theme === 'dark' || theme === 'system' ? scaleLinear<string>().domain([0, 100]).range(["#2E9335", "#B82318"]) : scaleLinear<string>().domain([0, 100]).range(["#62bc4e", "#cd4843"]);

    const maxRepoFontSize = 35;
    const minRepoFontSize = 27;

    const file = data.file;
    const sourceId = `file-${data.file.id}`;
    const sourceName = data.file.filepath.split('/').pop();

    const sourceNameLength = sourceName.length;
    const minFontSize = 5;
    const maxFontSize = 17;
    const minWidth = 60;
    const maxWidth = 200;
    const minHeight = 50;
    const maxHeight = 200;

    const width = Math.min(Math.max(minWidth, maxWidth * (file.lineCount / 100) + sourceNameLength), maxWidth);
    const height = Math.min(Math.max(minHeight, maxHeight * (file.lineCount / 100)), maxHeight);
    const fontSize = Math.min(Math.max(minFontSize, maxFontSize * (file.lineCount / 100)), maxFontSize);

    const largestRepo = data.repositories.reduce((acc: number, repo: any) => Math.max(acc, repo.pairs.length), 0);

    nodes.push({
        data: {
            id: sourceId,
            label: sourceName,
            type: 'file',
            class: 'source',
            sha: file.sha,
            width: width,
            height: height,
            fontSize: fontSize,
            bgColor: "",
            show: true
        }
    });

    data.repositories.forEach((repo: any) => {
        const repoId = `repo-${repo.id}`;
        nodes.push({
            data: {
                id: repoId,
                label: repo.name,
                type: 'repository',
                fontSize: Math.min(Math.max(minRepoFontSize, maxRepoFontSize * (repo.pairs.length / largestRepo)), maxRepoFontSize),
                sha: repo.sha,
                show: true
            }
        });

        repo.pairs.forEach((pair: any) => {
            const pairId = pair.id;
            const fileId = `file-${pair.file.id}`;
            const fileName = pair.file.filepath.split('/').pop();

            const nameLength = fileName.length;
            const width = Math.min(Math.max(minWidth, maxWidth * (pair.file.lineCount / 100) + nameLength), maxWidth);
            const height = Math.min(Math.max(minHeight, maxHeight * (pair.file.lineCount / 100)), maxHeight);
            const fontSize = Math.min(Math.max(minFontSize, maxFontSize * (pair.file.lineCount / 100)), maxFontSize);

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
                    fontSize: fontSize,
                    bgColor: "",
                    show: true
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
                    similarity: similarity,
                    label: "S:" + Math.round(similarity) + '% | I: ' + Math.round(pair.normalizedImpact * 100) + '%',
                    color: colorScale(similarity),
                    impact: pair.normalizedImpact,
                    totalOverlap: pair.totalOverlap,
                    longest: pair.longestFragment,
                    width: (Math.pow(pair.normalizedImpact, 6) * 4) + 1.5,
                },
            });

        });
    });

    return {nodes, edges};
}