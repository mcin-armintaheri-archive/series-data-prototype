import React from "react";
import { scaleLinear } from "d3-scale";
import { ParentSize } from "@vx/vx";
import { Range } from "rc-slider";
import LineSeriesStack from "./LineSeriesStack";
import MultiplierPanel from "./MultiplierPanel";
import extent from "../util/extent.js";

const styles = {
  fontFamily: "sans-serif",
  height: "800px",
  width: "100%"
};

const EEG = ({
  seriesCollection = [],
  domain,
  zoomFactor = 1.1,
  onDomainChange,
  setZoom,
  yScale = [-1, 1],
  x = d => d.x,
  y = d => d.y,
  children,
  margin = {
    top: 30,
    left: 50,
    right: 50,
    bottom: 30
  },
  ...seriesStackProps
}) => {
  const totalDomainExtent = extent(seriesCollection, x);
  return (
    <div style={styles}>
      <div style={{ margin: "30px 30px" }}>
        <Range
          value={domain}
          onChange={onDomainChange}
          min={totalDomainExtent[0]}
          max={totalDomainExtent[1]}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%"
        }}
      >
        <div
          style={{
            marginTop: `${margin.top}px`,
            marginBottom: `${margin.bottom}px`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around"
          }}
        >
          {seriesCollection.map(series => (
            <MultiplierPanel
              onChange={zoom => setZoom({ seriesId: series.id, zoom })}
              label={series.name}
              multiplierLabel="zoom"
              multiplier={series.zoom}
              factor={zoomFactor}
            />
          ))}
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <ParentSize>
              {({ width, height }) => (
                <LineSeriesStack
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  xScale={scaleLinear().domain(domain)}
                  yScale={scaleLinear().domain(yScale)}
                  seriesCollection={seriesCollection}
                  margin={margin}
                  {...seriesStackProps}
                />
              )}
            </ParentSize>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EEG;
