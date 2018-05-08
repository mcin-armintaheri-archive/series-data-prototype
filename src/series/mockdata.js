export const randomWave = (t, numSuperpositions) =>
  Array(numSuperpositions)
    .fill(true)
    .map(
      (_, i) => Math.random() * Math.sin(2 * Math.random() * i * t * Math.PI)
    )
    .reduce((a, b) => a + b, 0);

export const makeRandomTraces = (numSamples, numSuperpositions) =>
  new Array(Math.floor(1 + Math.random() * 3)).fill(true).map(() =>
    new Array(numSamples).fill(true).map((_, i) => ({
      x: i,
      y: randomWave(i / numSamples, numSuperpositions)
    }))
  );

export const makeRandomSeries = (numSamples, numSuperpositions) => (_, i) => ({
  zoom: 1,
  name: "Signal - " + i,
  traces: makeRandomTraces(numSamples, numSuperpositions),
  epochs: [{ tag: 0, domain: [30, 50] }, { tag: 1, domain: [100, 150] }]
});

export const makeSeriesCollection = (
  numSeries = 8,
  numSamples = 250,
  numSuperpositions = 3
) =>
  Array(numSeries)
    .fill(true)
    .map(makeRandomSeries(numSamples, numSuperpositions));
