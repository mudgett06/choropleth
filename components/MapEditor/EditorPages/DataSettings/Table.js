import { Droppable } from "react-beautiful-dnd";
import styles from "./dataSettings.module.css";
import Rows from "./Rows";
export default function Table() {
  return (
    <Droppable droppableId="droppable" direction="vertical">
      {(provided, snapshot) => (
        <table
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={styles.table}
        >
          <thead>
            <th></th>
            <th>Display</th>
            <th>Name</th>
            <th>Data Type</th>
            <th>Alias</th>
          </thead>
          <Rows />
          {provided.placeholder}
        </table>
      )}
    </Droppable>
  );
}
