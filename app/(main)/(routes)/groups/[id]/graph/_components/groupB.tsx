"use client"

import React, {useState, useEffect} from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import dagre from "cytoscape-dagre";
import fcose from "cytoscape-fcose";
import cola from 'cytoscape-cola';
import undoRedo from "cytoscape-undo-redo";
import expandCollapse from 'cytoscape-expand-collapse';
import popper from 'cytoscape-popper';
import navigator from "cytoscape-navigator";
import {graphStyles2, graphStylesLight} from './styleB';
import "cytoscape-navigator/cytoscape.js-navigator.css";
import "./style.css";

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import {FileDialog} from '@/app/(main)/(routes)/groups/[id]/graph/_components/file-dialog';
import {PairDialog} from '@/app/(main)/(routes)/groups/[id]/graph/_components/pair-dialog';

import {pairsByGroupShaDataRequest, pairByIdDataRequest} from '@/api/server-data';
import {fileCytoscape} from './utilsB';
import {Legend} from './legends';

import {useTheme} from "next-themes";
import useThreshold from "@/store/threshold";

//expandCollapse(cytoscape, jquery);
cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(undoRedo);
cytoscape.use(expandCollapse);
cytoscape.use(popper);
cytoscape.use(navigator);
cytoscape.use(popper);

type GroupProps = {
    data: any;
    groupId: any;
    threshold: number;
};

export const GroupB: React.FC<GroupProps> = ({data, groupId, threshold}) => {
    const [cy, setCy] = useState<any>(null);
    const [layoutName, setLayoutName] = useState("cola");

    const [isFileOpen, setIsFileOpen] = useState(false);
    const [isPairOpen, setIsPairOpen] = useState(false);
    const [file, setFile] = useState<any>(null);
    const [pair, setPair] = useState<any>(null);
    const [graphData, setGraphData] = useState<any>(null);

    const {theme} = useTheme();
    const {value} = useThreshold();

    const handlePair = async (e: any) => {
        const pairId = parseInt(e.id.split("-")[1], 10);
        const res = await pairByIdDataRequest(pairId);
        const pair = res.data;

        setPair(pair);
        setIsPairOpen(true);
    }

    const handleFile = async (e: any) => {
        const fileSha = e.sha;
        const res = await pairsByGroupShaDataRequest(groupId, fileSha);
        const fileData = res.data.file;

        const cytoscapeFormat = fileCytoscape(res.data, theme || '');
        const elements = [
            ...cytoscapeFormat.nodes.map(node => ({data: node.data})),
            ...cytoscapeFormat.edges.map(edge => ({data: edge.data}))
        ];

        setFile(fileData);
        setGraphData(elements);
        setIsFileOpen(true);
    }

    const config = {
        layout: {
            name: layoutName,
            animate: false,
            randomize: true,
            avoidOverlap: true,
            centerGraph: true,
            padding: 50,
            edgeSymDiffLength: 20,
            edgeJaccardLength: 20,

            },
        zoom: 0.35,
    };


    useEffect(() => {
        if (cy) {
            cy.zoom(config.zoom);
            cy.expandCollapse({
                layoutBy: config.layout,
                collapseCueImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><path d="m6 15 6-6 6 6"/></svg>',
                expandCueImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>',
            });

            /* const defaults = {
                container: false, viewLiveFramerate: 0, thumbnailEventFramerate: 30, thumbnailLiveFramerate: false,
                dblClickDelay: 200, removeCustomContainer: false, rerenderDelay: 100
            };
            // @ts-ignore
            const nav = cy.navigator(defaults);

            return () => {
                if (nav) {
                    nav.destroy();
                }
            }; */
        }
    }, [cy, layoutName, config.zoom]);

    return (
        <>
            <FileDialog
                isOpen={isFileOpen}
                setIsOpen={setIsFileOpen}
                file={file}
                graphData={graphData}
            >
            </FileDialog>
            <PairDialog
                isOpen={isPairOpen}
                setIsOpen={setIsPairOpen}
                pair={pair}
            >
            </PairDialog>
            <CytoscapeComponent
                cy={(cy) => {
                    setCy(cy);
                    cy.on("click", "edge", (e: any) => {
                        handlePair(e.target.data()).then(r => console.log(r));
                    });
                    cy.on("click", "node[type='file']", (e: any) => {
                        handleFile(e.target.data()).then(r => console.log(r));
                    });
                    cy.nodes().on("expandcollapse.aftercollapse", function(event) {
                        let node = event.target;
                        node.style("font-size", "10px");
                        node.style("width", "label");
                    });
                    cy.nodes().on("expandcollapse.afterexpand", function(event) {
                        let node = event.target;
                        node.style("font-size", node.data("fontSize"));
                        node.style("width", node.data("width"));
                    });

                    cy.edges().on('mouseover', function(e) {
                        let edge = e.target;
                        let color = theme === "dark" ? '#ffffff' : '#000000';
                        edge.style('line-color', color);

                        let src = edge.source();
                        let tgt = edge.target();

                        if (src.data('type') === 'file') {
                            src.data('original-bg-color', src.style('background-color'));
                            src.style('background-color', edge.data('color'));
                        }

                        if (tgt.data('type') === 'file') {
                            tgt.data('original-bg-color', src.style('background-color'));
                            tgt.style('background-color', edge.data('color'));
                        }
                    });

                    cy.edges().on('mouseout', function(e) {
                        let edge = e.target;
                        edge.style('line-color', edge.data('color'));

                        let src = edge.source();
                        let tgt = edge.target();

                        if (src.data('type') === 'file') {
                            src.style('background-color', src.data('bgColor'));
                        }

                        if (tgt.data('type') === 'file') {
                            tgt.style('background-color', tgt.data('bgColor'));
                        }
                    });

                    cy.edges().forEach((edge: any) => {
                        const showEdge = edge.data('similarity') >= value;
                        edge.data('show', showEdge);
                        showEdge ? edge.show() : edge.hide();

                        const src = edge.source();
                        const tgt = edge.target();

                        if (src.data('type') === 'file' && tgt.data('type') === 'file') {
                            const showSrc = src.connectedEdges().some((edge: any) => edge.data('show'));
                            const showTgt = tgt.connectedEdges().some((edge: any) => edge.data('show'));

                            showSrc ? src.show() : src.hide();
                            showTgt ? tgt.show() : tgt.hide();
                        }
                    });
                }}
                layout={config.layout}
                stylesheet={theme === "dark" ? graphStyles2 : graphStylesLight}
                elements={data}
                wheelSensitivity={0.1}
                zoomingEnabled={true}
                zoom={config.zoom}
                style={{height: "100vh" as React.CSSProperties['height'], width: "100%"}}
                pixelRatio={0.9}
            />
            <Legend/>
        </>
    );
};