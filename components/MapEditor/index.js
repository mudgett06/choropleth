import { useEffect, useContext, useState } from "react";
import Map from "../Map";
import IconsBar from "./IconsBar";
import styles from "./editor.module.css";
import EditorContext, { EditorProvider } from "./context";
import DataSettings from "./EditorPages/DataSettings";
import FilterSettings from "./EditorPages/FilterSettings";
import StyleSettings from "./EditorPages/StyleSettings";
import SearchSettings from "./EditorPages/SearchSettings";
import InfoSettings from "./EditorPages/InfoSettings";
import MapSettings from "./EditorPages/MapSettings";
import DotLoader from "react-spinners/DotLoader";
import { css } from "@emotion/core";
export default function MapEditor({ map }) {
  return (
    <EditorProvider map={map}>
      <Editor />
    </EditorProvider>
  );
}

function Editor() {
  const override = css`
    display: inline-block;
    margin: 0 0rem;
    border-color: red;
  `;

  const {
    editorPage,
    geojson,
    name,
    state,
    updates,
    takingScreenshot,
    _id,
    mapFullscreen,
  } = useContext(EditorContext);
  const [editorPageObject, setEditorPageObject] = useState({
    title: "Map Info",
    component: <InfoSettings />,
  });
  useEffect(() => {
    setEditorPageObject(
      (() => {
        switch (editorPage) {
          case "info":
            return { title: "Map Info", component: <InfoSettings /> };
          case "data":
            return { title: "Data Settings", component: <DataSettings /> };
          case "filter":
            return { title: "Filter Settings", component: <FilterSettings /> };
          case "style":
            return { title: "Style Settings", component: <StyleSettings /> };
          case "search":
            return { title: "Search Fields", component: <SearchSettings /> };
          case "map":
            return { title: "Display Settings", component: <MapSettings /> };
        }
      })()
    );
  }, [editorPage]);
  return (
    <>
      <div
        style={mapFullscreen ? { marginTop: 0 } : {}}
        className={styles.container}
      >
        {!mapFullscreen ? (
          <section
            className={styles.column}
            style={{ width: "33%", height: "60vh" }}
          >
            <IconsBar />
            <div className={styles.outerPageContainer}>
              {takingScreenshot ? (
                <>
                  <h2>Taking A Screenshot</h2>
                  <DotLoader css={override} size={20} color={"#4A4A4A"} />;
                </>
              ) : (
                <>
                  <h2 className={styles.pageTitle}>{editorPageObject.title}</h2>
                  <div className={styles.innerPageContainer}>
                    {editorPageObject.component}
                  </div>
                </>
              )}
            </div>
          </section>
        ) : (
          <></>
        )}
        <section
          className={styles.column}
          style={{
            width: mapFullscreen ? "calc(100% - 2rem)" : "calc(50% - 2rem)",
            height: mapFullscreen ? "90vh" : "60vh",
          }}
        >
          <div className={styles.headingContainer}>
            <div className={styles.left}>
              <h1 className={styles.mapTitle}>{name}</h1>
            </div>
            <h2 className={styles.saveState}>
              {updates ? "Saving" : "All changes saved"}
            </h2>
          </div>
          <Map map={state.map} editor={true} />
        </section>
      </div>
    </>
  );
}
