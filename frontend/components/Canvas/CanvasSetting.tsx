"use client";

import { Canvas } from "fabric";
import { useEffect, useState } from "react";
import ToolInput from "../ToolBar/ToolInput";

export default function CanvasSetting({ canvas }: { canvas: Canvas | null }) {
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [canvasWidth, setCanvasWidth] = useState(500);

  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth * 0.8);
      setCanvasHeight(window.innerHeight * 0.8);
    };

    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    <div className="fixed -right-2 z-10 bottom-0 scale-90 flex flex-col py-6 px-4 bg-gray-800 text-white">
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
  );
}
