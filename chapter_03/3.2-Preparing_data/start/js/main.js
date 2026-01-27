// Append a SVG container
const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 600 700");

d3.csv("data/data.csv", (d) => {
  // THIS IS AN ASYNC FUNCTION
  return {
    // returns an object containing the tech and the count key-value pairs
    // the + operator converts the count to a number
    technology: d.technology,
    count: +d.count,
  };
}).then((data) => {
  // we need to use then() to retrieve the data from the promise
  // this makes the data iterable
  console.log(data);
  console.log(data.length);
  console.log(d3.max(data, (d) => d.count));
  console.log(d3.min(data, (d) => d.count));
  console.log(d3.extent(data, (d) => d.count)); // range

  data.sort((a, b) => b.count - a.count); // sorting the data
  console.log(data);

  // its common to call a function below (still in the then)
  // that actually creates our vis
  // this way, we don't have to really worry about async stuff anymore
  // we just build our vis regularly, and when the file is executed, the function is called in the then()

  createViz(data);
});

function createViz(data) {
  const xScale = d3.scaleLinear().domain([0, 1078]).range([0, 450]);
  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.technology))
    .range([0, 700]) // the height of the svg container
    .paddingInner(0.2); // this means 20%

  // svg
  //   .selectAll("rect")
  //   .data(data)
  //   .join("rect")
  //   .attr("class", (d) => {
  //     console.log(d);
  //     return `bar bar-${d.technology}`;
  //   })
  //   .attr("x", 100)
  //   .attr("y", (d) => {
  //     return yScale(d.technology);
  //   })
  //   .attr("height", yScale.bandwidth())
  //   .attr("width", (d) => {
  //     return xScale(d.count);
  //   })
  //   .attr("fill", (d) => {
  //     if (d.technology === "D3.js") {
  //       return "orange";
  //     }
  //     return "skyblue";
  //   });

  // svg
  //   .selectAll("text")
  //   .data(data)
  //   .join("text")
  //   .attr("x", 50)
  //   .attr("y", (d) => {
  //     return yScale(d.technology);
  //   })
  //   .text((d) => {
  //     return d.technology;
  //   });

  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate(0, ${yScale(d.technology)})`);

  barAndLabel
    .append("rect")
    .attr("x", 100)
    .attr("y", 0) // we don't need to translate these vertically anymore, because the position is relative to the parent group
    .attr("height", yScale.bandwidth())
    .attr("width", (d) => {
      return xScale(d.count);
    })
    .attr("fill", (d) => {
      if (d.technology === "D3.js") {
        return "orange";
      }
      return "skyblue";
    });

  barAndLabel
    .append("text")
    .text((d) => d.technology)
    .attr("x", 96)
    .attr("y", 12)
    .attr("text-anchor", "end")
    .style("font-family", "sans-serif")
    .style("font-size", "11px");

  barAndLabel
    .append("text")
    .text((d) => d.count)
    .attr("x", (d) => 100 + xScale(d.count) + 4)
    .attr("y", 12)
    .style("font-family", "sans-serif")
    .style("font-size", "9px");

  svg
    .append("line")
    .attr("x1", 100)
    .attr("y1", 0)
    .attr("x2", 100)
    .attr("y2", 700)
    .attr("stroke", "black");
}
