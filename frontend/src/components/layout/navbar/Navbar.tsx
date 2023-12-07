import { Link } from "react-router-dom"
import NavbarUser from "./NavbarUser";


export default function Navbar() {
  return (
    <nav className="bg-blue-500 px-10">
      <div className="max-w-screen-xl h-16 mx-auto flex justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-white text-lg my-auto cursor-pointer">
            LUDGEO
          </h1>
        </Link>
        <div className="my-auto ">
          <ul className="flex gap-14 justify-around text-blue-200 font-medium text-lg my-auto">
            <Link to={{ pathname: "/catalog", search: "?filter=wordfind" }}>
              <li className="cursor-pointer text-sm hover:text-white duration-300 transition-colors">
                Sopa de letras
              </li></Link>
            <Link to={{ pathname: "/catalog", search: "?filter=quiz" }}>
              <li className="cursor-pointer hover:text-white text-sm duration-300 transition-colors">
                Cuestionarios
              </li></Link>
            <Link to={{ pathname: "/catalog", search: "?filter=map" }}>
              <li className="cursor-pointer hover:text-white text-sm duration-300 transition-colors">
                Mapas
              </li></Link>
          </ul>
        </div>
        <div className=" my-auto">
          <NavbarUser />
        </div>
      </div>
    </nav>
  );
}
