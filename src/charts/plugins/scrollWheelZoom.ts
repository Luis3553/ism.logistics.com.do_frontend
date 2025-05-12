import Highcharts from "highcharts/highstock";
import { HighchartsReactProps } from "highcharts-react-official";

(function (H) {
    function stopEvent(e: any) {
        if (e) {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true;
        }
    }

    H.wrap(H.Chart.prototype, "render", function (this: HighchartsReactProps, proceed: any) {
        const chart = this;
        proceed.call(chart);

        if (chart.mouseWheelAttached) return;
        chart.mouseWheelAttached = true;

        const axis = chart.xAxis[0];
        const totalPoints = chart.series[0]?.data.length ?? 0;
        const maxVisible = axis.options.max ?? totalPoints;

        const needsScrollbar = totalPoints > maxVisible;

        if (needsScrollbar) {
            H.addEvent(chart.container, "wheel", function (event: any) {
                const dataMax = axis.dataMax;
                const dataMin = axis.dataMin;

                const e = chart.pointer.normalize(event);
                let delta = e.detail || -(e.deltaY / 120);
                delta = delta < 0 ? 1 : -1;

                if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
                    const extr = axis.getExtremes();
                    const step = ((extr.max - extr.min) / 20) * delta;

                    let newExtrMin, newExtrMax;
                    if (extr.min + step <= dataMin) {
                        newExtrMin = dataMin;
                        newExtrMax = dataMin + (extr.max - extr.min);
                    } else if (extr.max + step >= dataMax) {
                        newExtrMin = dataMax - (extr.max - extr.min);
                        newExtrMax = dataMax;
                    } else {
                        newExtrMin = extr.min + step;
                        newExtrMax = extr.max + step;
                    }

                    axis.setExtremes(newExtrMin, newExtrMax, true, false);
                }

                stopEvent(event);
                return false;
            });
        } else {
            // Prevent multiple bindings if chart is redrawn dynamically
            H.removeEvent(chart.container, "wheel");
        }
    });
})(Highcharts);
