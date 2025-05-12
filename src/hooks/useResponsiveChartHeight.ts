import { useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";
import Highcharts from "highcharts/highstock";

export const useResponsiveChartHeight = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [initialHeight, setInitialHeight] = useState<number | undefined>(undefined);
    const [chartOptions, setChartOptions] = useState<Highcharts.Options>();

    // Capture initial height before first paint
    useLayoutEffect(() => {
        if (wrapperRef.current) {
            setInitialHeight(wrapperRef.current.offsetHeight);
        }
    }, []);

    // Resize observer to update height dynamically
    const { ref: resizeRef } = useResizeObserver({
        onResize: ({ height }) => {
            if (height) {
                setChartOptions((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        chart: {
                            ...prev.chart,
                            height,
                        },
                    };
                });
            }
        },
    });

    return {
        wrapperRef,
        resizeRef,
        initialHeight,
        setChartOptions,
        chartOptions,
    };
};
