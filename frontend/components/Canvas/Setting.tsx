"use client";

import { Canvas, FabricObject, Circle } from "fabric";
import { useEffect, useState } from "react";
import ToolInput from "../ToolBar/ToolInput";

export default function Settings({ canvas }: { canvas: Canvas | null }) {
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null
  );
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [diameter, setDiameter] = useState<number>(0);
  const [color, setColor] = useState<string>("");

  const handleObjectSelection = (object: FabricObject | null) => {
    if (!object) return;

    setSelectedObject(object);

    if (object.type === "rect") {
      setWidth(Math.round((object.width ?? 0) * (object.scaleX ?? 1)));
      setHeight(Math.round((object.height ?? 0) * (object.scaleY ?? 1)));
      setColor(object.fill?.toString() || "");
      setDiameter(0);
    } else if (object.type === "circle") {
      const circle = object as Circle;
      setDiameter(Math.round((circle.radius ?? 0) * 2 * (circle.scaleX ?? 1)));
      setColor(circle.fill?.toString() || "");
      setWidth(0);
      setHeight(0);
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (event: { selected: FabricObject[] }) => {
      handleObjectSelection(event.selected[0] || null);
    };

    const handleClear = () => {
      setSelectedObject(null);
      setWidth(0);
      setHeight(0);
      setDiameter(0);
      setColor("");
    };

    const handleObjectModified = (event: { target: FabricObject }) => {
      handleObjectSelection(event.target);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleClear);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:scaling", handleObjectModified);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleClear);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:scaling", handleObjectModified);
    };
  }, [canvas]);

  const updateObject = (
    property: keyof FabricObject | "radius",
    value: number | string
  ) => {
    if (selectedObject) {
      selectedObject.set({ [property]: value });
      canvas?.renderAll();

      handleObjectSelection(selectedObject);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setWidth(value);
    if (selectedObject?.type === "rect" && value >= 0) {
      updateObject("width", value / (selectedObject.scaleX || 1));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setHeight(value);
    if (selectedObject?.type === "rect" && value >= 0) {
      updateObject("height", value / (selectedObject.scaleY || 1));
    }
  };

  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setDiameter(value);
    if (selectedObject?.type === "circle" && value >= 0) {
      updateObject("radius", value / 2 / (selectedObject.scaleX || 1));
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColor(value);
    updateObject("fill", value);
  };

  return (
    <div
      className={`${
        selectedObject ? "fixed" : "hidden"
      } right-4 z-10 top-1/2 scale-90 -translate-y-1/2 flex flex-col gap-2 py-6 px-4 bg-gray-800 text-white`}
    >
      {selectedObject && (
        <>
          {selectedObject.type === "rect" && (
            <>
              <ToolInput
                label="Width"
                value={width}
                onChange={handleWidthChange}
              />
              <ToolInput
                label="Height"
                value={height}
                onChange={handleHeightChange}
              />
            </>
          )}
          {selectedObject.type === "circle" && (
            <>
              <ToolInput
                label="Diameter"
                value={diameter}
                onChange={handleDiameterChange}
              />
            </>
          )}
          <ToolInput label="Color" type="color" value={color} onChange={handleColorChange} />
        </>
      )}
    </div>
  );
}
