import { useContext, useRef } from "react";
import { useState } from "react";
import generalStyles from "../general.module.css";
import filterStyles from "./filterSettings.module.css";
import EditorContext from "../../context";
import { guessFilterType, getOptions } from "../../../../lib/editor/guesses";
import { unique, formatRanges } from "../../../../lib/utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
export default function FilterSettings({}) {
  const { editFunctions, filters, geojson, properties } = useContext(
    EditorContext
  );
  const [hoveringFilterIndex, setHoveringFilterIndex] = useState(null);
  const [addingFilter, setAddingFilter] = useState(false);
  const [deletingFilter, setDeletingFilter] = useState(false);
  const openFilterAdder = () => {
    setAddingFilter(true);
  };

  const filterSelectRef = useRef();
  const eligibleOtherFilters = properties.filter(
    (prop) =>
      filters.map((f) => f.name).indexOf(prop.name) === -1 &&
      ["url", "longText"].indexOf(prop.dataType) === -1
  );

  return (
    <>
      <div
        className={generalStyles.overlayContainer}
        style={{ display: addingFilter || deletingFilter ? "flex" : "none" }}
      >
        <div className={generalStyles.overlayBox}>
          <p>
            {addingFilter
              ? "Select the name of the field to add as a filter option"
              : `Really delete "${deletingFilter}" filter?`}
          </p>
          {addingFilter ? (
            <select ref={filterSelectRef} name="filterName" id="">
              {eligibleOtherFilters.map((c) => (
                <option value={c.name}>{c.name}</option>
              ))}
            </select>
          ) : (
            <></>
          )}
          <button
            onClick={() => {
              if (addingFilter) {
                const filterToAdd = filterSelectRef.current.value;
                const filterProp = properties.find(
                  (prop) => prop.name === filterToAdd
                );

                editFunctions("filters").add(
                  guessFilter(
                    filterToAdd,
                    properties.find((prop) => prop.name === filterToAdd)
                      .dataType,
                    unique(
                      geojson.features.map(
                        (feat) => feat.properties[filterToAdd]
                      )
                    )
                  )
                );
                setAddingFilter(false);
              } else {
                editFunctions("filters").remove({
                  index: filters.findIndex(
                    (filter) => filter.name === deletingFilter
                  ),
                });
                setDeletingFilter(false);
              }
            }}
          >
            {addingFilter ? "Add" : "Delete"}
          </button>
          <button
            onClick={() =>
              addingFilter ? setAddingFilter(false) : setDeletingFilter(false)
            }
          >
            Cancel
          </button>
        </div>
      </div>
      <ul>
        {filters.map((filter, i) => (
          <li
            onMouseOver={() => setHoveringFilterIndex(i)}
            onMouseOut={() => setHoveringFilterIndex(null)}
            key={`${filter.name}-filter-${i}`}
            className={filterStyles.filterContainer}
          >
            <div className={filterStyles.filterBlock}>
              <h3>{filter.name}</h3>
              <table className={filterStyles.filterTable}>
                <tr>
                  <th className={filterStyles.thead}>Type</th>
                  <td className={filterStyles.tDat}>{filter.type}</td>
                </tr>
                <tr>
                  <th className={filterStyles.thead}>Options</th>
                  <td className={filterStyles.tDat}>
                    <ul style={{ paddingLeft: 0 }}>
                      {["date", "range"].indexOf(filter.type) > -1
                        ? formatRanges(
                            filter.options,
                            filter.type === "date"
                          ).map((range, ind) => (
                            <li key={`${filter.name}-opt-${ind}`}>{range}</li>
                          ))
                        : filter.options.map((opt, index) => (
                            <li key={`${filter.name}-opt-${index}`}>{opt}</li>
                          ))}
                    </ul>
                  </td>
                </tr>
              </table>
            </div>
            <FontAwesomeIcon
              icon={faTrashAlt}
              className={filterStyles.deleteIcon}
              onClick={() => setDeletingFilter(filters[i].name)}
              style={hoveringFilterIndex === i ? {} : { visibility: "hidden" }}
            />
          </li>
        ))}
      </ul>
      <button
        className={filterStyles.addFilterBlock}
        onClick={() => openFilterAdder()}
        style={{ cursor: "pointer" }}
      >
        Add a filter
      </button>
    </>
  );
}
