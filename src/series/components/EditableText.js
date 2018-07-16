import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faCheck from "@fortawesome/fontawesome-free-solid/faCheck";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import faEdit from "@fortawesome/fontawesome-free-solid/faEdit";
import Clickable from "./Clickable";

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = { editing: false, inputValue: props.value };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ inputValue: nextProps.value });
  }
  render() {
    const { value, onSubmit, style } = this.props;
    const { editing, inputValue } = this.state;
    return (
      <div style={style}>
        {editing ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-right"
            }}
          >
            <input
              value={inputValue}
              onChange={({ target }) =>
                this.setState({ inputValue: target.value })
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-right"
              }}
            >
              <Clickable
                onClick={() => {
                  onSubmit && onSubmit(inputValue);
                  this.setState({ editing: false });
                }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </Clickable>
              <Clickable
                onClick={() =>
                  this.setState({ inputValue: value, editing: false })
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </Clickable>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-right"
            }}
          >
            <div style={{ marginBottom: "auto", marginTop: "auto" }}>
              {value}
            </div>
            <Clickable onClick={() => this.setState({ editing: true })}>
              <FontAwesomeIcon icon={faEdit} />
            </Clickable>
          </div>
        )}
      </div>
    );
  }
}

export default EditableText;
