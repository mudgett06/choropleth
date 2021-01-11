import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faFillDrip,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import MapContext from "./context";

const Sidebar = () => {
  const {
    searchFields,
    filters,
    choropleths,
    sidebarView,
    setSidebarView,
  } = useContext(MapContext);

  const viewProps = {
    filter: {
      icon: faFilter,
      display: filters?.length,
    },
    color: {
      icon: faFillDrip,
      display: choropleths?.length,
    },
    search: {
      icon: faSearch,
      display: searchFields?.length,
    },
  };

  return (
    <div className="flex flex-col">
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
                ? `bg-gray-400 border border-gray-800 flex-grow rounded-t-md rounded-r-md cursor-pointer border-b border-b-gray-400`
                : "bg-gray-300 border border-gray-800 flex-grow rounded-t-md rounded-r-md cursor-pointer"
            }
            onMouseDown={(e) => e.preventDefault()}
          >
            <FontAwesomeIcon icon={viewProps[viewName].icon} />
          </button>
        ))}
    </div>
  );
};

export default Sidebar;
