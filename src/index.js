import React from "react";
import { render } from "react-dom";
import extent from "./series/util/extent.js";
import { makeSeriesCollection } from "./series/mockdata";
import SeriesApp from "./series";
import "rc-slider/assets/index.css";
import "./css/bootstrap.min.css";

export { makeSeriesCollection } from "./series/mockdata";

export const seriesCollectionExtent = seriesCollection =>
  extent(seriesCollection, d => d.x);

export const mountSeriesApp = (
  root,
  { domain, seriesCollection, x = d => d.x, y = d => d.y }
) =>
  render(
    <SeriesApp
      initialDomain={domain}
      initialSeriesCollection={seriesCollection}
      x={x}
      y={y}
    />,
    root
  );

window.mountSeriesApp = mountSeriesApp;
window.makeSeriesCollection = makeSeriesCollection;
window.seriesCollectionExtent = seriesCollectionExtent;

// <script>
var mockData = window.makeSeriesCollection();
var domain = window.seriesCollectionExtent(mockData);
window.mountSeriesApp(document.getElementById("root"), {
  domain: domain,
  seriesCollection: mockData
});
// </script>
