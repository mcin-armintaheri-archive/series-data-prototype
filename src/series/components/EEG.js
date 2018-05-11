import * as R from "ramda";
import React from "react";
import { Button } from "react-bootstrap";
import { scaleOrdinal, scaleLinear } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { ParentSize } from "@vx/vx";
import { Range } from "rc-slider";
import NewSeriesModal from "./new-series/NewSeriesModal";
import LineSeriesStack from "./LineSeriesStack";
import MultiplierPanel from "./MultiplierPanel";
import EditableText from "./EditableText";
import Toolbar from "./Toolbar";
import extent from "../util/extent.js";
import { Tools } from "../state/parameters/tools";

const palette = scaleOrdinal(schemeCategory10);
const tagColors = R.reverse(R.range(0, 10)).map((c, i) => {
  return {
    tag: i,
    color: palette(c)
  };
});

const RemoveSeries = () => null;

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
  newSeriesOpened,
  setNewSeriesOpened,
  activeTool = Tools.NONE,
  setTool,
  activeTag = 0,
  setTag,
  setName,
  createSeries,
  removeSeries,
  onSave,
  onLoad,
  ...seriesStackProps
}) => {
  const totalDomainExtent = extent(seriesCollection, x);
  const addEpochIsActive = activeTool === Tools.ADD_EPOCH;
  return (
    <div style={styles}>
      <Toolbar
        style={{ margin: "10px 10px" }}
        activeTool={activeTool}
        setTool={setTool}
        onSave={() => onSave(seriesCollection)}
        onLoad={() => onLoad(createSeries)}
      >
        {addEpochIsActive &&
          tagColors.map(({ tag, color }, i) => (
            <Button
              key={`${i}-${tagColors.length}`}
              onClick={() => setTag(tag)}
              bsStyle={`${tag === activeTag ? "" : "default"}`}
            >
              <div
                style={{
                  backgroundColor: color,
                  width: "15px",
                  height: "15px"
                }}
              />
            </Button>
          ))}
      </Toolbar>
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
          {seriesCollection.map((series, i) => (
            <div
              key={`${i}-${series.length}`}
              style={{ minWidth: `${panelWidth}px` }}
            >
              <EditableText
                value={series.name}
                onSubmit={name => setName({ seriesId: series.id, name })}
              />
              <MultiplierPanel
                multiplierLabel="zoom"
                multiplier={series.zoom}
                factor={zoomFactor}
                onChange={zoom => setZoom({ seriesId: series.id, zoom })}
              />
              <RemoveSeries removeSeries={removeSeries} />
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
                  activeTag={activeTag}
                  tagColors={tagColors}
                  {...seriesStackProps}
                />
              )}
            </ParentSize>
          </div>
        </div>
      </div>
      <NewSeriesModal createSeries={createSeries} />
    </div>
  );
};

export default EEG;
