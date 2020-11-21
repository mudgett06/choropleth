import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faPalette,
  faColumns,
  faSearch,
  faCog,
  faInfo,
  faMapMarkedAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./iconBar.module.css";
import EditorContext from "../context";

export default function iconsBar() {
  const { editorPage, setEditorPage } = useContext(EditorContext);
  const iconProps = [
    {
      name: "info",
      icon: faInfo,
      text: "Edit map information",
    },
    {
      name: "data",
      icon: faColumns,
      text: "Select data to be used by map",
    },
    {
      name: "filter",
      icon: faFilter,
      text: "Customize map feature filters",
    },
    {
      name: "style",
      icon: faPalette,
      text: "Customize feature styles",
    },
    {
      name: "search",
      icon: faSearch,
      text: "Choose columns to allow search",
    },
    {
      name: "map",
      icon: faMapMarkedAlt,
      text: "Edit map display settings",
    },
  ];

  return (
    <div className={styles.container}>
      {iconProps.map((icon) => (
        <button
          onClick={() => setEditorPage(icon.name)}
          onMouseDown={(e) => e.preventDefault()}
          className={
            editorPage === icon.name
              ? `${styles.iconButton} ${styles.active}`
              : styles.iconButton
          }
        >
          <FontAwesomeIcon className={styles.icon} icon={icon.icon} />
          <span className={styles.tooltip}>{icon.text}</span>
        </button>
      ))}
    </div>
  );
}
