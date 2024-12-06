import { Canvas, FabricObject } from "fabric";
import { useEffect, useState } from "react";

type FabricSelectionEvent = {
  selected?: FabricObject[]; // Objects in the selection
  deselected?: FabricObject[]; // Objects deselected during the event
  target?: FabricObject; // The main target object, if applicable
  e?: Event; // The native DOM event
};

export default function LayersList({ canvas }: { canvas: Canvas | null }) {
  const [layers, setLayers] = useState<FabricObject[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const addIdToObject = (object: FabricObject) => {
    if (!object.id) {
      const timestamp = new Date().getTime();
      object.id = `${object.type}_${timestamp}`;
    }
  };

  Canvas.prototype.updateZIndices = function () {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      addIdToObject(obj);
      obj.zIndex = index;
    });
  };

  const updateLayers = () => {
    if (!canvas) return;
    canvas.updateZIndices();
    const objects = canvas
      .getObjects()
      .filter(
        (obj) =>
          !(
            obj.id?.startsWith("vertical-") || obj.id?.startsWith("horizontal-")
          )
      )
      .map((obj) => {
        if (!obj || !obj.id || !obj.zIndex || !obj.type) return null;
        return obj;
      })
      .filter((obj): obj is FabricObject => obj !== null);
    setLayers([...objects].reverse());
  };

  const handleObjectSelected = (e: FabricSelectionEvent) => {
    const selectedObject = e.selected ? e.selected[0] : null;

    if (selectedObject && selectedObject.id) {
      setSelectedLayer(selectedObject.id);
    } else {
      setSelectedLayer(null);
    }
  };

  const selectLayerInCanvas = (layerId: string) => {
    if (!canvas) return;
    const object = canvas.getObjects().find((obj) => obj.id === layerId);
    if (object) {
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", updateLayers);
      canvas.on("object:removed", updateLayers);
      canvas.on("object:modified", updateLayers);

      canvas.on("selection:created", handleObjectSelected);
      canvas.on("selection:updated", handleObjectSelected);
      canvas.on("selection:cleared", () => setSelectedLayer(null));

      updateLayers();

      return () => {
        canvas.off("object:added", updateLayers);
        canvas.off("object:removed", updateLayers);
        canvas.off("object:modified", updateLayers);
        canvas.off("selection:created", handleObjectSelected);
        canvas.off("selection:updated", handleObjectSelected);
        canvas.off("selection:cleared", () => setSelectedLayer(null));
      };
    }
  }, [canvas]);

  return (
    <div>
      <ul>
        {layers.map(
          (layer) =>(
              <li
                key={layer.id!}
                onClick={() => selectLayerInCanvas(layer.id!)}
                className={layer.id === selectedLayer ? "selected-layer" : ""}
              >
                {layer.type} ({layer.zIndex})
              </li>
            )
        )}
      </ul>
    </div>
  );
}
