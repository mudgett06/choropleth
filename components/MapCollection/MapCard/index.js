import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faEye,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function MapCard({
  map,
  owner,
  deleteDialog,
  showingDeleteDialog,
}) {
  return (
    <Link href={`/maps/${map._id}`}>
      <div
        className={owner ? styles.ownedMapCard : styles.mapCard}
        style={
          showingDeleteDialog ? { opacity: "0.3", pointerEvents: "none" } : {}
        }
      >
        <h1 className={styles.title}>{map.name}</h1>
        <div
          className={styles.imgContainer}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={map.thumbnail}
            className={styles.thumbnail}
            height="160"
            width="250"
          ></img>
          {owner && !showingDeleteDialog ? (
            <div
              className={styles.imgOverlay}
              onClick={(e) => e.stopPropagation()}
            >
              <Link href={`/maps/${map._id}/edit`}>
                <a
                  className={styles.editCog}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </a>
              </Link>
              <Link href={`/maps/${map._id}`}>
                <a
                  className={styles.editCog}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FontAwesomeIcon icon={faEye} />
                </a>
              </Link>
              <a
                className={styles.editCog}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDialog(map);
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
        <p>{map.description}</p>
        <ul className={styles.tagContainer}>
          {map.tags?.map((tag, i) => (
            <li key={`${map.name}-tag-${i}`} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
