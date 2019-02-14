import * as R from "ramda";
import React from "react";
import { compose, withState } from "recompose";
import { ButtonGroup, Button } from "react-bootstrap";
import { scaleOrdinal, scaleLinear } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { ParentSize } from "@vx/vx";
import { Range } from "rc-slider";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faInfoCircle from "@fortawesome/fontawesome-free-solid/faInfoCircle";
import Clickable from "./Clickable";
import {
  MetaSchemaModal,
  SubjectMetaModal,
  SeriesMetaModal
} from "./MetadataModals";
import { BatchImportModalTest } from "./BatchImportModal";
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

const styles = {
  fontFamily: "sans-serif",
  height: "800px",
  width: "100%"
};

const SeriesEditor = ({
  subjectMetadata = {},
  seriesCollection = [],
  metadataSchema = { subjectSchema: {}, seriesSchema: {} },
  setMetadataSchema,
  setSubjectMetadata,
  setSeriesMetadata,
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
  activeTag = 0,
  setTag,
  setName,
  createSeries,
  removeSeries,
  onSave,
  onLoad,
  component = LineSeriesStack,
  showSchemaConfig = false,
  setShowSchemaConfig,
  showSeriesMeta = false,
  setShowSeriesMeta,
  showSubjectMeta = false,
  setShowSubjectMeta,
  showBatchImport = false,
  setShowBatchImport,
  ...seriesStackProps
}) => {
  const totalDomainExtent = extent(seriesCollection, x);
  const addEpochIsActive = activeTool === Tools.ADD_EPOCH;
  const Component = component;
  const schemaButtons = (
    <div style={{ margin: "10px" }}>
      <ButtonGroup>
        <Button onClick={() => setShowBatchImport(true)}>Add a Series</Button>
        <Button onClick={() => setShowSchemaConfig(true)}>
          Configure Metadata Schema
        </Button>
        <Button onClick={() => setShowSubjectMeta(true)}>
          Configure Subject Metadata
        </Button>
      </ButtonGroup>
    </div>
  );
  return (
    <div style={styles}>
      {schemaButtons}
      <Toolbar
        style={{ margin: "10px 10px" }}
        activeTool={activeTool}
        setTool={setTool}
        onSave={() => onSave({ subjectMetadata, seriesCollection })}
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
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Clickable
                  onClick={() => removeSeries({ seriesId: series.id })}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </Clickable>
                <Clickable onClick={() => setShowSeriesMeta(series.id)}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                </Clickable>
              </div>
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
            </div>
          ))}
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <ParentSize>
              {({ width, height }) => {
                return seriesCollection.length === 0 ? (
                  <h4>There are no series to show.</h4>
                ) : (
                  <Component
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
                );
              }}
            </ParentSize>
          </div>
        </div>
      </div>
      <MetaSchemaModal
        show={showSchemaConfig}
        setShow={setShowSchemaConfig}
        metadataSchema={metadataSchema}
        setMetadataSchema={setMetadataSchema}
      />
      <SubjectMetaModal
        show={showSubjectMeta}
        setShow={setShowSubjectMeta}
        subjectSchema={metadataSchema.subjectSchema}
        subjectMetadata={subjectMetadata}
        setSubjectMetadata={setSubjectMetadata}
      />
      <SeriesMetaModal
        seriesId={showSeriesMeta}
        setShow={setShowSeriesMeta}
        seriesSchema={metadataSchema.seriesSchema}
        seriesCollection={seriesCollection}
        setSeriesMetadata={setSeriesMetadata}
      />
      <BatchImportModalTest
        show={showBatchImport}
        setShow={setShowBatchImport}
        createSeries={createSeries}
      />
    </div>
  );
};

const withModals = compose(
  withState("showSchemaConfig", "setShowSchemaConfig", false),
  withState("showSubjectMeta", "setShowSubjectMeta", false),
  withState("showSeriesMeta", "setShowSeriesMeta", null),
  withState("showBatchImport", "setShowBatchImport", false)
);

export default withModals(SeriesEditor);
