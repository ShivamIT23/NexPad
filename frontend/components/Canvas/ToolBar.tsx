import {
  Canvas,
  PencilBrush,
  Rect,
  Textbox,
  Circle,
  Triangle,
  CircleBrush,
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

interface ToolBarProps {
  canvas: Canvas | null;
  setCanRecord: Dispatch<SetStateAction<boolean>>;
}

export default function ToolBar({
  canvas,
  setCanRecord,
}: ToolBarProps): JSX.Element {
  const addRectangle = () => {
    if (canvas) {
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
    if (canvas) {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.isDrawingMode = true;
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
        strokeWidth: 3,
        fill: "transparent",
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
        strokeWidth: 3,
        fill: "transparent",
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

  const tools = [
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
      <div className="fixed z-40 top-1/2 left-4 -translate-y-1/2 flex flex-col gap-2 p-2 border-r-4 border-gray-500">
        {tools.map((tool) => (
          <ButtonTool key={tool.label} onClick={tool.action}>
            {tool.icon}
          </ButtonTool>
        ))}
      </div>
      <Settings canvas={canvas} />
    </>
  );
}
