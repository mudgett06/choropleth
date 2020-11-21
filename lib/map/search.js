import * as JsSearch from "js-search";

export function formatFeatures(features, properties) {
  features.map((feat) =>
    Object.keys(feat.properties).reduce(
      (obj, prop) => ({
        [properties[prop]?.alias || prop]: feat[prop],
      }),
      {}
    )
  );
}

export default function setupSearch(searchFields, features) {
  const search = new JsSearch.Search(searchFields[0]);

  search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

  searchFields.slice(1).forEach((field) => search.addIndex(field));

  search.addDocuments(features);
  search.identifier = searchFields[0];
  return search;
}

export function getResults(search, query) {
  return search.search(query).map((res) => {
    return Object.keys(res).reduce(
      (obj, k) => {
        if (
          res[k] &&
          res[k].toString().toLowerCase().indexOf(query.toLowerCase()) > -1 &&
          search._searchableFields.map((field) => field).indexOf(k) > -1
        ) {
          return { ...obj, [k]: res[k] };
        } else return obj;
      },
      { [search.identifier]: res[search.identifier] }
    );
  });
}
