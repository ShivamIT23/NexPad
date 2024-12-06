import { Canvas, FabricObject } from "fabric";
import { useEffect, useState } from "react";
import { Button, Select } from "blocksin-system";
import DownloadIcon from "../ToolBar/DownloadIcon";

export default function CroppingSettings({
  canvas,
  refreshKey,
}: {
  canvas: Canvas | null;
  refreshKey: number;
}) {
  const [frames, setFrames] = useState<FabricObject[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<FabricObject | null>(null);

  const updateFrames = () => {
    if (canvas) {
      const framesFromCanvas = canvas.getObjects("rect").filter((obj) => {
        console.log(obj.name);
        return obj.name && obj.name.startsWith("Frame");
      });

      setFrames(framesFromCanvas);

      if (framesFromCanvas.length > 0) {
        setSelectedFrame(framesFromCanvas[0]);
      }
    }
  };

  useEffect(() => {
    updateFrames();
  }, [canvas, refreshKey]);

  const handleFrameSelect = (value: string) => {
    if (!canvas) return;
    const selected = frames.find((frame) => frame.name === value);
    setSelectedFrame(selected as FabricObject);
    canvas.renderAll();
  };

  const exportFrameAsPNG = () => {
    if (!canvas || !selectedFrame) return;

    frames.forEach((frame) => {
      frame.set("visible", false);
    });

    selectedFrame.set({
      strokeWidth: 0,
      visible: true,
    });

    const dataURL = canvas.toDataURL({
      left: selectedFrame.left,
      top: selectedFrame.top,
      width: selectedFrame.width * selectedFrame.scaleX,
      height: selectedFrame.height * selectedFrame.scaleY,
      format: "png",
      multiplier: 1,
    });

    selectedFrame.set({
      strokeWidth: 1,
    });

    frames.forEach((frame) => {
      frame.set("visible", true);
    });

    canvas.renderAll();

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${selectedFrame.name}.png`;
    link.click();
    document.removeChild(link);
  };

  return (
    <div className={`${selectedFrame ? "" : "hidden"}`}>
      {frames.length > 0 && (
        <>
          <Select
            value={selectedFrame?.name || ""}
            onValueChange={handleFrameSelect}
          >
            <Select.Trigger aria-label="Frames">
              <Select.Value placeholder="Select a frame" />
            </Select.Trigger>
            <Select.Content side="buttom" sideOffset={8} align="start">
              {frames.map((frame, index) => {
                return (
                  <Select.Item key={index} value={frame.name}>
                    {frame.name}
                  </Select.Item>
                );
              })}
            </Select.Content>
          </Select>

          <Button fluid variant="solid" onClick={exportFrameAsPNG}>
            <DownloadIcon /> Export as PNG
          </Button>
        </>
      )}
    </div>
  );
}
