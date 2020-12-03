import { useState, useRef, createRef, useContext, useEffect } from "react";
import { parseNum } from "../../../lib/math";
import { formatRanges, spliceOutCopy } from "../../../lib/utility";
import { getDefaultFilters } from "../../../lib/map/filter";
import utilStyles from "../../../styles/utils.module.css";
import MapContext from "../context";

const FilterView = () => {
  const { filters, activeFilters, setState, refreshMap } = useContext(
    MapContext
  );
  const rangeInputMin = useRef(filters.map((filter) => createRef()));
  const rangeInputMax = useRef(filters.map((filter) => createRef()));
  const [filterExpandedState, setFilterExpandedState] = useState(
    filters.map(() => true)
  );

  const setActiveFilters = (update) => {
    const updatedFilterState = { ...activeFilters, ...update };
    setState({ activeFilters: updatedFilterState });
    refreshMap({ type: "filter", update: updatedFilterState });
  };

  useEffect(() => setActiveFilters(getDefaultFilters(filters)), [
    filters.length,
  ]);

  const updateFilter = (filterName, opt) => {
    const filterState = activeFilters[filterName];
    setActiveFilters({
      [filterName]:
        filterState?.indexOf(opt) > -1
          ? spliceOutCopy(filterState, filterState.indexOf(opt))
          : [...filterState, opt],
    });
  };

  const selectAll = (filter) => {
    if (activeFilters[filter.name].length !== filter.options.length) {
      setActiveFilters({ [filter.name]: filter.options });

      if (["range", "date"].indexOf(filter.type) > -1) {
        const filterIndex = Object.keys(activeFilters).findIndex(
          (fName) => fName === filter.name
        );
        rangeInputMin.current[filterIndex].current.value = "";
        rangeInputMax.current[filterIndex].current.value = "";
      }
    } else {
      setActiveFilters({ [filter.name]: [] });
    }
  };

  return (
    <form className={utilStyles.fillFull}>
      {filters.map((filter, i) => {
        let ranges;
        if (filter.type === "date") {
          ranges = formatRanges(filter.options, true);
        } else if (filter.type === "range") {
          ranges = formatRanges(filter.options, false);
        }
        return (
          <fieldset>
            <h2
              onClick={(e) => {
                e.preventDefault();
                setFilterExpandedState([
                  ...filterExpandedState.slice(0, i),
                  !filterExpandedState[i],
                  ...filterExpandedState.slice(i + 1),
                ]);
              }}
            >
              {filter.alias ? filter.alias : filter.name}
            </h2>
            <ul style={filterExpandedState[i] ? {} : { display: "none" }}>
              <li key="selectAll">
                <input
                  type="checkbox"
                  checked={
                    activeFilters[filter.name]?.length ===
                    filter?.options.length
                  }
                  id={`${filter.id}-select-all`}
                  value={"SelectAll"}
                  onChange={() => selectAll(filter)}
                />
                <label htmlFor={`${filter.id}-select-all`}>Select All</label>
              </li>
              {filter.options.map((opt, idx) => (
                <li key={`${filter.name}-${idx}`}>
                  <input
                    type="checkbox"
                    checked={activeFilters[filter.name]?.indexOf(opt) > -1}
                    id={filter.id + "-" + idx}
                    value={opt}
                    name={filter.name}
                    onChange={(e) => {
                      updateFilter(filter.name, opt);
                      if (
                        ["range", "date"].indexOf(filter.type) > -1 &&
                        e.target.checked &&
                        rangeInputMin.current[idx].current &&
                        rangeInputMax.current[idx].current
                      ) {
                        rangeInputMin.current[idx].current.value = "";
                        rangeInputMax.current[idx].current.value = "";
                      }
                    }}
                  />
                  <label htmlFor={filter.id + "-" + idx}>
                    {["category", "multiCategory"].indexOf(filter.type) > -1
                      ? opt
                      : ranges[idx]}
                  </label>
                </li>
              ))}
            </ul>
            {["date", "range"].indexOf(filter.type) > -1 ? (
              <div style={{ marginTop: "0.25rem" }}>
                <input
                  type="text"
                  ref={rangeInputMin.current[i]}
                  placeholder={"min"}
                  size={8}
                />
                <p style={{ margin: 0, padding: 0 }}>to</p>
                <input
                  type="text"
                  size={8}
                  ref={rangeInputMax.current[i]}
                  placeholder={"max"}
                />
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveFilters({
                      [filter.name]:
                        filter.type === "date"
                          ? [
                              [
                                Date.parse(
                                  rangeInputMin.current[i].current.value
                                ),
                                Date.parse(
                                  rangeInputMax.current[i].current.value
                                ),
                              ],
                            ]
                          : [
                              [
                                parseNum(
                                  rangeInputMin.current[i].current.value
                                ),
                                parseNum(
                                  rangeInputMax.current[i].current.value
                                ),
                              ],
                            ],
                    });
                  }}
                >
                  Go
                </button>
              </div>
            ) : (
              <></>
            )}
          </fieldset>
        );
      })}
    </form>
  );
};

export default FilterView;
