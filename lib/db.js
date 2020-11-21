import { ObjectId } from "mongodb";
import { getSmallestGeography } from "./editor/guesses";
import { cascadeCounties, unique } from "./utility";
import stateMatchArray from "./stateMatch";
import * as topojson from "topojson";

//

export async function getMapById(req, _id) {
  let map = await req.db
    .collection("maps")
    .aggregate([
      {
        $match: { _id: ObjectId(_id) },
      },
      {
        $unwind: { path: "$features", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "geography",
          let: { id: "$features._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$id"],
                },
              },
            },
            {
              $replaceRoot: {
                newRoot: "$polygon",
              },
            },
          ],
          as: "features.geometry",
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          features: {
            properties: 1,
            geometry: { $arrayElemAt: ["$features.geometry", 0] },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          features: { $push: "$features" },
        },
      },
    ])
    .next();
  /*map["topojson"] = topojson.topology({
    featureCollection: {
      type: "FeatureCollection",
      features: map.features.reduce(
        (arr, feat) =>
          feat?.geometry ? [...arr, { type: "Feature", ...feat }] : arr,
        []
      ),
    },
  });*/
  map["geojson"] = {
    type: "FeatureCollection",
    features: map.features.reduce(
      (arr, feat) =>
        feat?.geometry ? [...arr, { type: "Feature", ...feat }] : arr,
      []
    ),
  };
  delete map["features"];
  return map;
}

export async function getMapsByUsername(req, username) {
  const maps = await req.db
    .collection("maps")
    .aggregate([
      {
        $match: {
          owner: { $eq: username },
          $or: [{ publish: true }],
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          owner: 1,
          thumbnail: 1,
          publish: 1,
          name: 1,
          tags: 1,
          description: 1,
        },
      },
    ])
    .toArray();
  return maps;
}

export async function getGeoids(req) {
  const { queries, codes } = req.body;
  let features = queries;
  const allGeographies = Object.keys(codes);
  const smallestGeography = getSmallestGeography(allGeographies);
  let stateType = codes.state;
  let states;
  let countyType = codes.county;
  let counties;

  let tractType;
  let tracts;

  if (smallestGeography === "zipcode") {
    const zipcodes = await req.db
      .collection("geography")
      .find(
        { GEOID: { $in: features.map((feat) => feat?.zipcode) } },
        { GEOID: 1 }
      )
      .toArray();
    return features.map((feat) =>
      zipcodes
        .find((zipcode) => zipcode.GEOID === feat?.zipcode)
        ["_id"]?.toString()
    );
  }
  if (smallestGeography === "country") {
    const countryType = codes.country;
    const countries = await req.db
      .collection("geography")
      .find(
        { [countryType]: { $in: features.map((feat) => feat?.country) } },
        { [countryType]: 1 }
      );
    return features.map((feat) =>
      countries
        .find((country) => country[countryType] === feat?.country)
        ["_id"]?.toString()
    );
  }

  if (smallestGeography === "state") {
    states = await req.db
      .collection("geography")
      .find(
        {
          [stateType]: { $in: features.map((feat) => feat?.state) },
          STUSPS: { $exists: true },
        },
        { [stateType]: 1 }
      )
      .toArray();
    return features.map((feat) =>
      states.find((state) => state[stateType] === feat?.state)?._id.toString()
    );
  }

  if (smallestGeography === "county") {
    features.forEach((feat) => {
      feat["STATEFP"] = stateMatchArray.find(
        (stateMatchObj) => stateMatchObj[stateType] === feat.state
      )?.STATEFP;
    });
    let groupedFeatures = cascadeCounties(features);
    counties = await req.db
      .collection("geography")
      .find(
        {
          $or: groupedFeatures.map((feat) => ({
            STATEFP: feat?.STATEFP,
            [countyType]: { $in: feat?.county },
            COUNTYFP: { $exists: true },
          })),
        },
        { STATEFP: 1, [countyType]: 1 }
      )
      .toArray();
    return features.map((feat) =>
      counties
        .find(
          (county) =>
            county[countyType] === feat.county &&
            county["STATEFP"] === feat?.STATEFP
        )
        ?._id.toString()
    );
  }
  if (codes.city) {
    cityType = codes.city;
    cities = await req.db
      .collection("geography")
      .find(
        {
          $or: features.map((feat, i) => ({
            STATEFP: feat?.STATEFP,
            [cityType]: feat?.city,
            GEOID: { $gt: 99999999 },
          })),
        },
        { STATEFP: 1, GEOID: 1, [cityType]: 1 }
      )
      .toArray();

    if (smallestGeography === "city") {
      return features.map((feat) =>
        cities.find((city) => city[cityType] === feat?.city)["_id"]?.toString()
      );
    } else {
      features.forEach((feat) => {
        feat["GEOID"] = cities.find(
          (city) =>
            city[cityType] === feat?.city && city.STATEFP === feat?.STATEFP
        )["GEOID"];
      });
    }
  }
  if (codes.tract) {
    tractType = codes.tract;
    tracts = await req.db
      .find(
        {
          $or: features.map((feat) => ({
            STATEFP: feat?.STATEFP,
            COUNTYFP: feat?.COUNTYFP,
            [tractType]: feat?.tract,
            NAMELSAD: { $regex: /Tract/ },
          })),
        },
        { STATEFP: 1, COUNTYFP: 1, [tractType]: 1, GEOID: 1 }
      )
      .toArray();

    return features.map((feat) =>
      tracts
        .find(
          (tract) =>
            tract[tractType] === feat?.tract &&
            tract.STATEFP === feat?.STATEFP &&
            tract.COUNTYFP === feat?.COUNTYFP
        )
        ["_id"]?.toString()
    );
  }
}

export async function saveMap(req, _id, updates) {
  await req.db.collection("maps").updateOne({ _id });
}

export async function deleteMap(req, _id) {
  const { deletedCount } = await req.db
    .collection("maps")
    .deleteOne({ _id: ObjectId(_id) });
  return deletedCount;
}

export async function getMapShellById(req, _id) {
  const mapShell = await req.db.collection("maps").findOne(
    { _id: ObjectId(_id) },
    {
      projection: {
        owner: 1,
        name: 1,
        thumbnail: 1,
        geography: 1,
        bounds: 1,
        tileLayer: 1,
        styles: 1,
        properties: 1,
        choropleths: 1,
        searchFields: 1,
        tags: 1,
        description: 1,
        filters: 1,
      },
    }
  );
  return mapShell ? { ...mapShell, _id: mapShell._id.toString() } : {};
}
