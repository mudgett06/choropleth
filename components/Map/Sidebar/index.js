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

const Sidebar = () => {
  const [sidebarView, setSidebarView] = useState(null);
  const { searchFields, filters, choropleths, mapSize } = useContext(
    MapContext
  );

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
    <div className={`${styles.sidebarContainer} ${mapStyles.overlay}`}>
      <div className={styles.sidebarIconsWrapper}>
        {["filter", "color", "search"]
          .filter((view) => viewProps[view].display)
          .map((viewName) => (
            <button
              style={sidebarView ? {} : { borderRadius: "5px" }}
              onClick={() => {
                setSidebarView(sidebarView === viewName ? null : viewName);
              }}
              className={
                sidebarView === viewName
                  ? `${styles.sidebarTab} ${styles.activeSidebarTab}`
                  : styles.sidebarTab
              }
              onMouseDown={(e) => e.preventDefault()}
            >
              <FontAwesomeIcon icon={viewProps[viewName].icon} />
            </button>
          ))}
      </div>
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
            maxHeight: `${(mapSize?.height || 800) - remToPx(8.5)}px`,
            overflow: "scroll",
          }}
        >
          {getViewProps(sidebarView)?.component}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
