"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Textbox, Circle, Line , CircleBrush , Triangle } from "fabric";
import Settings from "./Setting";
import ButtonTool from "../ToolBar/ButtonTool";
import CanvasSetting from "./CanvasSetting";
import RecordIcon from "../ToolBar/RecordIcon";
import StopIcon from "../ToolBar/StopIcon";
import RectangleIcon from "../ToolBar/RectangleIcon";
import CircleIcon from "../ToolBar/CircleIcon";
import VideoIcon from "../ToolBar/VideoIcon";
import { handleObjectMoving , clearGuidelines } from "@/lib/snappingHelper";
import BrushIcon from "../ToolBar/BrushIcon";
import TriangleIcon from "../ToolBar/TriangleIcon";
import CursorIcon from "../ToolBar/CursorIcon";
import TextIcon from "../ToolBar/TextIcon";

const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [recordingChunks, setRecordingChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [canRecord, setCanRecord] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [guidelines , setGuidelines] = useState<Line[]>([])

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    if (typeof window !== "undefined" && canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current, {
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "white",
        selection: true,
      });

      fabricCanvas.renderAll();
      setCanvas(fabricCanvas);

      fabricCanvas.on("object:moving",(event)=> {
        handleObjectMoving(fabricCanvas , event.target, guidelines, setGuidelines)
      })
      
      fabricCanvas.on("object:modified",()=> {
        clearGuidelines(fabricCanvas )
      })


      return () => {
        window.removeEventListener("resize", handleResize);
        fabricCanvas.dispose();
      };
    }
  }, []);

  const addRectangle = () => {
    if (canvas) {
      const rectangle = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        stroke: "#DB4D42",
        strokeWidth:3,
        fill: "#ffffff",
      });
      canvas.add(rectangle);
    }
  };

  const addCircleBrush = () => {
    if (canvas) {
      canvas.freeDrawingBrush = new CircleBrush(canvas);
      canvas.isDrawingMode = true;
    }
  };

  const handleCursor = () => {
    if (canvas) {
      canvas.isDrawingMode = false;
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        top: 100,
        left: 100,
        radius: 60,
        stroke: "#DB4D42",
        strokeWidth:3,
        fill: "#ffffff",
      });
      canvas.add(circle);
    }
  };

  const addTriangle = () => {
    if (canvas) {
      const triangle = new Triangle({
        top: 100,
        left: 100,
        radius: 60,
        stroke: "#DB4D42",
        strokeWidth:3,
        fill: "#ffffff",
      });
      canvas.add(triangle);
    }
  };

  const addText = () => {
    if (canvas) {
        const text = new Textbox("Text Here", {
          left: 20,
          top: 20,
          fontSize: 24,
          fill: "black",
          editable: true,
        });
        canvas.add(text);
        canvas.renderAll();
    }
  };

  const showRecordingButton = () => {
    setCanRecord((prev) => !prev);
  };

  const handleStartRecording = () => {
    const stream = canvasRef.current?.captureStream();
    if (!stream) return;

    if (mediaRecorderRef) {
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
      });
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
      setIsRecording(true);

      canvas?.getObjects().forEach((obj) => {
        obj.hasControls = false;
        obj.selectable = false;
      });

      canvas?.renderAll();

      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    canvas?.getObjects().forEach((obj) => {
      obj.hasControls = true;
    });
    canvas?.renderAll();

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      setRecordingChunks((prev) => [...prev, event.data]);
    }
  };

  const handleExportVideo = () => {
    const blob = new Blob(recordingChunks, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "canvas-video.mp4";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    setRecordingChunks([]);
  };

  const tools = [
    { label: "Text", icon: <TextIcon />, action: addText },
    { label: "Cursor", icon: <CursorIcon />, action: handleCursor },
    { label: "Brush", icon: <BrushIcon />, action: addCircleBrush },
    { label: "Triangle", icon: <TriangleIcon />, action: addTriangle },
    { label: "Rectangle", icon: <RectangleIcon />, action: addRectangle },
    { label: "Circle", icon: <CircleIcon />, action: addCircle },
    { label: "Record", icon: <VideoIcon />, action: showRecordingButton },
  ];

  return (
    <div className="relative flex flex-col box-border items-center w-[98vw] h-[98vh] p-8">
      <div className="fixed z-40 top-1/2 left-4 -translate-y-1/2 flex flex-col gap-2 p-2 border-r-4 border-gray-500">
        {tools.map((tool) => (
          <ButtonTool key={tool.label} onClick={tool.action}>
            {tool.icon}
          </ButtonTool>
        ))}
      </div>
      <div
        className={`${!canRecord ? "hidden" : "flex"} flex-col items-center`}
      >
        {isRecording && (
          <div className="text-sm text-gray-600 mb-1">
            {new Date(recordingTime * 1000).toISOString().substring(11, 19)}
          </div>
        )}
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`
            flex items-center justify-center gap-2
            h-11 min-w-[44px] px-4
            rounded
            text-[13px] leading-5
            font-semibold
            cursor-pointer
            disabled:bg-neutral-200 disabled:text-neutral-400 disabled:pointer-events-none
            ${isRecording 
              ? 'bg-gray-200 text-neutral-600' 
              : 'bg-transparent text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200'
            }
          `}
        >
          {isRecording ? (
            <>
              <StopIcon  /> End
            </>
          ) : (
            <>
              <RecordIcon  /> Record
            </>
          )}
        </button>

        <button
          onClick={handleExportVideo}
          className={`
            flex items-center justify-center gap-2
            h-11 min-w-[44px] px-4
            rounded
            text-[13px] leading-5
            font-semibold
            cursor-pointer
            bg-primary text-white
            hover:bg-primary-600 
            active:bg-primary-700
            disabled:bg-neutral-200 disabled:text-neutral-400 disabled:pointer-events-none
          `}
          disabled={!recordingChunks.length}
        >
          Export Video
        </button>
      </div>
      <canvas ref={canvasRef} className="border-2" />
      <Settings canvas={canvas} />
      <CanvasSetting canvas={canvas} />
    </div>
  );
};

export default CanvasPage;
