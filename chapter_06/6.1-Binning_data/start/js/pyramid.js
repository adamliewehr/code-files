const drawPyramid = (data) => {
  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = { top: 40, right: 30, bottom: 40, left: 60 };
  const width = 555;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3
    .select("#pyramid")
    .append("svg")
    .attr("viewBox", `0, 0, ${width}, ${height}`)
    .style("border", "1px solid black");

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let femaleData = [];
  let maleData = [];

  data.forEach((element) => {
    if (element.gender == "Female") {
      femaleData.push(element);
    }
    if (element.gender == "Male") {
      maleData.push(element);
    }
  });

  // now realizing i could have just used filter here...
  console.log("ahhhh");
  console.log(data.length);
  console.log(femaleData);
  console.log(maleData);

  const binGenerator = d3.bin().value((d) => d.salary);

  const bins = binGenerator(data);
  const femaleBins = binGenerator(femaleData);

  // so the bins are what percentage of that group earns that salary

  // so we need to get the total amount, which is the female data length

  // femaleBins = femaleBins.map((innerList) => {
  //   return (innerList.length / data.length) * 100;
  // });

  const maleBins = binGenerator(maleData);
  console.log(femaleBins);
  console.log(maleBins);

  const minSalary = bins[0].x0;
  const maxSalary = bins[bins.length - 1].x1;
  const yScale = d3
    .scaleLinear()
    .domain([minSalary, maxSalary])
    .range([innerHeight, 0]);

  const femaleBinsMaxLength = d3.max(
    femaleBins,
    (d) => (d.length / data.length) * 100,
  );

  const femaleXscale = d3
    .scaleLinear()
    .range([innerWidth / 2, 0])
    .domain([15, 0]);

  const leftAxis = d3.axisLeft(yScale);
  innerChart.append("g").call(leftAxis);
  const bottomWomenAxis = d3
    .axisBottom(femaleXscale)
    .tickValues([15, 10, 5, 0])
    .tickSizeOuter(0);
  // const bottomWomenAxis = d3.axisBottom(femaleXscale);
  innerChart
    .append("g")
    .call(bottomWomenAxis)
    .attr("transform", `translate(0, ${innerHeight})`);

  innerChart
    .selectAll("rect_women")
    .data(femaleBins)
    .join("rect")
    .attr(
      "x",
      (d) => innerWidth / 2 - femaleXscale((d.length / data.length) * 100),
    )
    .attr("y", (d) => yScale(d.x1))
    .attr("width", (d) => femaleXscale((d.length / data.length) * 100))
    .attr("height", (d) => yScale(d.x0) - yScale(d.x1))
    .attr("fill", womenColor)
    .attr("stroke", "white")
    .attr("stroke-width", 2); // this is making the illusion of space between each rect

  const maleBinsMaxLength =
    d3.max(maleBins, (d) => (d.length / data.length) * 100) + 6;

  console.log(maleBinsMaxLength);

  const maleXscale = d3
    .scaleLinear()
    .domain([0, 15])
    .range([innerWidth / 2, innerWidth])
    .nice();

  const bottomMenAxis = d3
    .axisBottom(maleXscale)
    .tickValues([5, 10, 15])
    .tickSizeOuter(0);
  innerChart
    .append("g")
    .call(bottomMenAxis)
    .attr("transform", `translate(0, ${innerHeight})`);

  innerChart
    .selectAll("rect_men")
    .data(maleBins)
    .join("rect")
    .attr("x", (d) => maleXscale(0))
    .attr("y", (d) => yScale(d.x1))
    .attr(
      "width",
      (d) => maleXscale((d.length / data.length) * 100) - maleXscale(0), // this is what was wrong
    )
    .attr("height", (d) => yScale(d.x0) - yScale(d.x1))
    .attr("fill", menColor)
    .attr("stroke", "white")
    .attr("stroke-width", 2); // this is making the illusion of space between each rect
};
