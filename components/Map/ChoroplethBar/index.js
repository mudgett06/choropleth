import { useContext, useRef } from "react";
import MapContext from "../context";
import css from "./styles.module.css";
import { formatRanges } from "../../../lib/utility";
import schemes from "../../../lib/hex_schemes";

const ChoroplethBar = () => {
  const {
    activeChoropleth: { name, options, type, schemeName },
    properties,
    styles,
  } = useContext(MapContext);
  const labels =
    ["range", "date"].indexOf(type) > -1
      ? formatRanges(options || [], type === "date")
      : options || [];

  const colors = schemes[schemeName]?.ramps[options?.length] || [];
  const containerRef = useRef();
  return (
    <div
      ref={containerRef}
      className={`${css.choroplethContainer} ${css.overlay}`}
    >
      <h1 className={css.choroplethTitle}>
        {properties.find((prop) => prop.name === name)?.alias || name}
      </h1>
      <div className={css.choroplethScaleWrapper}>
        {labels.map((label, ind) => (
          <div
            key={`colorBlock-${ind}`}
            style={{
              background: colors[ind],
              opacity: styles.fillOpacity,
            }}
            className={css.colorBlock}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoroplethBar;
