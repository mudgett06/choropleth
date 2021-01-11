import styles from "./map.module.css";
import { useContext } from "react";
import MapContext from "./context";
import { abbrevNum, getTextColor } from "../../lib/utility";
import { getChoroplethColor } from "../../lib/map/style";

const DataDisplayBox = () => {
  const { activeData, properties, geography, activeChoropleth } = useContext(
    MapContext
  );

  const formattedData = Object.keys(activeData || {}).reduce((obj, prop) => {
    const propSettings = properties.find((p) => p.name === prop);
    if (!propSettings.active) {
      return obj;
    }
    const alias = propSettings.alias;
    const formattedData =
      propSettings.dataType === "number"
        ? abbrevNum(activeData[prop])
        : activeData[prop];
    return {
      ...obj,
      [propSettings.geography?.type === geography.type
        ? "identifier"
        : alias || prop]: formattedData,
    };
  }, {});

  return (
    <div className="h-full w-full">
      <h1 className={styles.dataBoxTitle}>{formattedData["identifier"]}</h1>
      <div className={styles.dataBoxTable}>
        <table>
          {properties
            .filter(
              (prop) =>
                prop.active && !(prop.geography?.type === geography.type)
            )
            .map((prop) => {
              if (
                properties.find(
                  (property) => property.geography === geography.type
                )?.name !== prop.name
              ) {
                return (
                  <tr className={styles.dataBoxRow}>
                    <th className={styles.dataBoxLabel}>
                      {prop.alias || prop.name}
                    </th>
                    <td
                      className={styles.dataBoxData}
                      style={
                        activeChoropleth?.name === prop.name
                          ? {
                              background: getChoroplethColor(
                                { properties: activeData },
                                activeChoropleth
                              ),
                              color: getTextColor(
                                getChoroplethColor(
                                  { properties: activeData },
                                  activeChoropleth
                                )
                              ),
                            }
                          : {}
                      }
                    >
                      {formattedData[prop.alias || prop.name]}
                    </td>
                  </tr>
                );
              }
            })}
        </table>
      </div>
    </div>
  );
};

export default DataDisplayBox;
