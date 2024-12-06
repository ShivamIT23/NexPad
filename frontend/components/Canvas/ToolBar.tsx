import {
  Canvas,
  PencilBrush,
  Rect,
  Textbox,
  Circle,
  Triangle,
  CircleBrush,
  FabricObject,
} from "fabric";
import TextIcon from "../ToolBar/TextIcon";
import CursorIcon from "../ToolBar/CursorIcon";
import CircleBrushIcon from "../ToolBar/CircleBrushIcon";
import TriangleIcon from "../ToolBar/TriangleIcon";
import RectangleIcon from "../ToolBar/RectangleIcon";
import CircleIcon from "../ToolBar/CircleIcon";
import VideoIcon from "../ToolBar/VideoIcon";
import ButtonTool from "../ToolBar/ButtonTool";
import { Dispatch, SetStateAction } from "react";
import PencilBrushIcon from "../ToolBar/PencilBrushIcon";
import Settings from "./Setting";
import BrushSetting from "./BrushSetting";
import CropButtonIcon from "../ToolBar/CropButtonIcon";

interface ToolBarProps {
  canvas: Canvas | null;
  setCanRecord: Dispatch<SetStateAction<boolean>>;
  setRefreshKey: Dispatch<SetStateAction<number>>;
}

export default function ToolBar({
  canvas,
  setCanRecord,
  setRefreshKey,
}: ToolBarProps): JSX.Element {
  const isBrowser = typeof window !== 'undefined';

  const addRectangle = () => {
    if (!isBrowser) return;
    if (canvas) {
      canvas.freeDrawingBrush = undefined;
      canvas.isDrawingMode = false;
      const rectangle = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        stroke: "#DB4D42",
        strokeWidth: 3,
        fill: "transparent",
      });
      canvas.add(rectangle);
    }
  };

  const addPencil = () => {
    if (!isBrowser || !canvas) return;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.fire("brush", { action: "created" });
  };

  const addCircleBrush = () => {
    if (!isBrowser || !canvas) return;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new CircleBrush(canvas);
    canvas.freeDrawingBrush.width = 3;
    canvas.fire("brush", { action: "created" });
  };

  const handleCursor = () => {
    if (!isBrowser || !canvas) return;
    canvas.isDrawingMode = false;
    canvas.fire("drawing",{mode:"changed"});
  };

  const addCircle = () => {
    if (!isBrowser) return;
    if (canvas) {
      canvas.freeDrawingBrush = undefined;
      canvas.isDrawingMode = false;
      const circle = new Circle({
        top: 100,
        left: 100,
        radius: 60,
        stroke: "#DB4D42",
        strokeWidth: 3,
        fill: "transparent",
      });
      canvas.add(circle);
    }
  };

  const addTriangle = () => {
    if (!isBrowser) return;
    if (canvas) {
      canvas.freeDrawingBrush = undefined;
      canvas.isDrawingMode = false;
      const triangle = new Triangle({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        stroke: "#DB4D42",
        strokeWidth: 3,
        fill: "transparent",
      });
      canvas.add(triangle);
    }
  };

  const addText = () => {
    if (!isBrowser) return;
    if (canvas) {
      canvas.freeDrawingBrush = undefined;
      canvas.isDrawingMode = false;
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

  const addFrameToCanvas = () => {
    if(!canvas) return;
    const frameName = `Frame ${canvas.getObjects("rect").length + 1}`;

    const frame = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      fill: "transparent",
      stroke: "#07FE3D",
      strokeWidth: 1,
      selectable: true,
      evented: true,
      name: frameName,
    });

    canvas.add(frame);
    canvas.renderAll();

    const maintainStrokeWidth = (object : FabricObject) => {
      const scaleX = object.scaleX || 1;
      const scaleY = object.scaleY || 1;

      object.set({
        width: object.width * scaleX,
        height: object.height * scaleY,
        scaleX: 1,
        scaleY: 1,
        strokeWidth: 1,
      });

      object.setCoords();
    };

    frame.on("scaling", () => {
      maintainStrokeWidth(frame);
      canvas.renderAll();
    });

    frame.on("modified", () => {
      maintainStrokeWidth(frame);
      canvas.renderAll();
    });

    handleFramesUpdate();
  };

  const handleFramesUpdate = () => {
    setRefreshKey((prev)=> prev+1);
  }

  const tools = [
    {label : "Frame",  icon : <CropButtonIcon/> , action: addFrameToCanvas },
    { label: "Text", icon: <TextIcon />, action: addText },
    { label: "Cursor", icon: <CursorIcon />, action: handleCursor },
    { label: "Brush", icon: <CircleBrushIcon />, action: addCircleBrush },
    { label: "Pencil", icon: <PencilBrushIcon />, action: addPencil },
    { label: "Triangle", icon: <TriangleIcon />, action: addTriangle },
    { label: "Rectangle", icon: <RectangleIcon />, action: addRectangle },
    { label: "Circle", icon: <CircleIcon />, action: addCircle },
    { label: "Record", icon: <VideoIcon />, action: showRecordingButton },
  ];

  return (
    <>
      <div className="fixed z-40 top-1/2 left-0 -translate-y-1/2 flex flex-col gap-2 p-2 border-r-4 border-gray-300">
        {tools.map((tool) => (
          <ButtonTool key={tool.label} onClick={tool.action}>
            {tool.icon}
          </ButtonTool>
        ))}
      </div>
      <BrushSetting canvas={canvas} />
      <Settings canvas={canvas} />
    </>
  );
}
