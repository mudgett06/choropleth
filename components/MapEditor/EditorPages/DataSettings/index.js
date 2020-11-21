import { useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import EditorContext from "../../context";
import Table from "./Table";
import generalStyles from "../general.module.css";

export default function DataSettings({}) {
  const { editFunctions } = useContext(EditorContext);
  return (
    <>
      <DragDropContext
        onDragEnd={(result) =>
          editFunctions("properties").reorder({
            oldIndex: result.source.index,
            newIndex: result.destination.index,
          })
        }
      >
        <Table />
      </DragDropContext>
    </>
  );
}
