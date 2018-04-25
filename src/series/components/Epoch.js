import * as R from "ramda";
import React from "react";
import { Group } from "@vx/vx";
import { getPosition } from "../util/pointer";

const Epoch = ({
  epochTags,
  domain,
  tag,
  height,
  y,
  xScale,
  initEditEpochStart,
  initEditEpochEnd,
  continueEditEpoch
}) => {
  const [x0, x1] = domain.map(xScale);
  const mid = (x0 + x1) / 2;
  const rectStartProps = {
    x: x0,
    width: mid - x0,
    height,
    fill: "orange",
    opacity: 0.3,
    onMouseDown: R.compose(
      initEditEpochStart,
      xScale.invert,
      R.prop("clientX")
    ),
    onMouseMove: R.compose(continueEditEpoch, xScale.invert, R.prop("clientX"))
  };
  const rectEndProps = {
    x: mid - 0.1,
    width: x1 - mid,
    height,
    fill: "orange",
    opacity: 0.3,
    onMouseDown: R.compose(initEditEpochEnd, xScale.invert, R.prop("clientX")),
    onMouseMove: R.compose(continueEditEpoch, xScale.invert, R.prop("clientX"))
  };
  return (
    <Group height={height}>
      <rect {...rectStartProps} />
      <rect {...rectEndProps} />
    </Group>
  );
};

export default Epoch;
