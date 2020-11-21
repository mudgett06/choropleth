import axios from "axios";

export default function getGeoid(feature, geographies) {
  let endpoint;
  const query = features.map((feat) => {
    const geoField = geographies[geoType];
    switch (geoType) {
      case "country":
        endpoint = "countries";
        return feat.properties[geoField];
      case "state":
        endpoint = "states";
        return feat.properties[geographies["state"]] === "Virginia"
          ? "VA"
          : feat.properties[geoField];

      case "county":
      case "city":
        endpoint = geoType === "county" ? "counties" : "cities";
        return geographies["state"]
          ? feat.properties[geoField] +
              " " +
              feat.properties[geographies["state"]]
          : feat.properties[geoField];
      case "zipcode":
        endpoint = "zips";
        return int(feat.properties[geoField]);
      case "tract":
        endpoint = "tracts";
        return geographies["state"] && geographies["county"]
          ? feat.properties[geoField] +
              " " +
              feat.properties[geographies["county"]] +
              " " +
              feat.properties[geographies["state"]]
          : int(feat.properties[geoField]);
      default:
        return feat.properties[geoField];
    }
  });
  axios
    .get(`/api/geometry/${endpoint}/`, {
      params: { query: JSON.stringify(query) },
    })
    .then((res) => {
      returnObj = res.data;
    });
  return returnObj;
}
