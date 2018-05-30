import React from "react";
import { Bar } from "@vx/vx";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import SeriesStackAxes from "./SeriesStackAxes";

const palette = scaleOrdinal(schemeCategory10);

const BarSeries = ({ data, xScale, yScale, traceIndex, height }) => {
  const x = d => d.x;
  const y = d => d.y;
  const xRange = xScale.range();
  const filtered = data.filter(d => x(d) >= xRange[0] && x(d) < xRange[1]);
  const bandWidth = 0.95 * Math.abs(xRange[1] - xRange[0]) / filtered.length;
  const range = yScale.range();
  const mid = (range[0] + range[1]) / 2 - height * traceIndex;
  return filtered.map((d, i) => {
    const yVal = y(d);
    return (
      <Bar
        key={i}
        x={xScale(x(d))}
        y={mid}
        width={bandWidth}
        height={yScale(yVal)}
        fill={palette(traceIndex)}
      />
    );
  });
};

const LineSeriesStack = ({ renderSeries, ...seriesStackAxesProps }) => {
  return <SeriesStackAxes renderSeries={BarSeries} {...seriesStackAxesProps} />;
};

export default LineSeriesStack;
