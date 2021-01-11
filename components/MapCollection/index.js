import { useState } from "react";
import { useRouter } from "next/router";
import MapCard from "./MapCard";
import { deleteMap } from "../../lib/api/maps";
import DotLoader from "react-spinners/DotLoader";
import { css } from "@emotion/core";
import DialogOverlay from "../DialogOverlay";

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
        <DialogOverlay>
          <p>{`Really Delete ${mapToDelete.name}?`}</p>
          {deletingMap ? (
            <DotLoader css={override} size={20} color={"#4A4A4A"} />
          ) : (
            <div>
              <button
                className={"inline mx-2"}
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
              <button
                className={"inline mx-2"}
                onClick={() => setShowingDeleteDialog(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </DialogOverlay>
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
