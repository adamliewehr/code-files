const drawHistogram = (data) => {
  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = { top: 40, right: 30, bottom: 50, left: 40 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3
    .select("#histogram")
    .append("svg")
    .attr("viewBox", `0, 0, ${width}, ${height}`)
    .style("border", "1px solid black");

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const binGenerator = d3.bin().value((d) => d.salary);
  const bins = binGenerator(data);
  // console.log(bins);

  // scales

  const minSalary = bins[0].x0;
  const maxSalary = bins[bins.length - 1].x1;

  const xScale = d3
    .scaleLinear()
    .domain([minSalary, maxSalary])
    .range([0, innerWidth]);

  const binsMaxLength = d3.max(bins, (d) => d.length);

  const yScale = d3
    .scaleLinear()
    .domain([0, binsMaxLength])
    .range([innerHeight, 0])
    .nice();

  innerChart
    .selectAll("rect")
    .data(bins)
    .join("rect") // using rects
    .attr("x", (d) => xScale(d.x0)) // this is positioning each rect using the scale
    .attr("y", (d) => yScale(d.length)) // this too
    .attr("width", (d) => xScale(d.x1) - xScale(d.x0)) // this is determining how large each rect is
    .attr("height", (d) => innerHeight - yScale(d.length)) // so is this
    .attr("fill", slateGray)
    .attr("stroke", white)
    .attr("stroke-width", 2); // this is making the illusion of space between each rect

  const bottomAxis = d3.axisBottom(xScale);
  innerChart
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  svg
    .append("text")
    .text("Yearly salary (USD)")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 5);

  const leftAxis = d3.axisLeft(yScale);
  innerChart.append("g").call(leftAxis);

  svg.append("text").text("Frequency").attr("x", 5).attr("y", 20);
};
