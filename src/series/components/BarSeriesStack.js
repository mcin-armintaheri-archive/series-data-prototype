import React from "react";
import { Bar } from "@vx/vx";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import SeriesStackAxes from "./SeriesStackAxes";

const palette = scaleOrdinal(schemeCategory10);

const BarSeries = ({ data, xScale, yScale, traceIndex }) => {
  const x = d => d.x;
  const y = d => d.y;
  const xRange = xScale.range();
  const bandWidth = 0.95 * Math.abs(xRange[1] - xRange[0]) / data.length;
  const range = yScale.range();
  const mid = (range[0] + range[1]) / 2;
  return data.map((d, i) => {
    const yVal = y(d);
    return (
      <Bar
        key={i}
        x={x(d) * 3}
        y={mid}
        width={bandWidth}
        height={yVal * 10}
        fill={palette(traceIndex)}
      />
    );
  });
};

const LineSeriesStack = ({ renderSeries, ...seriesStackAxesProps }) => {
  return <SeriesStackAxes renderSeries={BarSeries} {...seriesStackAxesProps} />;
};

export default LineSeriesStack;
