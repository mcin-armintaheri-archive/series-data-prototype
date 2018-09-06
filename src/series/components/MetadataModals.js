import React from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import SchemaConfig from "./SchemaConfig.js";
import MetadataEntry from "./MetadataEntry.js";

export const MetaSchemaModal = ({
  show = false,
  setShow,
  metadataSchema,
  setMetadataSchema
}) => {
  const setSubjectSchema = subjectSchema =>
    setMetadataSchema({ subjectSchema });
  const setSeriesSchema = seriesSchema => setMetadataSchema({ seriesSchema });
  return (
    <Modal bsSize="large" show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>Configure Schema</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div style={{ width: "600px" }}>
          <Row>
            <Col xs={12}>
              <SchemaConfig
                subjectSchema={metadataSchema.subjectSchema}
                seriesSchema={metadataSchema.seriesSchema}
                saveSubjectSchema={setSubjectSchema}
                saveSeriesSchema={setSeriesSchema}
              />
            </Col>
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export const SubjectMetaModal = ({
  show = false,
  setShow,
  subjectSchema,
  subjectMetadata,
  setSubjectMetadata
}) => {
  return (
    <Modal bsSize="large" show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>Subject Metadata</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div style={{ width: "600px" }}>
          <Row>
            <Col xs={12}>
              <MetadataEntry
                title="Subject Metadata Entry"
                schema={subjectSchema}
                metadata={subjectMetadata}
                saveMetadata={setSubjectMetadata}
              />
            </Col>
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export const SeriesMetaModal = ({
  seriesId = null,
  setShow,
  seriesSchema,
  seriesCollection,
  setSeriesMetadata
}) => {
  const series = seriesCollection.find(s => s.id === seriesId);
  return series ? (
    <Modal bsSize="large" show={seriesId !== null} onHide={() => setShow(null)}>
      <Modal.Header>
        <Modal.Title>{series.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div style={{ width: "600px" }}>
          <Row>
            <Col xs={12}>
              <MetadataEntry
                title="Series Metadata Entry"
                schema={seriesSchema}
                metadata={series.metadata || {}}
                saveMetadata={metadata =>
                  setSeriesMetadata({ seriesId, metadata })
                }
              />
            </Col>
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => setShow(null)}>Close</Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};
