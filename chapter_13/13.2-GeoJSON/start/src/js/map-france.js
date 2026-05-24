import * as topojson from "topojson-client";
import { select } from "d3-selection";
import { geoMercator, geoPath } from "d3-geo";

export const drawFranceMap = (laureates, france) => {
  let departments = topojson.feature(france, france.objects.FRA_adm2).features;
  let borders = topojson.mesh(france, france.objects.FRA_adm2);

  const width = 800;
  const height = 800;

  const projection = geoMercator().scale(3000).translate([280, 3150]);

  const geoPathGenerator = geoPath().projection(projection);

  const svg = select("#map-france")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  svg
    .selectAll(".department")
    .data(departments)
    .join("path")
    .attr("class", "department")
    .attr("d", (d) => geoPathGenerator(d))
    .attr("fill", "#f8fcff");

  svg
    .append("path")
    .attr("class", "departments-borders")
    .attr("d", geoPathGenerator(borders))
    .attr("fill", "none")
    .attr("stroke", "#09131b")
    .attr("stroke-opacity", 0.4);

  const onlyFrance = laureates.filter((c) => {
    return c.birth_country == "France";
  });

  console.log(onlyFrance);

  const cityCounts = {};

  onlyFrance.forEach((element) => {
    if (cityCounts[element["birth_city"]]) {
      cityCounts[element["birth_city"]] += 1;
    } else {
      cityCounts[element["birth_city"]] = 1;
    }
  });
  console.log(cityCounts);

  svg
    .selectAll(".french-l")
    .data(onlyFrance)
    .join("circle")
    .attr("class", "french-l")
    .attr(
      "cx",
      (d) => projection([d.birt_city_longitude, d.birt_city_latitude])[0],
    )
    .attr(
      "cy",
      (d) => projection([d.birt_city_longitude, d.birt_city_latitude])[1],
    )
    .attr("r", 10);
};
