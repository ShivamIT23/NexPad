"use client";
import LogoSvg from "@/components/ui/LogoSVG";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRouter } from "next/navigation";


export default function Page() {

  const router = useRouter();

  useGSAP(()=>{
    gsap.to(".logo-path", {
      delay: 6,
      scale: 0,
      duration: 0.3,
      transformOrigin: "center",
    });
    gsap.to(".loading", {
      delay: 6,
      opacity: 0,
      duration: 0.6,
      ease: "linear",
      display: "none",
      onComplete: () =>{
        router.push("/dashboard")
      }
    });
  })
    return <div>
      <div
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,1) 34%, rgba(230,254,255,1) 93%, rgba(222,250,255,1) 100%)",
          }}
          className="loading min-h-screen bg-white w-full fixed z-[99] flex justify-center items-center "
        >
          <LogoSvg />
        </div>
  </div>
}