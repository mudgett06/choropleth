import { CompactPicker } from "react-color";
import { useContext } from "react";
import EditorContext from "../../context";

export default function ColorInterface({ editingState }) {
  const { styles, updateStyle } = useContext(EditorContext);

  const handleColorChange = (color) => {
    const { hex } = color;
    if (editingState === "fillColor") {
      updateStyle({
        fillColor: hex,
      });
    } else if (editingState === "color") {
      updateStyle({
        color: hex,
      });
    }
  };
  return (
    <>
      <CompactPicker
        color={editingState === "color" ? styles.color : styles.fillColor}
        onChange={handleColorChange}
        disableAlpha={true}
      />
    </>
  );
}
