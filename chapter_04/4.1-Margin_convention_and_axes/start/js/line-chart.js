// Load the data here

// auto type detects common data types, and coverts them into the corrosponding data type
// this sometimes picks the wrong types, so be careful
// always double check!
d3.csv("./data/weekly_temperature.csv", d3.autoType).then((data) => {
  console.log("temp data", data);
  drawLineChart(data);
});

// Create the line chart here
const drawLineChart = (data) => {
  // d3 margin convention:
  // saving space for things around the vis

  const margin = { top: 40, right: 170, bottom: 25, left: 40 };
  // once we know the size of the svg container, we can calculate the inner width and height of the chart

  const width = 1000;

  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3
    .select("#line-chart")
    .append("svg")
    .style("border", "1px solid black")
    .attr("viewBox", `0, 0, ${width}, ${height}`);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  // there is an axis() component generator in d3
  // using scales as an input, and returns svg elements

  // ! scaleTime for the x axis
  // behaves simliarly to the linear scale
  const firstDate = new Date(2021, 00, 01, 0, 0, 0);
  const lastDate = d3.max(data, (d) => d.date);
  const xScale = d3
    .scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);

  // ! yScale
  const maxTemp = d3.max(data, (d) => d.max_temp_F); // ? what is this max_temp_f???
  console.log(maxTemp);
  // ! max_temp_f is the column that contains the temp for each day

  const yScale = d3.scaleLinear().domain([0, maxTemp]).range([innerHeight, 0]);

  // d3 has 4 axis generators: axisTop(), axisRight(), axisBottom() and axisLeft()

  const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
  // we can change 2021 at the start of the axis to jan by doing d3.timeFormat
  // %b is the key for the abreviation for a month name
  innerChart
    .append("g")
    .attr("class", "axis-x")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  // the main part of this code is setting the month labels to the middle of the ticks
  d3.selectAll(".axis-x text")
    .attr("x", (d) => {
      const currentMonth = d;
      const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);
      return (xScale(nextMonth) - xScale(currentMonth)) / 2;
    })
    .attr("y", "10px")
    .style("font-family", "Roboto, sans-serif")
    .style("font'size", "14px");

  const leftAxis = d3.axisLeft(yScale);
  innerChart.append("g").attr("class", "axis-y").call(leftAxis);

  d3.selectAll(".axis-y text")
    .attr("x", "-5px")
    .style("font-family", "Roboto, sans-serif")
    .style("font-size", "14px")
    .style("fill", "black");

  svg.append("text").text("Temperature (F)").attr("y", 20);

  // ! we need to draw the area around the line chart before the actual line, because we want it behind the line

  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.date))
    .y0((d) => yScale(d.min_temp_F))
    .y1((d) => yScale(d.max_temp_F))
    .curve(d3.curveCatmullRom);

  innerChart
    .append("path")
    .attr("d", areaGenerator(data))
    .attr("fill", "green")
    .attr("fill-opacity", 0.2);

  innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", 4)
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.avg_temp_F))
    .attr("fill", "green");

  // using the line generator

  // d3.line() is a func that takes thoe horizontal and vert position of each data point as an input
  // and returns the d attrivute of an svg path, or polyline, passing through these data points as output

  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.avg_temp_F));

  const curveGenerator = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.avg_temp_F))
    .curve(d3.curveCatmullRom);

  innerChart
    .append("path")
    .attr("d", curveGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "green");

  innerChart
    .append("text")
    .text("average temp")
    .attr("x", xScale(lastDate) + 10)
    .attr("y", yScale(data[data.length - 1].avg_temp_F))
    .attr("dominant-baseline", "middle")
    .attr("fill", "green");

  innerChart
    .append("text")
    .text("minimum temp")
    .attr("x", xScale(data[data.length - 3].date) + 13)
    .attr("y", yScale(data[data.length - 3].min_temp_F) + 20)
    .attr("dominant-baseline", "hanging")
    .attr("fill", "green");

  innerChart
    .append("line")
    .attr("x1", xScale(data[data.length - 3].date))
    .attr("y1", yScale(data[data.length - 3].min_temp_F) + 3)
    .attr("x2", xScale(data[data.length - 3].date) + 10)
    .attr("y2", yScale(data[data.length - 3].min_temp_F) + 20)
    .attr("stroke", "green")
    .attr("stroke-width", 2);

  innerChart
    .append("text")
    .text("maximum temp")
    .attr("x", xScale(data[data.length - 4].date) + 13)
    .attr("y", yScale(data[data.length - 4].max_temp_F) - 20)
    .attr("fill", "green");

  innerChart
    .append("line")
    .attr("x1", xScale(data[data.length - 4].date))
    .attr("y1", yScale(data[data.length - 4].max_temp_F) - 3)
    .attr("x2", xScale(data[data.length - 4].date) + 10)
    .attr("y2", yScale(data[data.length - 4].max_temp_F) - 20)
    .attr("stroke", "green")
    .attr("stroke-width", 2);
};
