import { useContext } from "react";
import styles from "../map.module.css";
import utilStyles from "../../../styles/utils.module.css";
import MapContext from "../context";

const ChoroplethView = () => {
  const {
    activeChoropleth,
    choropleths,
    setState,
    refreshMap,
    setEditorChoropleth,
  } = useContext(MapContext);
  const setActiveChoropleth = (activeChoropleth) => {
    setState({ activeChoropleth });
    refreshMap({ type: "choropleth", update: activeChoropleth });
    if (setEditorChoropleth && activeChoropleth) {
      setEditorChoropleth(activeChoropleth);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        className={
          !activeChoropleth
            ? `${styles.nameBlock} ${styles.activeNameBlock} `
            : styles.nameBlock
        }
        onClick={() => setActiveChoropleth(null)}
        onMouseDown={(e) => e.preventDefault()}
      >
        <h2>None</h2>
      </button>
      {choropleths.map((choropleth, i) => (
        <button
          className={
            activeChoropleth?.name === choropleth.name
              ? `${styles.nameBlock} ${styles.activeNameBlock} `
              : styles.nameBlock
          }
          onClick={() => setActiveChoropleth(choropleth)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <h2>{choropleth.name}</h2>
        </button>
      ))}
    </div>
  );
};

export default ChoroplethView;
