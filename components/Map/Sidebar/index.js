import { useState, useRef, useContext, useEffect } from "react";
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

const Sidebar = ({ mapHeight }) => {
  const [sidebarView, setSidebarView] = useState(null);
  const [maxHeight, setMaxHeight] = useState(null);
  useEffect(() => {
    setMaxHeight(mapHeight - remToPx(8.5));
  }, [mapHeight]);
  const container = useRef();
  const { searchFields, filters, choropleths } = useContext(MapContext);

  const getViewProps = (viewName) => {
    switch (viewName) {
      case "Filter":
        return {
          icon: faFilter,
          display: filters?.length,
          component: <FilterView />,
        };
      case "Color":
        return {
          icon: faFillDrip,
          display: choropleths?.length,
          component: <ChoroplethView />,
        };
      case "Search":
        return {
          icon: faSearch,
          display: searchFields?.length,
          component: <SearchView />,
        };
    }
  };

  return (
    <div
      className={`${styles.sidebarContainer} ${mapStyles.overlay}`}
      ref={container}
    >
      <div className={styles.sidebarIconsWrapper}>
        {["Filter", "Color", "Search"]
          .filter((view) => getViewProps(view).display)
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
              <FontAwesomeIcon icon={getViewProps(viewName).icon} />
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
          style={{ maxHeight, overflow: "scroll" }}
        >
          {getViewProps(sidebarView)?.component}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
