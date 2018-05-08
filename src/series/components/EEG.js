import React from "react";
import { scaleLinear } from "d3-scale";
import { ParentSize } from "@vx/vx";
import { Range } from "rc-slider";
import LineSeriesStack from "./LineSeriesStack";
import MultiplierPanel from "./MultiplierPanel";
import EditableText from "./EditableText";
import Toolbar from "./Toolbar";
import extent from "../util/extent.js";
import { Tools } from "../state/parameters/tools";

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
  panelWidth = 150,
  activeTool = Tools.NONE,
  setTool,
  ...seriesStackProps
}) => {
  const totalDomainExtent = extent(seriesCollection, x);
  return (
    <div style={styles}>
      <Toolbar
        style={{ margin: "10px 10px" }}
        activeTool={activeTool}
        setTool={setTool}
      />
      <div
        style={{
          margin: `30px ${margin.right}px 30px ${panelWidth + margin.left}px`
        }}
      >
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
            <div style={{ minWidth: `${panelWidth}px` }}>
              <EditableText
                value={series.name}
                onSubmit={value => {
                  console.log({ name: value });
                }}
              />
              <MultiplierPanel
                multiplierLabel="zoom"
                multiplier={series.zoom}
                factor={zoomFactor}
                onChange={zoom => setZoom({ seriesId: series.id, zoom })}
              />
            </div>
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
                  activeTool={activeTool}
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
