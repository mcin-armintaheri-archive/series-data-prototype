import React, { Component } from "react";
import {} from "react-bootstrap";

const Clickable = ({ children, ...props }) => (
  <span style={{ margin: "5px 5px", cursor: "pointer" }} {...props}>
    {children}
  </span>
);

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
              justifyContent: "space-between"
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
                justifyContent: "space-between"
              }}
            >
              <Clickable
                onClick={() => {
                  onSubmit && onSubmit(inputValue);
                  this.setState({ editing: false });
                }}
              >
                S
              </Clickable>
              <Clickable
                onClick={() =>
                  this.setState({ inputValue: value, editing: false })
                }
              >
                X
              </Clickable>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <div style={{ marginBottom: "auto", marginTop: "auto" }}>
              {value}
            </div>
            <Clickable onClick={() => this.setState({ editing: true })}>
              E
            </Clickable>
          </div>
        )}
      </div>
    );
  }
}

export default EditableText;
