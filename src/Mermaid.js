import React from "react";
import mermaid from "mermaid";
import { library, icon } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import html2canvas from "html2canvas";
import "./mermaid-styles.css"; // We'll create this file next

library.add(fas);
library.add(far);

mermaid.initialize({
    startOnLoad: true,
    theme: "dark",
    securityLevel: "loose",
    fontFamily: "Helvetica Neue, Arial, sans-serif",
    themeCSS: `
  text, tspan {
    fill: #f7f2b7 !important;
    text-anchor: middle !important;
    dominant-baseline: middle !important;
  }
  
  .fa {
    color: #f7f2b7 !important;
  }
  
  .node-bkg,
  rect.node-bkg, 
  circle.node-bkg, 
  .node-bkg.node-no-border {
    fill: #3e498c !important;
    stroke: #0176b9 !important;
  }
  
  .node-circle {
    stroke-width: 2px !important;
  }
  
  .node-no-border {
    stroke-width: 0 !important;
  }
  
  .node text {
    font-weight: 500 !important;
  }
  
  path.edge {
    stroke: #0176b9 !important;
    stroke-width: 2px !important;
  }
  
  [class^="node-line-"] {
    stroke: #0176b9 !important;
    stroke-width: 2px !important;
  }
  
  .fa.icon-container {
    color: inherit !important;
    font-size: inherit !important;
  }
  
  foreignObject {
    overflow: visible !important;
  }
  
  foreignObject div {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    height: 100% !important;
    text-align: center !important;
  }
  
  .mindmap-node .nodeLabel {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
`
});

async function replaceFontAwesomeIconsWithInlineSVGs(mermaidContainer) {
    const iconElements = Array.from(mermaidContainer.querySelectorAll(".fa"));

    for (const iconElement of iconElements) {
        const iconClass = Array.from(iconElement.classList).find((className) =>
            className.startsWith("fa-")
        );

        if (!iconClass) {
            console.error("No icon class found");
            continue;
        }

        const iconName = iconClass.slice(3);

        let faIcon = icon({ prefix: "fas", iconName });

        if (!faIcon) {
            faIcon = icon({ prefix: "far", iconName });

            if (!faIcon) {
                console.error(`Icon with name ${iconName} not found.`);
                continue;
            }
        }

        // Apply styles to the SVG icon to match the theme
        if (faIcon.node && faIcon.node[0]) {
            faIcon.node[0].style.color = "#f7f2b7";
            faIcon.node[0].style.width = "1em";
            faIcon.node[0].style.height = "1em";
        }

        iconElement.parentNode.replaceChild(faIcon.node[0], iconElement);
    }

    return mermaidContainer;
}

