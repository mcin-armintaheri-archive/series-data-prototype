import React from "react";
import { Group } from "@vx/vx";

const Epoch = ({
  epochTags,
  seriesId,
  epochIndex,
  start,
  end,
  height,
  xScale,
  initEditEpochStart,
  initEditEpochEnd,
  continueEpoch,
  stopEditEpochStart,
  stopEditEpochEnd
}) => {
  return null;
  const rect1Props = {
    x: 0,
    width: 0,
    height
  };
  const rect2Props = {
    x: 0,
    width: 0,
    height
  };
  const rect3Props = {
    x: 0,
    width: 50,
    fill: "orange",
    opacity: 0.05,
    height
  };
  return (
    <Group height={height}>
      <rect {...rect1Props} />
      <rect {...rect2Props} />
      <rect {...rect3Props} />
    </Group>
  );
};

export default Epoch;
