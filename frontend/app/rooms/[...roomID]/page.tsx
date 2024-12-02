// app/room/[...id]/page.tsx
"use client"
import dynamic from 'next/dynamic';

const CanvasPage = dynamic(()=> import("@/components/Canvas/CanvasPage"), {ssr:false});

const RoomPage = () => {
  return (
    <div>
      <CanvasPage />
    </div>
  );
};

export default RoomPage;
