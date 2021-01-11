import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faFillDrip,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import FilterView from "./FilterView";
import ChoroplethView from "./ChoroplethView";
import SearchView from "./SearchView.js";
import styles from "./sidebar.module.css";
import mapStyles from "../map.module.css";
import MapContext from "../context";

import { remToPx } from "../../../lib/utility";
import DataDisplayBox from "../DataDisplayBox";

const Sidebar = () => {
  const [sidebarView, setSidebarView] = useState(null);
  const {
    searchFields,
    filters,
    choropleths,
    mapSize,
    activeData,
  } = useContext(MapContext);

  const viewProps = {
    filter: {
      icon: faFilter,
      display: filters?.length,
      component: <FilterView />,
    },
    color: {
      icon: faFillDrip,
      display: choropleths?.length,
      component: <ChoroplethView />,
    },
    search: {
      icon: faSearch,
      display: searchFields?.length,
      component: <SearchView />,
    },
  };

  return (
    <div className="w-1/3 h-full absolute left-0">
      {activeData ? (
        <DataDisplayBox />
      ) : (
        <div
          className={styles.sidebarOuterContentContainer}
          style={
            sidebarView
              ? {}
              : {
                  maxHeight: "0px",
                  overflow: "hidden",
                  padding: "0px",
                  borderBottom: "none",
                }
          }
        >
          {sidebarView ? (
            <h1>{`${sidebarView} features${
              sidebarView === "Color" ? " by:" : ":"
            }`}</h1>
          ) : (
            <></>
          )}
          <div
            className={`${styles.sidebarContentInner}`}
            style={{
              maxHeight: `${
                (mapSize?.height || 800) - process.window ? remToPx(8.5) : 136
              }px`,
              overflow: "scroll",
            }}
          >
            {viewProps[sidebarView]?.component}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
