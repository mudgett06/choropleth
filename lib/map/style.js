import { rangeIndex } from "../math";
import schemes from "../hex_schemes";

export function getChoroplethColor(feature, choropleth) {
  if (!choropleth) {
    return "#fff";
  }
  const colors =
    schemes[choropleth.schemeName]?.ramps[choropleth.options?.length] || [];
  if (choropleth.type === "multiCategory") {
    return `linearGradient(0deg,${(feature.properties[choropleth.name] || "N/A")
      .split(/, ?/)
      .map(
        (prop) => colors[rangeIndex(prop, choropleth.options, choropleth.type)]
      )
      .reduce((res, color, index, arr) => {
        const increment = Math.floor(100 / arr.length);

        if (index === 0) {
          return [`${color} ${increment}%`];
        } else if (index == arr.length - 1) {
          return [...res, `${color} ${100 - increment + 1}%`];
        } else {
          return [
            ...res,
            `${color} ${increment * index + 1}%`,
            `${color} ${increment * (index + 1)}%`,
          ];
        }
      }, [])})`;
  } else {
    const colorIndex = rangeIndex(
      choropleth.type === "date"
        ? Date.parse(
            feature.properties[choropleth.name].toString().replace(/\b-/g, "/")
          ) || "N/A"
        : feature.properties[choropleth.name] || "N/A",
      choropleth.options,
      choropleth.type
    );
    return colorIndex > -1 ? colors[colorIndex] : "#fff";
  }
}

export function styleClosure(activeChoropleth, defaultStyle) {
  if (activeChoropleth) {
    return function (feature) {
      return {
        ...defaultStyle,
        fillColor: getChoroplethColor(feature, activeChoropleth),
      };
    };
  } else {
    return defaultStyle;
  }
}
