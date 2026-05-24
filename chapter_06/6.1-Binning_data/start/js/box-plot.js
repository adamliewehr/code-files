const drawBoxplot = (data) => {
  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = { top: 40, right: 30, bottom: 25, left: 60 };
  const width = 555;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3
    .select("#boxplot")
    .append("svg")
    .attr("viewBox", `0, 0, ${width}, ${height}`)
    .style("border", "1px solid black");

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const genders = ["Female", "Male"];

  const xScale = d3
    .scalePoint()
    .domain(genders)
    .range([0, innerWidth])
    .padding(0.5);

  const maxSalary = d3.max(data, (d) => d.salary);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxSalary])
    .range([innerHeight, 0])
    .nice();

  const bottomAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  innerChart
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale);
  innerChart.append("g").call(leftAxis);

  svg.append("text").text("Yearly salary (USD)").attr("x", 0).attr("y", 20);

  // female
  const femaleSalaries = data
    .filter((d) => d.gender === "Female")
    .map((d) => d.salary);

  // console.log(femaleSalaries);

  const femaleQuartilesScale = d3
    .scaleQuantile()
    .domain(femaleSalaries)
    .range([0, 1, 2, 3]);

  const femaleQuartiles = femaleQuartilesScale.quantiles();
  const femalesExtent = d3.extent(femaleSalaries);
  // male
  const maleSalaries = data
    .filter((d) => d.gender === "Male")
    .map((d) => d.salary);

  // console.log(maleSalaries);

  const maleQuartilesScale = d3
    .scaleQuantile()
    .domain(maleSalaries)
    .range([0, 1, 2, 3]);

  const maleQuartiles = maleQuartilesScale.quantiles();
  const malesExtent = d3.extent(maleSalaries);

  const boxplotWidth = 60;
  const boxplotStrokeWidth = 4;

  genders.forEach((gender) => {
    const boxplotContainer = innerChart
      .append("g")
      .attr("stroke", slateGray)
      .attr("stroke-width", boxplotStrokeWidth);

    boxplotContainer
      .append("rect")
      .attr("x", xScale(gender) - boxplotWidth / 2)
      .attr(
        "y",
        gender === "Female"
          ? yScale(femaleQuartiles[2])
          : yScale(maleQuartiles[2]),
      )
      .attr("width", boxplotWidth)
      .attr(
        "height",
        gender === "Female"
          ? yScale(femaleQuartiles[0]) - yScale(femaleQuartiles[2])
          : yScale(maleQuartiles[0]) - yScale(maleQuartiles[2]),
      )
      .attr("fill", "transparent");

    boxplotContainer
      .append("line")
      .attr("x1", xScale(gender) - boxplotWidth / 2)
      .attr("x2", xScale(gender) + boxplotWidth / 2)
      .attr(
        "y1",
        gender === "Female"
          ? yScale(femaleQuartiles[1])
          : yScale(maleQuartiles[1]),
      )
      .attr(
        "y2",
        gender === "Female"
          ? yScale(femaleQuartiles[1])
          : yScale(maleQuartiles[1]),
      )
      .attr("stroke", gender === "Female" ? womenColor : menColor)
      .attr("stroke-width", 10);

    // Append whiskers
    // Bottom whisker
    boxplotContainer
      .append("line")
      .attr("x1", xScale(gender))
      .attr("x2", xScale(gender))
      .attr(
        "y1",
        gender === "Female" ? yScale(femalesExtent[1]) : yScale(malesExtent[1]),
      )
      .attr(
        "y2",
        gender === "Female"
          ? yScale(femaleQuartiles[2])
          : yScale(maleQuartiles[2]),
      );
    boxplotContainer
      .append("line")
      .attr("x1", xScale(gender) - boxplotWidth / 2)
      .attr("x2", xScale(gender) + boxplotWidth / 2)
      .attr(
        "y1",
        gender === "Female" ? yScale(femalesExtent[0]) : yScale(malesExtent[0]),
      )
      .attr(
        "y2",
        gender === "Female" ? yScale(femalesExtent[0]) : yScale(malesExtent[0]),
      );

    // Top whisker
    boxplotContainer
      .append("line")
      .attr("x1", xScale(gender))
      .attr("x2", xScale(gender))
      .attr(
        "y1",
        gender === "Female"
          ? yScale(femaleQuartiles[0])
          : yScale(maleQuartiles[0]),
      )
      .attr(
        "y2",
        gender === "Female" ? yScale(femalesExtent[0]) : yScale(malesExtent[0]),
      );
    boxplotContainer
      .append("line")
      .attr("x1", xScale(gender) - boxplotWidth / 2)
      .attr("x2", xScale(gender) + boxplotWidth / 2)
      .attr(
        "y1",
        gender === "Female" ? yScale(femalesExtent[1]) : yScale(malesExtent[1]),
      )
      .attr(
        "y2",
        gender === "Female" ? yScale(femalesExtent[1]) : yScale(malesExtent[1]),
      );
  });
};
