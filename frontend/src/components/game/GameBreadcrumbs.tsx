import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";

type GameBreadcrumbsProps = {
  gameType: string,
  title: string
}

const gameTypes: { [key: string]: string } = {
  wordfind: "Sopa de letras",
  quiz: "Cuestionarios",
  map: "Mapas",
}

export default function GameBreadcrumbs({ gameType, title }: GameBreadcrumbsProps) {
  return (
    <Breadcrumbs aria-label="breadcrumb" className="mb-8">
      <Link to={{ pathname: "/catalog", search: `?filter=${gameType}` }} className="text-zinc-400">{gameTypes[gameType]}</Link>
      <span className="text-blue-500">{title}</span>
    </Breadcrumbs>
  )
}