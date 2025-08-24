import React, {useEffect, useRef} from 'react';
import {SvgMeta} from "xingine";
import {toCSSProperties} from "../utils/Component.utils";


function ensureXmlns(svg: string): string {
    // Only add xmlns if it's missing and the root tag is <svg>
    const hasXmlns = /<svg[^>]*xmlns=/.test(svg);
    if (!hasXmlns) {
        return svg.replace(
            /<svg([\s>])/,
            '<svg xmlns="http://www.w3.org/2000/svg"$1'
        );
    }
    return svg;
}
export const SvgRenderer: React.FC<SvgMeta> = ({
                                                   svg,
                                                   style,
                                                   title,
                                                   alt,
                                               }) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!spanRef.current || !svg) return;

        // Clear previous content
        spanRef.current.innerHTML = '';
        const svgWithNs = ensureXmlns(svg.trim());
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgWithNs, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        if (svgElement.nodeName !== 'svg') return;

        if (alt) svgElement.setAttribute('aria-label', alt);
        if (title) {
            const titleElement = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'title');
            titleElement.textContent = title;
            svgElement.prepend(titleElement);
        }

        spanRef.current.appendChild(document.importNode(svgElement, true));
    }, [svg, alt, title]);

    return <span ref={spanRef} className={style?.className} style={toCSSProperties(style?.style)} />;
};