import React from "react";
import { scaleLinear } from "d3-scale";
import { ParentSize } from "@vx/vx";
import { Range } from "rc-slider";
import LineSeriesStack from "./LineSeriesStack";
import extent from "../util/extent.js";

const styles = {
  fontFamily: "sans-serif",
  height: "800px",
  width: "100%"
};

const EEG = ({
  seriesCollection = [],
  domain,
  onDomainChange,
  yScale = [-1, 1],
  x = d => d.x,
  y = d => d.y,
  children,
  ...seriesStackProps
}) => {
  const totalDomainExtent = extent(seriesCollection, x);
  return (
    <div style={styles}>
      <ParentSize>
        {({ width, height }) => (
          <div>
            <div style={{ margin: "30px 30px" }}>
              <Range
                value={domain}
                onChange={onDomainChange}
                min={totalDomainExtent[0]}
                max={totalDomainExtent[1]}
              />
            </div>
            <LineSeriesStack
              x={x}
              y={y}
              width={width}
              height={height}
              xScale={scaleLinear().domain(domain)}
              yScale={scaleLinear().domain(yScale)}
              seriesCollection={seriesCollection}
              {...seriesStackProps}
            />
          </div>
        )}
      </ParentSize>
    </div>
  );
};

export default EEG;
