import { BaseBrush, Canvas } from "fabric";
import ToolInput from "../ToolBar/ToolInput";
import { useEffect, useState } from "react";

export default function BrushSetting({ canvas }: { canvas: Canvas | null }) {
  const isBrowser = typeof window !== "undefined";

  const [selectedObject, setSelectedObject] = useState<BaseBrush | null>(null);
  const [width, setWidth] = useState(1);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (!isBrowser || !canvas) return;
    
    const updateBrushSettings = () => {
      if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
        setSelectedObject(canvas.freeDrawingBrush);
        setWidth(canvas.freeDrawingBrush.width);
        setColor(canvas.freeDrawingBrush.color || "#000000");
      } else {
        setSelectedObject(null);
      }
    };

    updateBrushSettings();

    canvas.on('brush:created', updateBrushSettings);
    canvas.on('drawing:mode:changed', updateBrushSettings);

    return () => {
      canvas.off('brush:created', updateBrushSettings);
      canvas.off('drawing:mode:changed', updateBrushSettings);
    };
  }, [canvas, isBrowser]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setWidth(value);
    if (!selectedObject) return;
    selectedObject.width = value;
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColor(value);
    if (!selectedObject) return;
    selectedObject.color = value;
  };

  return (
    <div
      className={`${
        selectedObject ? "fixed flex" : "hidden"
      } right-4 z-10 top-1/2 scale-90 -translate-y-1/2  flex-col gap-2 py-6 px-4 bg-gray-800 text-white`}
    >
      {selectedObject && (
        <>
          <ToolInput label="Width" value={width} onChange={handleWidthChange} />
          <ToolInput
            label="Color"
            type="color"
            value={color}
            onChange={handleColorChange}
          />
        </>
      )}
    </div>
  );
}
