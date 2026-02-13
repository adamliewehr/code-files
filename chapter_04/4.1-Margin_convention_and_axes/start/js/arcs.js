// Load the data here
d3.csv("./data/daily_precipitations.csv", d3.autoType).then((data) => {
  console.log(data);
  drawArc(data);
});

// Draw the arc here
const drawArc = (data) => {
  const pieChartWidth = 300;
  const pieChartHeight = 300;
  const svg = d3
    .select("#arc")
    .append("svg")
    .attr("viewBox", [0, 0, pieChartWidth, pieChartHeight])
    .style("border", "1px solid black");

  const innerChart = svg
    .append("g")
    .attr(
      "transform",
      `translate(${pieChartWidth / 2}, ${pieChartHeight / 2})`,
    );

  const numberOfDays = data.length;
  const numberOfDaysWithPrecip = data.filter(
    (d) => d.total_precip_in > 0,
  ).length;

  const percentageDaysWithPrecip = Math.round(
    (numberOfDaysWithPrecip / numberOfDays) * 100,
  );

  // calculating the angle by multiplying percent by multiplying it by 360
  //   also to radians by multiply the angle by precentage of days with precip in degrees by pi, and devide it by 180

  const angleDaysWithPrecip_deg = (percentageDaysWithPrecip * 360) / 100;
  const angleDaysWithPrecip_rad = (angleDaysWithPrecip_deg * Math.PI) / 180;
  // we need to do rads since most functions in d3 use radians

  // arc gen

  const arcGenerator = d3
    .arc()
    .innerRadius(80)
    .outerRadius(120)
    .padAngle(0.02) // pads the end of the arc
    .cornerRadius(6); // rounds corners

  innerChart
    .append("path")
    .attr("d", () => {
      return arcGenerator({ startAngle: 0, endAngle: angleDaysWithPrecip_rad });
    })
    .attr("fill", "blue");
  innerChart
    .append("path")
    .attr("d", () => {
      return arcGenerator({
        startAngle: angleDaysWithPrecip_rad,
        endAngle: 2 * Math.PI,
      });
    })
    .attr("fill", "gray");

  // uses polar cord system

  const centroid = arcGenerator
    .startAngle(0)
    .endAngle(angleDaysWithPrecip_rad)
    .centroid(); // calculates the midpoint of the arc

  svg
    .select("g")
    .append("text")
    .text((d) => d3.format(".0%")(percentageDaysWithPrecip / 100))
    .attr("x", centroid[0])
    .attr("y", centroid[1])
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "white")
    .style("font-weight", 500);
};
