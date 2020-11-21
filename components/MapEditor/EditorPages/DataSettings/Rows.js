import { useContext, useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import EditorContext from "../../context";
import styles from "./dataSettings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";
import { guessChoropleth, guessFilter } from "../../../../lib/editor/guesses";
import { unique } from "../../../../lib/utility";

export default function Rows() {
  const { properties, editFunctions, geojson } = useContext(EditorContext);
  const aliasRefs = properties.map(() => useRef());
  const handleChange = (index, update, fieldToUpdate) => {
    editFunctions("properties").update({
      index,
      newValue: {
        ...properties[index],
        [fieldToUpdate]: update,
      },
    });
  };
  const [hoveringPropIndex, setHoveringPropIndex] = useState(null);
  const [typingAliasTimeout, setTypingAliasTimeout] = useState(false);
  return (
    <>
      {properties.map((prop, index) => (
        <Draggable key={prop.name} draggableId={prop.name} index={index}>
          {(provided, snapshot) => (
            <tr
              onMouseOver={() => setHoveringPropIndex(index)}
              onMouseOut={() => setHoveringPropIndex(null)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={!prop.active ? styles.inactive : ""}
            >
              <td
                {...provided.dragHandleProps}
                className={styles.gripLinesTd}
                style={{
                  visibility:
                    hoveringPropIndex === index ? "visible" : "hidden",
                }}
              >
                <FontAwesomeIcon
                  icon={faGripLines}
                  className={styles.gripLinesIcon}
                />
              </td>
              <td className={styles.tableData}>
                <input
                  type="checkbox"
                  name="active"
                  id={`${prop.name}-active`}
                  checked={prop.active}
                  onChange={(e) =>
                    handleChange(index, e.target.checked, "active")
                  }
                />
              </td>
              <td className={styles.tableData}>{prop.name}</td>
              <td className={styles.tableData}>
                <select
                  name="dataType"
                  id={`${prop.name}-dataType`}
                  onChange={(e) => {
                    handleChange(index, e.target.value, "dataType");
                    if (geojson) {
                      const uniqueValues = unique(
                        geojson?.features.map(
                          (feat) => feat.properties[prop.name]
                        ) || []
                      );
                      editFunctions("filters").update({
                        index,
                        newValue: guessFilter(
                          prop.name,
                          e.target.value,
                          uniqueValues
                        ),
                      });
                      editFunctions("choropleths").update({
                        index,
                        newValue: guessChoropleth(
                          prop.name,
                          e.target.value,
                          uniqueValues
                        ),
                      });
                    }
                  }}
                >
                  {[
                    "range",
                    "date",
                    "list",
                    "number",
                    "url",
                    "longText",
                    "text",
                  ].map((opt) => (
                    <option
                      selected={prop.dataType === opt ? "selected" : ""}
                      value={opt}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
              <td className={styles.tableData}>
                <input
                  ref={aliasRefs[index]}
                  type="text"
                  size="10"
                  defaultValue={prop.alias || ""}
                  onChange={(e) => {
                    if (typingAliasTimeout) {
                      clearTimeout(typingAliasTimeout);
                    }
                    const timeoutFn = () => {
                      handleChange(
                        index,
                        aliasRefs[index].current.value || null,
                        "alias"
                      );
                      setTypingAliasTimeout(null);
                    };
                    setTypingAliasTimeout(setTimeout(timeoutFn, 2000));
                  }}
                />
              </td>
            </tr>
          )}
        </Draggable>
      ))}
    </>
  );
}
