import { useContext, useRef } from "react";
import { useState } from "react";
import generalStyles from "../general.module.css";
import EditorContext from "../../context";
export default function SearchFieldSettings({}) {
  const { editFunctions, searchFields, properties } = useContext(EditorContext);
  const [addingSearchField, setaddingSearchField] = useState(false);
  const openSearchFieldAdder = () => {
    setaddingSearchField(true);
  };

  const searchFieldSelectRef = useRef();
  const eligibleOtherSearchFields = properties
    .filter((prop) => searchFields.indexOf(prop.name) === -1)
    .map((prop) => prop.name);

  return (
    <>
      <div
        className={generalStyles.overlayContainer}
        style={{ display: addingSearchField ? "flex" : "none" }}
      >
        <div className={generalStyles.overlayBox}>
          <h3>Select the name of the field to add as a searchable option</h3>
          <select
            ref={searchFieldSelectRef}
            name="searchFieldName"
            id=""
            style={{ fontSize: "2rem" }}
          >
            {eligibleOtherSearchFields.map((c) => (
              <option value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={() => {
              const searchFieldToAdd = searchFieldSelectRef.current.value;
              editFunctions("searchFields").add(searchFieldToAdd);
              setaddingSearchField(false);
            }}
          >
            Add
          </button>
          <button onClick={() => setaddingSearchField(false)}>Cancel</button>
        </div>
      </div>
      <ul style={{ paddingLeft: 0 }}>
        {searchFields.map((searchField) => (
          <li key={`${searchField}-searchField`}>{searchField}</li>
        ))}
      </ul>
      <button
        key={`add-a-searchField`}
        onCbuttonck={() => openSearchFieldAdder()}
        style={{ cursor: "pointer" }}
      >
        Add a Searchable Field
      </button>
    </>
  );
}
