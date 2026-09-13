import generalSansUrl from "@/assets/fonts/general-sans-500.woff2?url";

// Exported files (downloaded .svg, or rasterized PNG/JPG) have no access to
// the page's stylesheet, so the diagram's `font-heading` class does nothing
// once serialized — the font has to be embedded directly in the SVG. Fetched
// once and cached as a data URL so repeat downloads don't refetch it.
let embeddedFontStylePromise: Promise<string> | null = null;

function getEmbeddedFontStyle(): Promise<string> {
    if (!embeddedFontStylePromise) {
        embeddedFontStylePromise = fetch(generalSansUrl)
            .then((res) => res.blob())
            .then((blob) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(blob);
            }))
            .then((dataUrl) => `
                @font-face {
                    font-family: "General Sans";
                    src: url("${dataUrl}") format("woff2");
                    font-weight: 500;
                    font-style: normal;
                }
                text { font-family: "General Sans", sans-serif; }
            `);
    }

    return embeddedFontStylePromise;
}

async function serializeSVG(svg: SVGSVGElement): Promise<string> {
    const clone = svg.cloneNode(true) as SVGSVGElement;

    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = await getEmbeddedFontStyle();
    clone.insertBefore(style, clone.firstChild);

    const serializer = new XMLSerializer();

    let source = serializer.serializeToString(clone);
    if (!source.includes("xmlns")) {
        source = source.replace(
            "<svg",
            '<svg xmlns="http://www.w3.org/2000/svg"'
        );
    }

    return source;
}

function getSvgDimensions(svg: SVGSVGElement): { width: number; height: number } {
    const viewBox = svg.viewBox.baseVal;
    if (viewBox && viewBox.width && viewBox.height) {
        return { width: viewBox.width, height: viewBox.height };
    }

    const rect = svg.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

async function svgToCanvas(svg: SVGSVGElement, scale = 2): Promise<HTMLCanvasElement> {
    const source = await serializeSVG(svg);
    const { width, height } = getSvgDimensions(svg);

    return new Promise((resolve, reject) => {
        const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        const image = new Image();

        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width * scale;
            canvas.height = height * scale;

            const context = canvas.getContext("2d");
            URL.revokeObjectURL(url);

            if (!context) {
                reject(new Error("Could not get a 2D canvas context"));
                return;
            }

            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas);
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not rasterize the chord diagram"));
        };

        image.src = url;
    });
}

function downloadDataUrl(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.rel = "noopener";
    link.download = filename;
    link.click();
}

export async function downloadSVG(svg: SVGSVGElement | null) {
    if (!svg) return;

    const source = await serializeSVG(svg);
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    downloadDataUrl(url, "chord.svg");
}

export async function downloadPNG(svg: SVGSVGElement | null) {
    if (!svg) return;

    const canvas = await svgToCanvas(svg);
    downloadDataUrl(canvas.toDataURL("image/png"), "chord.png");
}

export async function downloadJPG(svg: SVGSVGElement | null) {
    if (!svg) return;

    const canvas = await svgToCanvas(svg);
    const context = canvas.getContext("2d");

    if (context) {
        // JPEG has no alpha channel — paint white behind the diagram so
        // transparent areas don't turn black.
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    downloadDataUrl(canvas.toDataURL("image/jpeg", 0.92), "chord.jpg");
}

export function downloadMIDI() {
    // Coming Soon
}
