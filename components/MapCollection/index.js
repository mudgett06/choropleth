import { useState } from "react";
import { useRouter } from "next/router";
import MapCard from "./MapCard";
import { deleteMap } from "../../lib/api/maps";
import DotLoader from "react-spinners/DotLoader";
import { css } from "@emotion/core";

export default function MapCollection({ maps, owner }) {
  const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
  const [mapToDelete, setMapToDelete] = useState(null);
  const [deletingMap, setDeletingMap] = useState(false);
  const [mapCollection, setMapCollection] = useState(maps);
  const router = useRouter();
  const deleteDialog = (map) => {
    setShowingDeleteDialog(true);
    setMapToDelete(map);
  };
  const override = css`
    display: inline-block;
    margin: 0 0.35rem;
    border-color: red;
  `;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }}
    >
      {showingDeleteDialog ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            padding: "0.5rem",
            zIndex: 9,
            background: "gray",
            boxShadow: "5px 6px 5px -6px rgba(0,0,0,0.75)",
            opacity: 1,
          }}
        >
          <p
            style={{ color: "white", textShadow: "1px 1px black" }}
          >{`Really Delete ${mapToDelete.name}?`}</p>
          {deletingMap ? (
            <DotLoader css={override} size={20} color={"#4A4A4A"} />
          ) : (
            <>
              <button
                onClick={() => {
                  setDeletingMap(true);
                  deleteMap(mapToDelete._id).then(() => {
                    setMapCollection(
                      mapCollection.filter((map) => map._id !== mapToDelete._id)
                    );
                    setDeletingMap(false);
                    setShowingDeleteDialog(false);
                  });
                }}
              >
                Yes
              </button>
              <button onClick={() => setShowingDeleteDialog(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
      {mapCollection.map((map) => (
        <MapCard
          map={map}
          owner={owner}
          deleteDialog={deleteDialog}
          showingDeleteDialog={showingDeleteDialog}
        />
      ))}
    </div>
  );
}
