import {useCallback, useLayoutEffect, useState} from "react";
import {DimensionObject, UseDimensionsArgs, UseDimensionsHook} from "./types";

function getDimensionObject(node: HTMLElement): DimensionObject {
    const rect = node.getBoundingClientRect();

    // @ts-ignore
    const {left, top} = rect;
    return {
        width: rect.width,
        height: rect.height,
        top: "x" in rect ? rect.x : top,
        left: "y" in rect ? rect.y : left,
        x: "x" in rect ? rect.x : left,
        y: "y" in rect ? rect.y : top,
        right: rect.right,
        bottom: rect.bottom
    };
}

function useDimensions({
                           liveMeasure = true
                       }: UseDimensionsArgs = {}): UseDimensionsHook {
    const [dimensions, setDimensions] = useState({});
    const [node, setNode] = useState(null);

    const ref = useCallback(node => {
        setNode(node);
    }, []);

    useLayoutEffect(() => {
        if (node) {
            const measure = () =>
                window.requestAnimationFrame(() =>
                    setDimensions(getDimensionObject(node))
                );
            measure();

            if (liveMeasure) {
                window.addEventListener("resize", measure);
                window.addEventListener("scroll", measure);

                return () => {
                    window.removeEventListener("resize", measure);
                    window.removeEventListener("scroll", measure);
                };
            }
        }
    }, [node]);

    return [ref, dimensions, node];
}

export default useDimensions;
