import { useContext, useRef, useState, useEffect } from "react";
import EditorContext from "../../context";
import generalStyles from "../general.module.css";
import infoStyles from "./infoStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faLink,
  faLockOpen,
  faLock,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import DotLoader from "react-spinners/DotLoader";
import { css } from "@emotion/core";
import domtoimage from "dom-to-image";

export default function InfoSettings({}) {
  const linkRef = useRef();
  const titleRef = useRef();
  const [showingPopup, setShowingPopup] = useState(false);
  const [loadingScreenshot, setLoadingScreenshot] = useState(false);
  const [typingTitleTimeout, setTypingTitleTimeout] = useState(false);
  const [typingDescriptionTimeout, setTypingDescriptionTimeout] = useState(
    false
  );
  const fireCopiedPopup = () => {
    setShowingPopup(true);
    setTimeout(() => setShowingPopup(false), 1000);
  };

  const override = css`
    display: inline-block;
    margin: 0 0.35rem;
    border-color: red;
  `;

  const {
    tags,
    description,
    state,
    updateMap,
    editFunctions,
    publish,
    _id,
    setTakingScreenshot,
    takingScreenshot,
  } = useContext(EditorContext);
  const mapTitle = state.map.name;
  const tagInputRef = useRef();
  const addTag = (newTag) => {
    newTag.split(/,\s?/).forEach((tag) => editFunctions("tags").add(tag));
  };

  useEffect(() => {
    if (!takingScreenshot) {
      setLoadingScreenshot(false);
    }
  }, [takingScreenshot]);

  return (
    <>
      <section className={generalStyles.infoSection}>
        <label htmlFor="" className={generalStyles.inputLabel}>
          Title:
        </label>
        <input
          ref={titleRef}
          type="text"
          className={infoStyles.mapTitle}
          defaultValue={mapTitle}
          onChange={() => {
            if (typingTitleTimeout) {
              clearTimeout(typingTitleTimeout);
            }
            const name = titleRef.current.value;
            const timeoutFn = () => {
              updateMap({ name });
              setTypingTitleTimeout(null);
            };
            setTypingTitleTimeout(setTimeout(timeoutFn, 2000));
          }}
        />
      </section>
      <section className={generalStyles.infoSection}>
        <label htmlFor="" className={generalStyles.inputLabel}>
          Description:
        </label>
        <textarea
          style={{ resize: "none", width: "100%" }}
          className={infoStyles.mapDescription}
          defaultValue={description}
          onChange={(e) => {
            if (typingDescriptionTimeout) {
              clearTimeout(typingDescriptionTimeout);
            }
            const description = e.target.value;
            const timeoutFn = () => {
              updateMap({ description });
              setTypingDescriptionTimeout(null);
            };
            setTypingDescriptionTimeout(setTimeout(timeoutFn, 2000));
          }}
        />
      </section>
      <section className={generalStyles.infoSection}>
        <label htmlFor="" className={generalStyles.inputLabel}>
          Tags
        </label>
        <input
          type="text"
          className={infoStyles.tagInput}
          ref={tagInputRef}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              addTag(tagInputRef.current.value);
              tagInputRef.current.value = "";
            }
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addTag(tagInputRef.current.value);
              tagInputRef.current.value = "";
            }
          }}
        />
        <button
          onClick={() => {
            addTag(tagInputRef.current.value);
            tagInputRef.current.value = "";
          }}
        >
          +
        </button>
        <ul className={infoStyles.tagContainer}>
          {tags?.map((tag, index) => (
            <li className={infoStyles.tag} key={`${tag}-${index}`}>
              <FontAwesomeIcon
                icon={faTimes}
                size={"xs"}
                className={infoStyles.deleteIcon}
                onClick={() => editFunctions("tags").remove({ index })}
              />
              <span>{tag}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className={generalStyles.infoSection}>
        <FontAwesomeIcon icon={faCamera} className={generalStyles.inputLabel} />
        <button
          onClick={() => {
            setLoadingScreenshot(true);
            setTakingScreenshot(true);
          }}
        >
          Capture map thumbnail
        </button>
        {loadingScreenshot ? (
          <DotLoader css={override} size={20} color={"#4A4A4A"} />
        ) : (
          <></>
        )}
      </section>
      {/*<section className={generalStyles.infoSection}>
        <FontAwesomeIcon
          className={generalStyles.inputLabel}
          style={generalStyles}
          icon={publish ? faLockOpen : faLock}
          onClick={() =>
            updateMap({
              publish: !publish,
            })
          }
        />
        <label htmlFor="">
          {publish
            ? "Map is published to the choropleth.net community"
            : "Map is only viewable with the link or embedded on another website"}
        </label>
          </section>*/}
      <section className={generalStyles.infoSection}>
        <FontAwesomeIcon
          className={generalStyles.inputLabel}
          style={generalStyles}
          icon={faLink}
          onClick={() =>
            updateMap({
              publish: !publish,
            })
          }
        />
        <input
          style={{ cursor: "pointer" }}
          ref={linkRef}
          readOnly="readonly"
          onClick={() => linkRef.current.select()}
          defaultValue={`http://choropleth.net/maps/${_id.toString()}/embed`}
          type="text"
        />
        <button
          onClick={() => {
            linkRef.current.select();
            linkRef.current.setSelectionRange(0, 99999);
            document.execCommand("copy");
            linkRef.current.setSelectionRange(0, 0);
            linkRef.current.blur();
            fireCopiedPopup();
          }}
        >
          Copy Link
        </button>
        <span
          className={`${infoStyles.popup} ${
            showingPopup ? infoStyles.showingPopup : infoStyles.invisiblePopup
          }`}
        >
          Copied!
        </span>
      </section>
    </>
  );
}
