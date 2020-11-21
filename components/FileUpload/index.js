import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./fileUpload.module.css";
import { parseUpload } from "../../lib/editor/index";
import DotLoader from "react-spinners/DotLoader";
import { css } from "@emotion/core";
import { useRouter } from "next/router";

export default function Dropzone() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleFile = (data, extension) => parseUpload(data, extension, router);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const onDrop = useCallback((acceptedFiles) => {
    setLoading(true);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (e) => {
        let data;
        const ext = file.name.split(".").pop();
        if (ext === "csv") {
          data = file;
        } else if (ext === "xlsx") {
          data = new Uint8Array(e.target.result);
        }
        handleFile(data, ext);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      onMouseDown={(e) => e.preventDefault()}
      className={`${isDragActive ? styles.active : ""} ${styles.dropContainer}`}
    >
      {loading ? (
        <>
          <DotLoader css={override} size={60} color={"#4A4A4A"} />
          <p>Parsing File...</p>
        </>
      ) : (
        <>
          <input {...getInputProps()} />
          <>
            <h2>Drop a file or click to upload a new map</h2>
            <p>{"Accepted formats: .xlsx, .csv, .json, .shp"}</p>
          </>
        </>
      )}
    </div>
  );
}
