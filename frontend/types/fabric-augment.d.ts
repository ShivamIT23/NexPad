import "fabric";

declare module "fabric" {
  interface CanvasEvents {
    brush: { action: string };
    "brush:created": () => void; // Example for more specific events
    "drawing:mode:changed": () => void;
    drawing: { mode: string };
  };
  interface FabricObject {
    name?: string
  }
}
