import "fabric";

declare module "fabric" {
  // Augmenting FabricObject
  interface FabricObject {
    id?: string;
    zIndex?: number; // Add zIndex property
    type?: string;
  }

  // Augmenting Canvas
  interface Canvas {
    updateZIndices(): void; // Add updateZIndices method
  }
}
