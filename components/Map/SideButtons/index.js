import styles from "./buttons.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfo,
  faPencilAlt,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import Link from "next/link";
import MapContext from "../context";

export default function SideButtons({ mapFullscreen, setMapFullscreen }) {
  const [showingInfo, setShowingInfo] = useState(false);
  const { _id, description, tags, editor, owner } = useContext(MapContext);
  return (
    <div className={styles.outerContainer}>
      {description || (tags && tags.length > 0) ? (
        <div
          className={styles.innerContainer}
          onMouseEnter={() => setShowingInfo(true)}
          onMouseLeave={() => setShowingInfo(false)}
          style={{
            textAlign: showingInfo ? "left" : "center",
            maxHeight: !showingInfo ? "30px" : "30%",
          }}
        >
          {!showingInfo ? (
            <FontAwesomeIcon icon={faInfo} className={styles.icon} />
          ) : (
            <>
              <p>{description}</p>
              {tags?.length ? (
                <>
                  <span className={styles.tagsTitle}>Tags</span>
                  <ul className={styles.tagContainer}>
                    {tags?.map((tag, i) => (
                      <li className={styles.tag} key={`${tag}-{i}`}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      ) : (
        <></>
      )}
      {editor ? (
        <div
          className={styles.innerContainer}
          onClick={() => setMapFullscreen(!mapFullscreen)}
        >
          <FontAwesomeIcon
            icon={mapFullscreen ? faCompress : faExpand}
            className={styles.icon}
          />
        </div>
      ) : owner ? (
        <Link href={`/maps/${_id}/edit`}>
          <div className={styles.innerContainer}>
            <FontAwesomeIcon icon={faPencilAlt} className={styles.icon} />
          </div>
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
}
