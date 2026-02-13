// Initialize the scales here

const xScale = d3.scaleBand();
// ! band scales accept a discrete input as a domain and return a continuous output from the range.

const colorScale = d3.scaleOrdinal();

const defineScales = (data) => {
  // Define the scales domain and range here
  // console.log(data.map((d) => d.year));

  xScale
    .domain(data.map((d) => d.year))
    .range([0, innerWidth])
    .paddingInner(0.2);

  colorScale
    .domain(formatsInfo.map((f) => f.id))
    .range(formatsInfo.map((f) => f.color));
};
