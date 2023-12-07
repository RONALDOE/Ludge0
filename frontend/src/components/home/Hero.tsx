import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Globe from "./Globe";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Hero() {
  return (
    <section className="bg-blue-500">
      <div className="max-w-7xl w-full mx-auto flex">
        <div className="w-7/12 py-36 pl-[5%] flex flex-col items-start gap-y-7 2xl:pl-0">
          <h1 className="text-white text-3xl md:text-4xl xl:text-5xl font-extrabold">
            Tus conocimientos a prueba de forma eficiente
          </h1>
          <p className="text-white text-sm md:text-base xl:text-lg">
            Ludgeo te brinda las mejores herramientas para ampliar efectivamente
            tus conocimientos en el área de ciencias sociales
          </p>
          <Link to="/catalog">
            <Button
              variant="outlined"
              size="large"
              className=" hover:bg-white text-sm md:text-base xl:text-lg hover:text-blue-500 text-white border-white normal-case"
            >
              Comenzar a aprender
            </Button>
          </Link>
        </div>
        <div className="grow relative flex items-center justify-center overflow-hidden">
          <div className="object-contain absolute w-full h-[50vw] max-h-[90%] cursor-grab">
            <Canvas
              resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
              camera={{ position: [0, 0, 30], fov: 50 }}
            >
              <ambientLight intensity={0.75} />
              <pointLight position={[10, 10, 15]} />
              <directionalLight position={[10, 10, -100]} />
              <Globe />
              <OrbitControls
                autoRotateSpeed={0.5}
                enableZoom={false}
                autoRotate
              />
            </Canvas>
          </div>

        </div>
      </div>
    </section>
  );
}