export default class Mermaid extends React.Component {
    componentDidMount() {
        mermaid.contentLoaded();
        this.centerTextElements();
        this.fixWrapperBackgrounds();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.chart !== this.props.chart) {
            // Wait for mermaid to render
            setTimeout(() => {
                this.centerTextElements();
                this.fixWrapperBackgrounds();
            }, 100);
        }
    }

    fixWrapperBackgrounds() {
        // Override any parent bg-white class with our desired background
        const parentElements = document.querySelectorAll('.bg-white, .dark\\:bg-slate-900');
        parentElements.forEach(element => {
            if (element.contains(document.getElementById('mermaidChart'))) {
                element.style.backgroundColor = '#3e498c';
                element.classList.add('mermaid-parent-override');
            }
        });
    }

    centerTextElements() {
        const container = document.getElementById("mermaidChart");
        if (!container) return;

        // Center all foreignObject content
        const foreignObjects = container.querySelectorAll("foreignObject");
        foreignObjects.forEach(fo => {
            // Add a wrapper div if not already present
            const div = fo.querySelector("div");
            if (div) {
                div.style.display = "flex";
                div.style.justifyContent = "center";
                div.style.alignItems = "center";
                div.style.textAlign = "center";
                div.style.height = "100%";
            }
        });

        // Center all text elements
        const textElements = container.querySelectorAll("text");
        textElements.forEach(text => {
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
        });
    }

    async saveAsPNG(scale = 2) {
        let mermaidContainer = document.getElementById("mermaidChart");
        if (!mermaidContainer) {
            throw new Error("No Mermaid container element found");
        }

        mermaidContainer = await replaceFontAwesomeIconsWithInlineSVGs(
            mermaidContainer
        );

        const clonedMermaidContainer = mermaidContainer.cloneNode(true);

        clonedMermaidContainer.style.display = "none";
        document.body.appendChild(clonedMermaidContainer);

        clonedMermaidContainer.style.transform = `scale(${scale})`;
        clonedMermaidContainer.style.transformOrigin = "top left";
        clonedMermaidContainer.style.display = "block";
        clonedMermaidContainer.style.backgroundColor = "#3e498c"; // Add background color

        html2canvas(clonedMermaidContainer, {
            scale: 1,
            backgroundColor: "#3e498c" // Also set background color in html2canvas
        })
            .then((canvas) => {
                document.body.removeChild(clonedMermaidContainer);

                const png = canvas.toDataURL("image/png");
                const a = document.createElement("a");
                a.download = "mindmap.png";
                a.href = png;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch((error) => {
                document.body.removeChild(clonedMermaidContainer);
                console.error("Error generating PNG file: ", error);
            });
    }

    async saveAsSVG() {
        let mermaidContainer = document.getElementById("mermaidChart");
        if (!mermaidContainer) {
            throw new Error("No Mermaid container element found");
        }

        mermaidContainer = await replaceFontAwesomeIconsWithInlineSVGs(
            mermaidContainer
        );

        const clonedMermaidContainer = mermaidContainer.cloneNode(true);

        // Add background to SVG for better visibility
        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute("width", "100%");
        bgRect.setAttribute("height", "100%");
        bgRect.setAttribute("fill", "#3e498c");
        clonedMermaidContainer.insertBefore(bgRect, clonedMermaidContainer.firstChild);

        // Find all foreignObjects within the clonedMermaidContainer and scale them down
        const foreignObjects = clonedMermaidContainer.getElementsByTagName(
            "foreignObject"
        );
        for (let fo of foreignObjects) {
            let svg = fo.querySelector("svg");
            let scale = 0.8; // Change this to scale the SVG elements

            // Scale the dimensions and transform the SVG elements
            let oldWidth = parseFloat(fo.getAttribute("width"));
            let oldHeight = parseFloat(fo.getAttribute("height"));
            fo.setAttribute("width", oldWidth * scale + "px");
            fo.setAttribute("height", oldHeight * scale + "px");

            // Center the SVG elements vertically and horizontally
            let xAttribute = parseFloat(fo.getAttribute("x") || "0");
            let yAttribute = parseFloat(fo.getAttribute("y") || "0");
            let xOffset = (oldWidth * (1 - scale)) / 2;
            let yOffset = (oldHeight * (1 - scale)) / 2;
            fo.setAttribute("x", (xAttribute + xOffset) + "px");
            fo.setAttribute("y", (yAttribute + yOffset) + "px");

            if (svg) {
                svg.style.transform = `scale(${scale})`;
                svg.style.transformOrigin = "center";
                let div = svg.parentElement;
                if (div) {
                    div.style.display = "flex";
                    div.style.justifyContent = "center";
                    div.style.alignItems = "center";
                    div.style.textAlign = "center";
                }
            }
        }

        clonedMermaidContainer.style.display = "none";
        document.body.appendChild(clonedMermaidContainer);

        clonedMermaidContainer.style.transformOrigin = "top left";
        clonedMermaidContainer.style.display = "block";

        try {
            const svgData = new XMLSerializer().serializeToString(
                clonedMermaidContainer
            );
            const preface = '<?xml version="1.0" standalone="no"?>\r\n';
            const svgBlob = new Blob([preface, svgData], {
                type: "image/svg+xml;charset=utf-8"
            });
            const svgUrl = URL.createObjectURL(svgBlob);

            const downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = "mindmap.svg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            document.body.removeChild(clonedMermaidContainer);
        } catch (error) {
            document.body.removeChild(clonedMermaidContainer);
            console.error("Error generating SVG file: ", error);
        }
    }

    constructor(props) {
        super(props);
        this.saveAsPNG = this.saveAsPNG.bind(this);
        this.saveAsSVG = this.saveAsSVG.bind(this);
        this.centerTextElements = this.centerTextElements.bind(this);
        this.fixWrapperBackgrounds = this.fixWrapperBackgrounds.bind(this);
    }

    render() {
        return (
            <div className="mermaid-wrapper">
                <div className="buttonContainer">
                    <button onClick={() => this.saveAsPNG()}>Save PNG Image</button>
                    <button onClick={() => this.saveAsSVG()}>Save SVG Image</button>
                </div>
                <div id="mermaidChart" className="mermaid">
                    {this.props.chart}
                </div>
            </div>
        );
    }
}