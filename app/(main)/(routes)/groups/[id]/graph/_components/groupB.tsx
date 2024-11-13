"use client"

import React, {useEffect, useRef, useState} from 'react';

import cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import dagre from "cytoscape-dagre";
import fcose from "cytoscape-fcose";
import cola from 'cytoscape-cola';
import undoRedo from "cytoscape-undo-redo";
import expandCollapse from 'cytoscape-expand-collapse';
import cytoscapePopper from 'cytoscape-popper';
import navigator from "cytoscape-navigator";
import {graphStyles2, graphStylesLight} from './styleB';
import "cytoscape-navigator/cytoscape.js-navigator.css";
import "./style.css";

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import {cn} from "@/lib/utils";

import {FileDialog} from '@/app/(main)/(routes)/groups/[id]/graph/_components/file-dialog';
import {PairDialog} from '@/app/(main)/(routes)/groups/[id]/graph/_components/pair-dialog';

import {pairByIdDataRequest, pairsByGroupShaDataRequest} from '@/api/server-data';
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
cytoscape.use(navigator);

function tippyFactory(ref: any, content: any){
    let dummyDomEle = document.createElement('div');

    return tippy(dummyDomEle, {
        getReferenceClientRect: ref.getBoundingClientRect,
        trigger: 'manual', // mandatory
        // dom element inside the tippy:
        content: content,
        // your own preferences:
        arrow: true,
        placement: 'bottom',
        hideOnClick: false,
        sticky: "reference",

        // if interactive:
        interactive: true,
        appendTo: document.body // or append dummyDomEle to document.body
    });
}

cytoscape.use(cytoscapePopper(tippyFactory));

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
    const cyPopperRef = useRef(null);

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
                        let color = theme === "dark" || theme === "system" ? '#ffffff' : '#000000';
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

                            src.data('show', showSrc);
                            tgt.data('show', showTgt);

                            showSrc ? src.show() : src.hide();
                            showTgt ? tgt.show() : tgt.hide();
                        }
                    });

                    cy.nodes().forEach((node: any) => {
                        if (node.data('type') === 'layer') {
                            const children = node.children();
                            const allChildrenHidden = children.every((child: any) => !child.data('show'));

                            if (allChildrenHidden) {
                                node.data('show', false);
                                node.hide();
                            } else {
                                node.data('show', true);
                                node.show();
                            }
                        }
                    });

                    cy.nodes().forEach((node: any) => {
                        if (node.data('type') === 'repository') {
                            const children = node.children();
                            const allChildrenHidden = children.every((child: any) => !child.data('show'));

                            if (allChildrenHidden) {
                                node.data('show', false);
                                node.hide();
                            } else {
                                node.data('show', true);
                                node.show();
                            }
                        }
                    });

                    cy.nodes().on('mouseover', function(e) {
                        const node = e.target;
                        if (node.data('type') === 'file') {
                            let bgColor = theme === "dark" || theme === "system" ? '#151515' : '#9f9f9f';
                            node.style('background-color', bgColor);
                            let color = theme === "dark" || theme === "system" ? '#ffffff' : '#000000';
                            node.connectedEdges().forEach((edge: any) => {
                                if (edge.data('similarity') >= value) {
                                    edge.style('line-color', color);
                                    edge.connectedNodes().forEach((connectedNode: any) => {
                                        if (connectedNode.data('type') === 'file' && connectedNode.data('id') !== node.data('id')) {
                                            connectedNode.style('background-color', edge.data('color'));
                                        }
                                    });
                                }
                            });
                        }
                    });

                    cy.nodes().on('mouseout', function(e) {
                        const node = e.target;
                        if (node.data('type') === 'file') {
                            node.style('background-color', node.data('bgColor'));
                            node.connectedEdges().forEach((edge: any) => {
                                edge.style('line-color', edge.data('color'));
                                edge.connectedNodes().forEach((connectedNode: any) => {
                                    if (connectedNode.data('type') === 'file' && connectedNode.data('id') !== node.data('id')) {
                                        connectedNode.style('background-color', connectedNode.data('bgColor'));
                                    }
                                });
                            });
                        }
                    });

                    cy.edges().on('mouseover', function(e) {
                        let edge = e.target;
                        let content = document.createElement('div');
                        content.innerHTML = `
                             <div style="text-align: center;">
                                <strong>${edge.data('sourceName')}</strong><br>
                                <><br>
                                <strong>${edge.data('targetName')}</strong><br>
                                Similitud: ${Math.round(edge.data('similarity') * 100)}%
                                <div style="width: 20px; height: 10px; background-color: ${edge.data('color')}; border-radius: 10%; display: inline-block; margin: 5px auto 0;"></div>
                            </div>
                        `;

                        let tip = edge.popper({
                            content: () => content,
                            popper: {
                                placement: 'auto',
                            }
                        });

                        tip.show();

                        edge.on('mouseout', function() {
                            tip.hide();
                        });
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