export const graphStyles = [
    {
        selector: "node",
        style: {
            label: "data(label)",
            color: "#fff",
            width: "60px",
            height: "40px",
            shape: "roundrectangle",

            "text-valign": "center",
            "text-halign": "center",
            "font-size": "5px",

            //"text-background-color": "#fff",
            //"text-background-opacity": 1,
            //"text-background-padding": "3px",
            //"text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "node:parent",
        style: {
            "font-size": "6px",
            "text-valign": "top",
            "text-halign": "center",
        },
    },
    {
        selector: "node[type = 'repository']",
        style: {
            "background-color": "#262626",
            "background-opacity": 0.9,
            "border-width": "0px",
        },
    },
    {
        selector: "node[class='Service'][type='folder']",
        style: {
            "background-color": "#293540",
            "background-opacity": 0.6,
            "border-width": "0px",
        },
    },
    {
        selector: "node[class = 'Controller'][type='folder']",
        style: {
            "background-color": "#41413e",
            "background-opacity": 0.6,
            "border-width": "0px",
        },
    },
    {
        selector: "node[class = 'Repository'][type='folder']",
        style: {
            "background-color": "#384047",
            "background-opacity": 0.6,
            "border-width": "0px",
        },
    },
    {
        selector: "node[type='file']",
        style: {
            "background-color": "#262626",
            "background-opacity": 0.9,
            "border-width": "0px",
        },
    },
    {
        selector: "edge",
        style: {
            width: "data(width)",
            color: "#fff",
            //label: "data(similarity)",
            "line-color": "data(color)",
            "line-opacity": 0.8,
            "text-valign": "bottom",
            "font-weight": "bold",
            "font-size": "4px",
            "curve-style": "bezier",
            "source-endpoint": "outside-to-node",
            "target-endpoint": "outside-to-node",
            "text-rotation": "autorotate",

            "text-background-color": "#41413e",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "edge:selected",
        style: {
            "line-color": "#fff",
            "target-arrow-color": "#fff",
            "text-background-color": "data(color)",
        },
    }
] as any;

export const graphStyles2 = [
    {
        selector: "node",
        style: {
            label: "data(label)",
            color: "#fff",
            width: "data(width)",
            height: "data(height)",
            shape: "roundrectangle",

            "text-valign": "center",
            "text-halign": "center",
            "font-size": "data(fontSize)",
            "font-family": "monospace",

            /* "text-background-color": "#fff",
            "text-background-opacity": 1,
            "text-background-padding": "3px",
            "text-background-shape": "roundrectangle", */
        },
    },
    {
        selector: "node:parent",
        style: {
            "text-valign": "top",
            "text-halign": "center",
        },
    },
    {
        selector: "node[type = 'repository']",
        style: {
            "font-weight": "bold",
            "background-color": "#262626",
            "background-opacity": 0.9,
            "border-width": "0px",
        },
    },
    {
        selector: "node[layer='Service'][type='layer']",
        style: {
            "background-color": "#293540",
            "background-opacity": 0.6,
            "border-width": "0px",

            "text-background-color": "#293540",
            "text-background-opacity": 0.6,
            "text-background-padding": "5px",
            "text-background-shape": "round-rectangle",
        },
    },
    {
        selector: "node[layer='Controller'][type='layer']",
        style: {
            "background-color": "#384047",
            "background-opacity": 0.6,
            "border-width": "0px",

            "text-background-color": "#384047",
            "text-background-opacity": 0.6,
            "text-background-padding": "5px",
            "text-background-shape": "round-rectangle",
        },
    },
    {
        selector: "node[layer='Repository'][type='layer']",
        style: {
            "background-color": "#41413e",
            "background-opacity": 0.6,
            "border-width": "0px",

            "text-background-color": "#41413e",
            "text-background-opacity": 0.6,
            "text-background-padding": "5px",
            "text-background-shape": "round-rectangle",
        },
    },
    {
        selector: "node[type='file']",
        style: {
            "background-color": "#262626",
            "background-opacity": 0.9,
            "border-width": "0px",
        },
    },
    {
        selector: "edge",
        style: {
            width: "data(width)",
            color: "#c7cbd1",
            label: "data(label)",
            "line-color": "data(color)",
            "line-opacity": 0.8,
            "text-valign": "bottom",
            "font-size": "5px",
            "curve-style": "bezier",
            "source-endpoint": "outside-to-node",
            "target-endpoint": "outside-to-node",
            "text-rotation": "autorotate",

            "text-background-color": "data(color)",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "edge:selected",
        style: {
            "line-color": "#fff",
            "target-arrow-color": "#fff",
            "text-background-color": "data(color)",
        },
    }
] as any;

export const graphStylesLight = [
    {
        selector: "node",
        style: {
            label: "data(label)",
            color: "#000",
            width: "data(width)",
            height: "data(height)",
            shape: "roundrectangle",

            "text-valign": "center",
            "text-halign": "center",
            "font-size": "data(fontSize)",
            "font-family": "monospace",

            /* "text-background-color": "#fff",
            "text-background-opacity": 1,
            "text-background-padding": "3px",
            "text-background-shape": "roundrectangle", */
        },
    },
    {
        selector: "node:parent",
        style: {
            "text-valign": "top",
            "text-halign": "center",
        },
    },
    {
        selector: "node[type = 'repository']",
        style: {
            "font-weight": "bold",
            "background-color": "#f3f4f6",
            "background-opacity": 0.9,
            "border-width": "0px",
        },
    },
    {
        selector: "node[layer='Service'][type='layer']",
        style: {
            "background-color": "#5b7792",
            "background-opacity": 0.6,
            "border-width": "0px",

            "text-background-color": "#5b7792",
            "text-background-opacity": 0.6,
            "text-background-padding": "5px",
            "text-background-shape": "round-rectangle",
        },
    },
    {
        selector: "node[layer='Controller'][type='layer']",
        style: {
            "background-color": "#7b8b9a",
            "background-opacity": 0.6,
            "border-width": "0px",

            "text-background-color": "#7b8b9a",
            "text-background-opacity": 0.6,
            "text-background-padding": "5px",
            "text-background-shape": "round-rectangle",
        },
    },
    {
        selector: "node[layer='Repository'][type='layer']",
        style: {
            "background-color": "#85857e",
            "background-opacity": 0.6,
            "border-width": "0px",

            "text-background-color": "#85857e",
            "text-background-opacity": 0.6,
            "text-background-padding": "5px",
            "text-background-shape": "round-rectangle",
        },
    },
    {
        selector: "node[type='file']",
        style: {
            "background-color": "#f3f4f6",
            "background-opacity": 0.9,
            "border-width": "0px",
        },
    },
    {
        selector: "edge",
        style: {
            width: "data(width)",
            color: "#fff",
            label: "data(label)",
            "line-color": "data(color)",
            "line-opacity": 0.8,
            "text-valign": "bottom",
            "font-size": "5px",
            "curve-style": "bezier",
            "source-endpoint": "outside-to-node",
            "target-endpoint": "outside-to-node",
            "text-rotation": "autorotate",

            "text-background-color": "data(color)",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "edge:selected",
        style: {
            "line-color": "#000",
            "target-arrow-color": "#000",
            "text-background-color": "data(color)",
        },
    }
] as any;

export const fileGraphStyles = [
    {
        selector: "node",
        style: {
            label: "data(label)",
            color: "#fff",
            width: "data(width)",
            height: "data(height)",
            shape: "roundrectangle",

            "text-valign": "center",
            "text-halign": "center",
            "font-size": "data(fontSize)",
            "font-family": "monospace",

            //"text-background-color": "#fff",
            //"text-background-opacity": 1,
            //"text-background-padding": "3px",
            //"text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "node:parent",
        style: {
            "text-valign": "top",
            "text-halign": "center",
        },
    },
    {
        selector: "node[type = 'repository']",
        style: {
            "font-size": "30px",
            "background-color": "#343434",
            "background-opacity": 0.9,
            "border-width": "0px",
            "overlay-color": "#343434",
        },
    },
    {
        selector: "node[type='file']",
        style: {
            width: "data(width)",
            height: "data(height)",
            "font-size": "data(fontSize)",
            "background-color": "#262626",
            "background-opacity": 0.9,
            "border-width": "0px",
        },
    },
    {
        selector: "node[type='file'][class='source']",
        style: {
            shape: "roundrectangle",
            "font-weight": "bold",
            "text-wrap": "wrap",
            "background-color": "#444444",
            "background-opacity": 0.9,
            "border-width": "1px",
            "border-color": "#615B5B",
        },
    },
    {
        selector: "edge",
        style: {
            width: "data(width)",
            color: "#fff",
            label: "data(similarity)",
            "line-color": "data(color)",
            "line-opacity": 0.8,
            "text-valign": "bottom",
            "font-weight": "bold",
            "font-size": "4px",
            "curve-style": "bezier",
            "source-endpoint": "outside-to-node",
            "target-endpoint": "outside-to-node",
            "text-rotation": "autorotate",

            "text-background-color": "data(color)",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "edge:selected",
        style: {
            "line-color": "#fff",
            "target-arrow-color": "#fff",
            "text-background-color": "data(color)",
        },
    }
] as any;

export const fileGraphStylesLight = [
    {
        selector: "node",
        style: {
            label: "data(label)",
            color: "#000",
            width: "data(width)",
            height: "data(height)",
            shape: "roundrectangle",

            "text-valign": "center",
            "text-halign": "center",
            "font-size": "data(fontSize)",
            "font-family": "monospace",

            //"text-background-color": "#fff",
            //"text-background-opacity": 1,
            //"text-background-padding": "3px",
            //"text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "node:parent",
        style: {
            "text-valign": "top",
            "text-halign": "center",
        },
    },
    {
        selector: "node[type = 'repository']",
        style: {
            "font-size": "30px",
            "background-color": "#f3f4f6",
            "background-opacity": 0.9,
            "border-width": "0px",
            "overlay-color": "#f3f4f6",
        },
    },
    {
        selector: "node[type='file']",
        style: {
            width: "data(width)",
            height: "data(height)",
            "font-size": "data(fontSize)",
            "background-color": "#e1e2e3",
            "background-opacity": 0.9,
            "border-width": "0px",
        },
    },
    {
        selector: "node[type='file'][class='source']",
        style: {
            shape: "roundrectangle",
            "font-weight": "bold",
            "text-wrap": "wrap",
            "background-color": "#e1e2e3",
            "background-opacity": 0.9,
            "border-width": "1px",
            "border-color": "#615B5B",
        },
    },
    {
        selector: "edge",
        style: {
            width: "data(width)",
            color: "#fff",
            label: "data(similarity)",
            "line-color": "data(color)",
            "line-opacity": 0.8,
            "text-valign": "bottom",
            "font-weight": "bold",
            "font-size": "4px",
            "curve-style": "bezier",
            "source-endpoint": "outside-to-node",
            "target-endpoint": "outside-to-node",
            "text-rotation": "autorotate",

            "text-background-color": "data(color)",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "edge:selected",
        style: {
            "line-color": "#000",
            "target-arrow-color": "#000",
            "text-background-color": "data(color)",
        },
    }
] as any;