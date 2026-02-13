const drawDonutCharts = (data) => {
  // Generate the donut charts here

  const svg = d3
    .select("#donut")
    .append("svg")
    .attr("viewBox", `0, 0, ${width}, ${height}`);

  const donutContainers = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const years = [1975, 1995, 2013];
  // console.log(data);
  // getting all the columns that AREN'T the year
  const formats = data.columns.filter((format) => format !== "year");
  // console.log(formats);

  years.forEach((year) => {
    // for each year in years, we create a donut container which is a group that gets translated with the xScale and halfway down the svg container
    const donutContainer = donutContainers
      .append("g")
      .attr("transform", `translate(${xScale(year)}, ${innerHeight / 2})`);

    // finding the data for that specific year in the data
    const yearData = data.find((d) => d.year === year);
    // console.log(yearData);

    const formattedData = [];

    // for each year (since we are still in this for each), we create an array of JSON objects
    // with the format and the sales for each column
    formats.forEach((format) => {
      formattedData.push({ format: format, sales: yearData[format] });
    });
    // console.log(formattedData);

    const pieGenerator = d3.pie().value((d) => d.sales);

    // this outputs a new array with the data, value, index, start angle, end angle, and pad angle needed to draw the pie chart
    // it makes it easy to make a pie chart
    const annotatedData = pieGenerator(formattedData);
    // console.log(annotatedData);

    const arcGenerator = d3
      .arc()
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle)
      .innerRadius(60)
      .outerRadius(100)
      .padAngle(0.02)
      .cornerRadius(3);

    // ! this is insane
    const arcs = donutContainer
      .selectAll(`.arc-${year}`)
      .data(annotatedData)
      .join("g")
      .attr("class", `arc-${year}`);

    arcs
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d) => colorScale(d.data.format));

    arcs
      .append("text")
      .text((d) => {
        d["percentage"] = (d.endAngle - d.startAngle) / (2 * Math.PI);
        return d3.format(".0%")(d.percentage);
      })
      .attr("x", (d) => {
        d["centroid"] = arcGenerator
          .startAngle(d.startAngle)
          .endAngle(d.endAngle)
          .centroid();
        return d.centroid[0];
      })
      .attr("y", (d) => d.centroid[1])
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#f6fafc")
      .attr("fill-opacity", (d) => (d.percentage < 0.05 ? 0 : 1))
      .style("font-size", "16px")
      .style("font-weight", 500);

    donutContainer
      .append("text")
      .text(year)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "30px")
      .style("font-weight", 500);
  });
};
