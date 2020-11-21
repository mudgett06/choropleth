import { useContext, useState } from "react";
import styles from "./sidebar.module.css";
import utilStyles from "../../../styles/utils.module.css";
import setupSearch, { getResults } from "../../../lib/map/search";
import MapContext from "../context";

const SearchView = () => {
  const { leafletMapLayers, geography, searchFields, properties } = useContext(
    MapContext
  );
  const [results, setResults] = useState({ query: "", results: [] });
  const identifyingField = properties.find(
    (prop) => prop.geography.type === geography.type
  )?.name;
  const fireEvent = (feat, type) => {
    leafletMapLayers
      .find(
        (layer) =>
          layer.feature.properties[identifyingField] === feat[identifyingField]
      )
      .fire(type);
  };
  const search = setupSearch(
    searchFields,
    leafletMapLayers.map((layer) => layer.feature.properties)
  );

  return (
    <>
      <input
        type="text"
        size={15}
        onChange={(e) => {
          setResults({
            query: e.target.value,
            results: getResults(search, e.target.value),
          });
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {results.results.map((res) => {
          return (
            <div
              className={styles.nameBlock}
              onMouseOver={() => {
                fireEvent(res, "mouseover");
              }}
              onMouseOut={() => {
                fireEvent(res, "mouseout");
              }}
              onClick={() => {
                fireEvent(res, "click");
              }}
            >
              <h2>{res[identifyingField]}</h2>
              {Object.keys(res)
                .filter((field) => field !== identifyingField)
                .map((k) => {
                  const highlightIndex = res[k]
                    .toString()
                    .toLowerCase()
                    .indexOf(results.query.toLowerCase());
                  const highlightLength = results.query.length;
                  const resultString = res[k].toString();
                  return (
                    <div className={styles.dataPair}>
                      <h3>{k}</h3>
                      {highlightIndex > -1 ? (
                        <p>
                          {resultString.slice(0, highlightIndex)}
                          <span className={utilStyles.hightlight}>
                            {resultString.slice(
                              highlightIndex,
                              highlightIndex + highlightLength
                            )}
                          </span>
                          {resultString.slice(highlightIndex + highlightLength)}
                        </p>
                      ) : (
                        <p>{resultString}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SearchView;
