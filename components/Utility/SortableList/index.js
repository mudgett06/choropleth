import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faArrowsAltV } from "@fortawesome/free-solid-svg-icons";

export default function SortableList({
  listItems,
  activeIndex,
  updateState,
  innerContent,
}) {
  return (
    <DragDropContext
      onDragEnd={(result) => {
        updateState.reorder({
          oldIndex: result.source.index,
          newIndex: result.destination.index,
        });
        if (updateState.click) {
          updateState.click(result.destination.index);
        }
      }}
    >
      <Droppable droppableId={"droppable"} direction={"vertical"}>
        {(provided, snapshot) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={styles.droppable}
          >
            {listItems.map((item, index) => (
              <Draggable
                key={item.name.toString()}
                draggableId={item.name.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <li
                    key={`item-${index}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={styles.draggableBlock}
                  >
                    <div className={styles.iconContainer}>
                      {updateState.remove ? (
                        <span onClick={() => updateState.remove({ index })}>
                          <FontAwesomeIcon
                            icon={faMinusCircle}
                            style={{ color: "red", cursor: "pointer" }}
                            className={styles.deleteIcon}
                          />
                        </span>
                      ) : (
                        <></>
                      )}
                      {listItems.length > 1 ? (
                        <span {...provided.dragHandleProps}>
                          <FontAwesomeIcon
                            icon={faArrowsAltV}
                            className={styles.moveIcon}
                          />
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div
                      className={`${styles.content} ${
                        activeIndex === index ? styles.active : ""
                      }`}
                    >
                      {innerContent(item, index)}
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
