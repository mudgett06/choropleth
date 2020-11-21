import { useState, useContext, useRef } from "react";
import EditorContext from "../../context";
import choroplethStyles from "./styleSettings.module.css";
import generalStyles from "../general.module.css";
import ColorInterface from "./ColorInterface";
import ChoroplethSelector from "./ChoroplethSelector";
import { unique } from "../../../../lib/utility";
import { guessChoropleth } from "../../../../lib/editor/guesses";

export default function StyleSettings() {
  const {
    editFunctions,
    choropleths,
    styles,
    properties,
    geojson,
    editorChoropleth,
    setEditorChoropleth,
  } = useContext(EditorContext);
  const [editingState, setEditingState] = useState("fillColor");
  const [addingChoropleth, setAddingChoropleth] = useState(false);
  const [deletingChoropleth, setDeletingChoropleth] = useState(false);
  const [editingChoroplethIndex, setEditingChoroplethIndex] = useState(0);
  const openChoroplethAdder = () => {
    setAddingChoropleth(true);
  };

  const addChoroplethSelectRef = useRef();
  const eligibleOtherChoropleths = properties.filter(
    (prop) =>
      choropleths.map((c) => c.name).indexOf(prop.name) === -1 &&
      ["url", "longText"].indexOf(prop.dataType) === -1 &&
      !(
        unique(geojson.features.map((feat) => feat.properties[prop.name]))
          .length > 9 && prop.dataType === "text"
      )
  );

  return (
    <>
      <div
        className={generalStyles.overlayContainer}
        style={{
          display: addingChoropleth || deletingChoropleth ? "flex" : "none",
        }}
      >
        <div className={generalStyles.overlayBox}>
          <p>
            {addingChoropleth
              ? "Select the name of the field to add as a choropleth option"
              : `Really delete "${deletingChoropleth}" choropleth?`}
          </p>
          {addingChoropleth ? (
            <select ref={addChoroplethSelectRef} name="choroplethName" id="">
              {eligibleOtherChoropleths.map((c) => (
                <option value={c.name}>{c.name}</option>
              ))}
            </select>
          ) : (
            <></>
          )}
          <button
            onClick={() => {
              if (addingChoropleth) {
                const choroplethToAdd = addChoroplethSelectRef.current.value;
                const type = guessFilterType(
                  properties.find((prop) => prop.name === choroplethToAdd)
                    .dataType
                );
                editFunctions("choropleths").add(
                  guessChoropleth(
                    choroplethToAdd,
                    properties.find((prop) => prop.name === choroplethToAdd)
                      .dataType,
                    unique(
                      geojson.features.map(
                        (feat) => feat.properties[choroplethToAdd]
                      )
                    )
                  )
                );
                setAddingChoropleth(false);
              } else {
                editFunctions("choropleths").remove({
                  index: choropleths.findIndex(
                    (choropleth) => choropleth.name === deletingChoropleth.name
                  ),
                });
                setDeletingChoropleth(false);
              }
            }}
          >
            {addingChoropleth ? "Add" : "Delete"}
          </button>
          <button
            onClick={() =>
              addingChoropleth
                ? setAddingChoropleth(false)
                : setDeletingChoropleth(false)
            }
          >
            Cancel
          </button>
        </div>
      </div>
      <div className={choroplethStyles.section}>
        <h3 className={choroplethStyles.sectionTitle}>Default Styles</h3>

        <div className={choroplethStyles.modeSelector}>
          <h4
            onClick={() => setEditingState("fillColor")}
            className={`${choroplethStyles.editModeTitle} ${
              editingState === "fillColor"
                ? choroplethStyles.activeEditModeTitle
                : ""
            }`}
          >
            Fill
          </h4>
          <h4
            onClick={() => setEditingState("color")}
            className={`${choroplethStyles.editModeTitle} ${
              editingState === "color"
                ? choroplethStyles.activeEditModeTitle
                : ""
            }`}
          >
            Outline
          </h4>
        </div>
        <ColorInterface
          editingState={editingState}
          size={{ height: 1, width: 3 }}
        />
      </div>
      <div className={choroplethStyles.section}>
        <h3 className={choroplethStyles.sectionTitle}>Choropleth Colors</h3>
        <select
          onChange={(e) =>
            setEditorChoropleth(
              choropleths.find(
                (choropleth) => choropleth.name === e.target.value
              )
            )
          }
        >
          {choropleths.map((choropleth, i) => (
            <option
              value={choropleth.name}
              selected={
                editorChoropleth
                  ? choropleth.name === editorChoropleth.name
                  : choropleths[0]
              }
            >
              {choropleth.name}
            </option>
          ))}
        </select>
        {editingChoroplethIndex || editingChoroplethIndex === 0 ? (
          <ChoroplethSelector
            activeChoropleth={editorChoropleth || choropleths[0]}
            updateColors={(swatch) => {
              editFunctions("choropleths").update({
                index: choropleths.findIndex(
                  (choropleth) => choropleth.name === editorChoropleth.name
                ),
                newValue: {
                  schemeName: swatch.name,
                },
              });
              setEditorChoropleth({
                ...editorChoropleth,
                schemeName: swatch.name,
              });
            }}
          />
        ) : (
          <></>
        )}
        <button onClick={() => openChoroplethAdder()}>Add a choropleth</button>
      </div>
    </>
  );
}
