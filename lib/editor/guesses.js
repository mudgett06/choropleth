import { unique, spliceOutCopy } from "../utility";
import axios from "axios";
import { subrange } from "../math";
import { toProperCase } from "../utility";

String.prototype.toProperCase = toProperCase;

export function guessDataType(uniqueData) {
  if (!uniqueData) {
    return null;
  }
  if (uniqueData.every((feat) => typeof feat === Boolean)) {
    return "boolean";
  } else if (uniqueData.every((feat) => typeof feat === Number)) {
    return "number";
  } else if (
    uniqueData.every((feat) => !feat || /\d/.test(feat)) &&
    uniqueData.reduce(
      (avg, feat, i) =>
        (avg * i +
          feat
            ?.toString()
            .split(/([^0-9,.]|,(?!\d{3})|\.(?!\d))+/g)
            .filter((s) => /\d/.test(s))
            .map((n) => parseFloat(n)).length) /
        (i + 1)
    ) > 1
  ) {
    return "range";
  } else if (
    uniqueData.filter(
      (feat) =>
        !feat ||
        (Date.parse(feat.toString().replace(/\b-/g, "/")) > -8520318238000 &&
          Date.parse(feat.toString().replace(/\b-/g, "/")) < 4131579600000)
    ).length /
      uniqueData.length >
    0.8
  ) {
    return "date";
  } else if (
    uniqueData.some((feat) => /,(?!\d{3})\s?|;\s?/.test(feat)) &&
    unique(
      uniqueData
        .filter((x) => x)
        .map((feat) => feat.split(/,(?!\d{3})\s?|;\s?/))
        .flat()
    ).length < uniqueData.length
  ) {
    return "list";
  } else if (uniqueData.every((feat) => !feat || /\d/.test(feat))) {
    return "number";
  } else if (
    uniqueData.every(
      (feat) =>
        !feat ||
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
          feat
        )
    )
  ) {
    return "url";
  } else if (uniqueData.some((feat) => feat && feat.length > 50)) {
    return "longText";
  } else {
    return "text";
  }
}

export function getOptions(type, uniqueData, n = 4) {
  if (!uniqueData) {
    return [];
  }
  let res;
  switch (type) {
    case "category":
    case "multiCategory":
      let options = uniqueData.map((x) => x?.toString());
      if (uniqueData.every((x) => parseFloat(x))) {
        options.sort((a, b) => {
          Number(a.match(/[\d,.]+/g)[0].replace(",", "")) -
            Number(b.match(/[\d,.]+/g)[0].replace(",", ""));
        });
      }
      res = options;
      break;
    case "range":
      res = subrange(
        unique(
          uniqueData
            .map((item) => item?.toString().split(/\s?(to|through|-)\s?/))
            .flat()
        ),
        n
      ).filter((x) => x);
      break;
    case "date":
      res = subrange(uniqueData, n, "symmetric", true);
      break;
  }
  return uniqueData?.length
    ? uniqueData.some((x) => !x)
      ? ["N/A", ...res.filter((x) => x || x === 0)]
      : res
    : [];
}

const guessType = (dataType, uniqueValues) => {
  switch (dataType) {
    case "date":
      return "date";
    case "range":
    case "number":
      if (uniqueValues.length > 9) {
        return "range";
      } else {
        return "category";
      }
    case "list":
      return "multiCategory";
    default:
      return "category";
  }
};

export function guessFilter(name, dataType, uniqueValues) {
  const type = guessType(dataType, uniqueValues);
  return {
    options: getOptions(type, uniqueValues, 4),
    type,
    name,
  };
}

export function guessChoropleth(name, dataType, uniqueValues) {
  const type = guessType(dataType, uniqueValues);
  return {
    name,
    type,
    options: getOptions(type, uniqueValues, 8),
    schemeName: ["date", "range"].indexOf(type) > -1 ? "Blues" : "Set1",
  };
}

