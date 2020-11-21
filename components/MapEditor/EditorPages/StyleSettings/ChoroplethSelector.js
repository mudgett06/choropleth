import schemes from "../../../../lib/hex_schemes";
import styles from "./styleSettings.module.css";

export default function ChoroplethSelector({ activeChoropleth, updateColors }) {
  const swatchOptions = Object.keys(schemes)
    .filter((schemeName) => {
      switch (activeChoropleth.type) {
        case "category":
        case "multiCategory":
          return schemes[schemeName].type === "qual";
        case "range":
        case "date":
          return ["div", "seq"].indexOf(schemes[schemeName].type) > -1;
      }
    })
    .map((schemeName) => {
      return {
        name: schemeName,
        colors: schemes[schemeName].ramps[activeChoropleth.options.length],
      };
    });
  return (
    <div className={styles.rampSelector}>
      {swatchOptions.map((swatch) => (
        <div
          className={`${styles.swatchContainer} ${
            activeChoropleth?.schemeName === swatch.name
              ? styles.activeSwatch
              : ""
          }`}
          onClick={() => {
            updateColors(swatch);
          }}
        >
          {swatch.colors?.map((color) => (
            <div className={styles.swatchBlock} style={{ background: color }} />
          ))}
        </div>
      ))}
    </div>
  );
}
