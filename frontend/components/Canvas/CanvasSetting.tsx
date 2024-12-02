"use client";

import { Canvas } from "fabric";
import { useEffect, useState } from "react";
import ToolInput from "../ToolBar/ToolInput";

export default function CanvasSetting({ canvas }: { canvas: Canvas | null }) {
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [canvasWidth, setCanvasWidth] = useState(500);

  useEffect(() => {
    if (canvas) {
      canvas.setDimensions({
        width: canvasWidth,
        height: canvasHeight,
      });
      canvas.renderAll();
    }
  }, [canvasHeight, canvasWidth, canvas]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const initValue = parseInt(value, 10);

    if (initValue >= 0) {
      setCanvasWidth(initValue);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const initValue = parseInt(value, 10);

    if (initValue >= 0) {
      setCanvasHeight(initValue);
    }
  };

  return (
    <div className="absolute h-[100dvh]">
      <div className="absolute right-1/2 bottom-10 scale-90 translate-x-1/2 flex flex-col gap-2 py-6 px-4 bg-gray-800 text-white">
        {/* <div className="w-full flex justify-end overflow-hidden">
             <div className="w-1/3 bg-gray-800 text-white text-center"> */}
        <ToolInput
          label="CanvasWidth"
          value={canvasWidth}
          onChange={handleWidthChange}
        />
        <ToolInput
          label="CanvasHeight"
          value={canvasHeight}
          onChange={handleHeightChange}
        />
        {/* </div> */}
      </div>
    </div>
  );
}
