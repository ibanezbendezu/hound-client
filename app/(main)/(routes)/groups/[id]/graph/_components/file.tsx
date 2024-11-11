"use client"

import React, {useState, useEffect} from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import dagre from "cytoscape-dagre";
import fcose from "cytoscape-fcose";
import expandCollapse from 'cytoscape-expand-collapse';
import {fileGraphStyles, fileGraphStylesLight} from './styleB';
import "cytoscape-navigator/cytoscape.js-navigator.css";
import "./style.css";

import {PairDialog} from '@/app/(main)/(routes)/groups/[id]/graph/_components/pair-dialog';

import {pairByIdDataRequest} from '@/api/server-data';

import {useTheme} from "next-themes";


cytoscape.use(dagre);
cytoscape.use(fcose);
cytoscape.use(expandCollapse);

type Props = {
    data: any;
};

export const File: React.FC<Props> = ({data}) => {
    const [isPairOpen, setIsPairOpen] = useState(false);
    const [pair, setPair] = useState<any>(null);

    const {theme} = useTheme();

    const handlePair = async (e: any) => {
        const pairId = parseInt(e.id.split("-")[1], 10);
        const res = await pairByIdDataRequest(pairId);
        const pair = res.data;

        setPair(pair);
        setIsPairOpen(true);
    }

    const config = {
        layout: {
            name: "fcose",
            animate: false,
            randomize: true,
            fit: true,
            },
        zoom: 0.5,
    };

    const [cy, setCy] = useState<any>(null);

    useEffect(() => {
        if (cy) {
            const api = cy.expandCollapse({
                layoutBy: {
                    name: "preset",
                    randomize: true,
                    fit: true,
                    animate: true,
                    undoable: true,
                },
                collapseCueImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><path d="m6 15 6-6 6 6"/></svg>',
                expandCueImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>',
            });

            const defaults = {
                container: false, viewLiveFramerate: 0, thumbnailEventFramerate: 30, thumbnailLiveFramerate: false,
                dblClickDelay: 200, removeCustomContainer: false, rerenderDelay: 100
            };
        }
    }, [cy]);

    return (
        <>
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

                    cy.edges().on('mouseover', function(e) {
                        let edge = e.target;
                        let color = theme === "dark" ? '#ffffff' : '#000000';
                        edge.style('line-color', color);

                        let src = edge.source();
                        let tgt = edge.target();

                        if (src.isNode) {
                            src.data('original-bg-color', src.style('background-color'));
                            src.style('background-color', edge.data('color'));
                        }

                        if (tgt.isNode) {
                            tgt.data('original-bg-color', src.style('background-color'));
                            tgt.style('background-color', edge.data('color'));
                        }
                    });

                    cy.edges().on('mouseout', function(e) {
                        let edge = e.target;
                        edge.style('line-color', edge.data('color'));

                        let src = edge.source();
                        let tgt = edge.target();

                        if (src.isNode) {
                            src.style('background-color', src.data('bgColor'));
                        }

                        if (tgt.isNode) {
                            tgt.style('background-color', tgt.data('bgColor'));
                        }
                    });
                }}
                layout={config.layout}
                styleEnabled={true}
                stylesheet={theme === "dark" ? fileGraphStyles : fileGraphStylesLight}
                elements={data}
                wheelSensitivity={0.1}
                zoomingEnabled={true}
                zoom={config.zoom}
                style={{width: "100%", height: "100%"}}
            />
        </>
    );
};