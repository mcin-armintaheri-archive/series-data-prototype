import * as R from "ramda";
import { extent } from "d3-array";

const computeSeriesExtents = (seriesCollection, selector = R.identity) =>
  R.unnest(
    seriesCollection.map(series => series.traces.map(t => extent(t, selector)))
  );

const collapseExtents = extents =>
  extents.reduce(
    (out, e) => [
      !isNaN(e[0]) && e[0] < out[0] ? e[0] : out[0],
      !isNaN(e[1]) && e[1] > out[1] ? e[1] : out[1]
    ],
    [Infinity, -Infinity]
  );

export default (seriesCollection, selector) =>
  seriesCollection.length > 0
    ? collapseExtents(computeSeriesExtents(seriesCollection, selector))
    : [0, 1];
