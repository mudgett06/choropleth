import { guessMapData } from "./guesses";
import Papa from "papaparse";
import XLSX from "xlsx";
import axios from "axios";

export async function parseUpload(file, extension, router) {
  if (extension === "csv") {
    Papa.parse(file, {
      header: true,
      transformHeader: (h) => h.replace(".", ""),
      dynamicTyping: true,
      complete: function (res) {
        guessMapData(file.name, res.data).then((map) => {
          axios
            .post("/api/maps", map)
            .then((res) => router.push(`/maps/${res.data._id}/create`));
        });
      },
    });
  } else if (extension === "xlsx") {
    const wb = XLSX.read(file, { type: "array" });
    await guessMapData(
      file.name,
      XLSX.utils.sheet_to_json(wb.Sheets[Object.keys(wb.Sheets)[0]])
    ).then((r) => {
      return axios.post("/api/maps", r).data;
    });
  }
}
