import { select, selectAll } from "d3-selection";
import { brushX } from "d3-brush";

import { transition } from "d3-transition  ";
import { geoPath, geoEqualEarth, geoMercator, geoGraticule } from "d3-geo";
import { max, min } from "d3-array";
import { countryColorScale, getCityRadius } from "./scales";
import { drawLegend } from "./legend";
import { zoom, zoomIdentity } from "d3-zoom";
import { scaleLinear } from "d3-scale";
import { axisBottom } from "d3-axis";
import { format } from "d3-format";

export const drawWorldMap = (laureates, world) => {
  const cities = [];

  laureates.forEach((laureate) => {
    if (laureate.birth_country !== "" && laureate.birth_city !== "") {
      const relatedCity = cities.find(
        (city) =>
          city.city === laureate.birth_city &&
          city.country === laureate.birth_country,
      );

      if (relatedCity) {
        relatedCity.laureates.push(laureate);
      } else {
        cities.push({
          city: laureate.birth_city,
          country: laureate.birth_country,
          latitude: laureate.birt_city_latitude,
          longitude: laureate.birt_city_longitude,
          laureates: [laureate],
        });
      }
    }
  });

  console.log(cities);

  world.features.forEach((country) => {
    const props = country.properties;
    props.laureates = laureates.filter(
      (laureate) => laureate.birth_country === props.name,
    );
  });

  console.log(world);
  const width = 1230;
  const height = 620;

  const svg = select("#map")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const projection = geoEqualEarth()
    .translate([width / 2, height / 2])
    .scale(220);

  const geoPathGenerator = geoPath().projection(projection);

  const graticuleGenerator = geoGraticule();

  const graticules = svg
    .append("g")
    .attr("fill", "transparent")
    .attr("stroke", "#09131b")
    .attr("stroke-opacity", 0.2);

  graticules
    .append("path")
    .datum(graticuleGenerator)
    .attr("d", geoPathGenerator);

  graticules
    .append("path")
    .datum(graticuleGenerator.outline)
    .attr("d", geoPathGenerator);

  const showTooltip = (text) => {
    select("#map-tooltip").text(text).transition().style("opacity", 1);
  };
  const hideTooltip = () => {
    select("#map-tooltip").transition().style("opacity", 0);
  };

  let isCountryMap = true;

  svg
    .selectAll(".country-path")
    .data(world.features)
    .join("path")
    .attr("class", "country-path")
    .attr("d", geoPathGenerator)
    // .attr("fill", "#f8fcff")
    .attr("stroke", "#09131b")
    .attr("stroke-opacity", 0.4);

  //   svg
  //     .selectAll(".country-path")
  //     .data(world.features)
  //     .join("path")
  //     .attr("class", "country-path")
  //     .attr("d", geoPathGenerator).attr

  //   svg.selectAll('.country-path').data(world.features).join('path').attr('class', 'country-path').attr('d', geoPathGenerator).attr('stroke', '#09131b').attr(str)

  const minYear = min(laureates, (d) => d.year);
  const maxYear = max(laureates, (d) => d.year);

  let brushMin = minYear;
  let brushMax = maxYear;

  const maxLaureatsPerCity = max(cities, (d) => d.laureates.length);

  const updateCountryFills = () => {
    const selectedData = JSON.parse(JSON.stringify(world.features));
    selectedData.forEach((d) => {
      if (d.properties.laureates) {
        d.properties.laureates = d.properties.laureates.filter(
          (l) => l.year >= brushMin && l.year <= brushMax,
        );
      }
    });

    selectAll(".country-path")
      .data(selectedData)
      .on("mouseenter", (e, d) => {
        const p = d.properties;
        const lastWord = p.laureates.length > 1 ? "laureates" : "laureate";
        const text = `${p.name}, ${p.laureates.length} ${lastWord}`;
        showTooltip(text);
        //   console.log(p);
      })
      .on("mouseleave", hideTooltip)
      .transition()
      .attr("fill", (d) =>
        d.properties.laureates.length > 0
          ? countryColorScale(d.properties.laureates.length)
          : "#f8fcff",
      );
  };

  const updateCityCircles = () => {
    // console.log(cities);
    // console.log("test");

    const selectedData = JSON.parse(JSON.stringify(cities));
    selectedData.forEach((city) => {
      city.laureates = city.laureates.filter(
        (l) => l.year >= brushMin && l.year <= brushMax,
      );
    });
    selectAll(".circle-city")
      .data(selectedData)
      .on("mouseenter", (e, d) => {
        const lastWord = d.laureates.length > 1 ? "laureates" : "laureate";
        const text = `${d.city}, ${d.laureates.length} ${lastWord}`;
        showTooltip(text);
      })
      .on("mouseleave", hideTooltip)
      .transition()
      .attr("r", (d) => getCityRadius(d.laureates.length, maxLaureatsPerCity));
    //   .attr("r", (d) => d.laureates.length);

    // console.log(getCityRadius(10, maxLaureatsPerCity));
  };
  const displayCountries = () => {
    isCountryMap = true;

    selectAll(".circle-city")
      .transition()
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .remove();

    updateCountryFills();

    select(".legend-cities").style("display", "none");
    select(".legend-countries").style("display", "flex");
  };

  const dispalyCities = () => {
    // console.log("test");
    isCountryMap = false;

    selectAll(".country-path")
      .on("mouseenter", null)
      .on("leave", null)
      .transition()
      .attr("fill", "#f8fcff");

    svg
      .selectAll(".circle-city")
      .data(cities)
      .join("circle")
      .attr("class", "circle-city")
      .attr("cx", (d) => {
        // console.log(projection([d.longitude, d.latitude])[0]);
        return projection([d.longitude, d.latitude])[0];
      })
      .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
      //   .attr("r", (d) => getCityRadius(d.laureates.length, maxLaureatsPerCity))
      .attr("fill", "#35a7c2")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "#35a7c2");

    updateCityCircles();
    select(".legend-countries").style("display", "none");
    select(".legend-cities").style("display", "block");
  };

  drawLegend(maxLaureatsPerCity);

  selectAll("input#countries, input#cities").on("click", (e) => {
    if (e.target.id === "countries") {
      displayCountries();
    } else if (e.target.id === "cities") {
      //   console.log("test");
      dispalyCities();
    }
  });

  displayCountries();

  const zoomHandler = zoom()
    .scaleExtent([1, 5])
    .translateExtent([
      [-width / 2, -height / 2],
      [(3 * width) / 2, (3 * height) / 2],
    ])
    .on("zoom", (e) => {
      console.log(e);
      svg.attr("transform", e.transform);

      if (select("#map-reset").classed("hidden")) {
        select("#map-reset").classed("hidden", false);
      }
      if (e.transform.k === 1 && e.transform.x === 0 && e.transform.y === 0) {
        select("#map-reset").classed("hidden", true);
      }
    });

  select(".map-container").call(zoomHandler);

  select("#map-reset")
    .attr("class", "hidden")
    .on("click", () => {
      select(".map-container")
        .transition()
        .call(zoomHandler.transform, zoomIdentity);
    });

  const tlWidth = 1000;
  const tlHeight = 80;
  const tlMargin = { top: 0, right: 10, bottom: 0, left: 0 };
  const tlInnerWidth = tlWidth - tlMargin.right - tlMargin.left;

  const xScale = scaleLinear()
    .domain([minYear, maxYear])
    .range([0, tlInnerWidth]);

  const yearsSelector = select("#years-selector")
    .append("svg")
    .attr("viewBox", `0 0 ${tlWidth} ${tlHeight}`);

  const xAxisGenerator = axisBottom(xScale)
    .tickFormat(format(""))
    .tickSizeOuter(0);

  yearsSelector
    .append("g")
    .attr("class", "axis-x")
    .attr("transform", `translate(0, 30)`)
    .call(xAxisGenerator);

  const handleBrush = (e) => {
    console.log(e);

    brushMin = Math.round(xScale.invert(e.selection[0]));
    brushMax = Math.round(xScale.invert(e.selection[1]));

    // console.log(brushMin, brushMax);

    if (isCountryMap) {
      updateCountryFills();
    } else {
      updateCityCircles();
    }
  };

  const brushHandler = brushX()
    .extent([
      [0, 0],
      [tlInnerWidth, tlHeight],
    ])
    .on("brush", handleBrush);
  yearsSelector
    .call(brushHandler)
    .call(brushHandler.move, [xScale(minYear), xScale(maxYear)]);
};
