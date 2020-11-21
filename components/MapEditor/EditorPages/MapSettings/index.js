import { useContext } from "react";
import EditorContext from "../../context";
import generalStyles from "../general.module.css";
import displayStyles from "./displayStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import toBBox from "geojson-bounding-box";

export default function MapSettings({}) {
  const { tileLayer, updateMap, bounds, geojson, setUsingMapView } = useContext(
    EditorContext
  );

  return (
    <>
      <h2 className={generalStyles.containerTitle}>Map Display Settings</h2>
      <section className={generalStyles.infoSection}>
        <label htmlFor="" className={generalStyles.inputLabel}>
          Tile Layer
        </label>
        <select
          name=""
          id=""
          onChange={(e) =>
            updateMap({
              tileLayer:
                e.target.value !== "None"
                  ? {
                      ...tileLayer,
                      url: `https://stamen-tiles-{s}.a.ssl.fastly.net/${e.target.value}/{z}/{x}/{y}{r}.{ext}`,
                      ext: e.target.value === "watercolor" ? "jpg" : "png",
                    }
                  : null,
            })
          }
        >
          <option
            value="toner-background"
            selected={
              tileLayer?.url.indexOf("toner-background") > -1 ? "selected" : ""
            }
          >
            Basic
          </option>
          <option
            value="terrain-background"
            selected={
              tileLayer?.url.indexOf("terrain-background") > -1
                ? "selected"
                : ""
            }
          >
            Terrain
          </option>
          <option value={"None"} selected={!tileLayer}>
            None
          </option>
        </select>
      </section>
      <section className={generalStyles.infoSection}>
        <label htmlFor="" className={generalStyles.inputLabel}>
          Labels
        </label>
        <FontAwesomeIcon
          icon={tileLayer?.labels ? faToggleOn : faToggleOff}
          onClick={() =>
            updateMap({
              tileLayer: { ...tileLayer, labels: !tileLayer?.labels },
            })
          }
        />
      </section>
      <section className={generalStyles.infoSection}>
        <h3 className={displayStyles.sectionTitle}>View Boundary</h3>

        <button
          className={generalStyles.inputLabel}
          onClick={() => {
            setUsingMapView(true);
          }}
        >
          Capture Current View
        </button>
        <button
          className={generalStyles.inputLabel}
          onClick={() => {
            let bbox = toBBox(geojson);
            bbox = [
              [bbox[1], bbox[0]],
              [bbox[3], bbox[2]],
            ];
            updateMap({
              bounds: bbox,
            });
          }}
        >
          Fit to Features
        </button>
        <button
          onClick={() => {
            updateMap({
              bounds: null,
            });
          }}
        >
          Clear
        </button>
      </section>
    </>
  );
}