export async function guessMapData(fileName, data, username) {
  let uniqueColumns = data.reduce((obj, feat) => {
    Object.keys(feat).forEach((propName) => {
      if (!obj[propName]) {
        obj[propName] = [];
      }
      if (obj[propName].indexOf(feat[propName]) === -1) {
        obj[propName].push(feat[propName]);
      }
    });
    return obj;
  }, {});

  const propertyNames = Object.keys(uniqueColumns);

  let properties = propertyNames.reduce(
    (arr, propName, i) => [
      ...arr,
      {
        name: propName,
        dataType: guessDataType(uniqueColumns[propName]),
        geography: guessGeography(propName, uniqueColumns[propName]),
        alias: null,
        active: true,
      },
    ],
    []
  );

  properties.forEach((prop) => {
    if (prop.dataType === "range") {
      uniqueColumns[prop.name] = unique(
        uniqueColumns[prop.name]
          .map((feat) =>
            feat
              ?.toString()
              .split(/([^0-9,.]|,(?!\d{3})|\.(?!\d))+/g)
              .filter((s) => /\d/.test(s))
              .map((n) => parseFloat(n))
          )
          .flat()
      );
    } else if (prop.dataType === "list") {
      uniqueColumns[prop.name] = unique(
        uniqueColumns[prop.name]
          .filter((x) => x)
          .map((feat) => feat.split(/,(?!\d{3})\s?|;\s?/))
          .flat()
      );
    }
  });

  const identifierIndex = properties.findIndex(
    (prop) =>
      prop.geography.type ===
      getSmallestGeography(properties.map((prop) => prop.geography?.type))
  );

  const geography = properties[identifierIndex].geography.type;

  properties[identifierIndex].identifier = true;

  const styles = {
    fillColor: "#1979A9",
    fillOpacity: 0.7,
    color: "black",
    weight: 1.5,
  };

  const codes = properties.reduce(
    (obj, prop) =>
      prop.geography
        ? { ...obj, [prop.geography.type]: prop.geography.code }
        : obj,
    {}
  );
  const queries = data.map((feat) =>
    properties.reduce(
      (obj, prop) =>
        prop.geography
          ? { ...obj, [prop.geography.type]: feat[prop.name] }
          : obj,
      {}
    )
  );

  let features;

  await axios.post("/api/geometry", { codes, queries }).then((res) => {
    features = data.map((feat, i) => ({
      properties: feat,
      _id: res.data[i],
    }));
  });

  const { filters, choropleths } = properties.reduce(
    (obj, prop) => {
      const columnData = uniqueColumns[prop.name];
      if (
        prop.geography?.type ||
        ["longText", "url"].indexOf(prop.dataType) > -1 ||
        (prop.dataType === "text" && columnData.length > 10)
      ) {
        return obj;
      } else {
        obj.filters.push(guessFilter(prop.name, prop.dataType, columnData));
        obj.choropleths.push(
          guessChoropleth(prop.name, prop.dataType, columnData)
        );
        return obj;
      }
    },
    { filters: [], choropleths: [] }
  );
  return {
    name: fileName.toProperCase().replace(/\.(xlsx?|csv)/i, ""),
    owner: username,
    created: Date.now(),
    properties,
    features,
    choropleths: choropleths.filter((ch) => ch.options.length > 1),
    filters: filters.filter((fil) => fil.options.length > 1),
    styles,
    description: "",
    tags: [],
    geography: { type: geography, shape: "polygon" },
    searchFields: [
      properties.find((prop) => prop.identifier).name,
      ...spliceOutCopy(
        propertyNames,
        properties.findIndex((prop) => prop.identifier)
      ),
    ],
    tileLayer: {
      url:
        "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}",
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abcd",
      ext: "png",
      labels: false,
    },
    publish: true,
  };
}

export function guessGeography(header, data) {
  const matches = [
    /country|iso/gi,
    /\bstate|STNAME/gi,
    /county/gi,
    /zip|postal|zcta/gi,
    /address/gi,
    /(?!.*lo?ng)\blat(?<!lo?ng.*)/gi,
    /(?!.*lat)\blo?ng(?<!lat.*)/gi,
    /coord|long(?=.*lat)|lat(?=.*lo?ng)/gi,
    /tract/gi,
    /(\bfips|geoid)/gi,
  ].map((re) => re.test(header));
  let type;
  switch (matches.indexOf(true)) {
    case 0:
      type = "country";
      break;
    case 1:
      type = "state";
      break;
    case 2:
      type = "county";
      break;
    case 3:
      type = "zipcode";
      break;
    case 4:
      type = "address";
      break;
    case 5:
      type = "latitude";
      break;
    case 6:
      type = "longitude";
      break;
    case 7:
      type = "coordinates";
      break;
    case 8:
      type = "tract";
      break;
    case 9:
      const avgFipsLength = Math.round(
        data
          .slice(0, 50)
          .reduce((avg, feat, i) => (avg * i + feat.length) / (i + 1), 0)
      );
      switch (avgFipsLength) {
        case 1:
        case 2:
          type = "state";
          break;
        case 4:
        case 5:
          type = "county";
          break;
        case 10:
          type = "city";
          break;
        case 11:
          type = "tract";
          break;
      }
      break;
    default:
      type = null;
      break;
  }
  let code;
  switch (type) {
    case "country":
      code = data.some((country) => country.length > 3) ? "ISO_A3" : "ADMIN";
      break;
    case "state":
      code = data.some((state) => state?.toString().length > 2)
        ? "NAME"
        : data.some((state) => /\d{2}/.test(state?.toString()))
        ? "STATEFP"
        : "STUSPS";
      break;
    case "county":
      code = data.some((county) => /\d{4,5}/.test(county?.toString() || ""))
        ? "GEOID"
        : data.some((county) => /county/gi.test(county))
        ? "NAMELSAD"
        : "NAME";
      break;
    case "city":
      code = data.some((city) => /\d{9,10}/.test(city.toString()))
        ? "GEOID"
        : data.every((city) => /township|borough|CCD|city/gi.test(city))
        ? "NAMELSAD"
        : "NAME";
      break;
    case "tract":
      code = data.some((city) => /\d{10,11}/gi.test(city.toString()))
        ? "GEOID"
        : data.some((city) => /tract/gi.test(city))
        ? "NAMELSAD"
        : "NAME";
      break;
    default:
      code = null;
      break;
  }
  return type && code ? { type, code } : null;
}

export function getSmallestGeography(geographies) {
  const geoOptions = ["tract", "zipcode", "county", "state", "country"];
  return geographies.length
    ? geographies
        .filter((geo) => geoOptions.includes(geo))
        .sort(function (a, b) {
          if (geoOptions.indexOf(a) < geoOptions.indexOf(b)) {
            return -1;
          }
          if (geoOptions.indexOf(a) > geoOptions.indexOf(b)) {
            return 1;
          }
          // a must be equal to b
          return 0;
        })[0]
    : null;
}
