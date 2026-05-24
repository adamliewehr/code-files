import { scaleRadial, scaleSequential } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";

export const countryColorScale = scaleSequential(interpolateYlGnBu).domain([
  1, 100,
]);

export const getCityRadius = (numLaureates, maxLaureats) => {
  const cityRadiusScale = scaleRadial().domain([0, maxLaureats]).range([0, 25]);
  return cityRadiusScale(numLaureates);
};
