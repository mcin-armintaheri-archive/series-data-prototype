import React from "react";
import SeriesEditor from "./SeriesEditor";
import BarSeriesStack from "./BarSeriesStack";

const Omics = ({ seriesCollection, ...editorProps }) => {
  return (
    <SeriesEditor
      seriesCollection={seriesCollection}
      component={BarSeriesStack}
      {...editorProps}
    />
  );
};

export default Omics;
