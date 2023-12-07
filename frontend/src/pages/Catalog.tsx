import PageLayout from "@src/components/layout/PageLayout";
import SearchBar from "@src/components/common/SearchBar";
import Button from "@src/components/common/Button";
import CatalogDropdown from "@src/components/catalog/CatalogDropdown";
import { IGame } from "@src/interfaces/games.i";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AddGameModal from "@src/components/catalog/AddGameModal";
import CatalogBody from "@src/components/catalog/CatalogBody";
import { getGamesByTypeAndSearch } from "@src/services/games";
import { useAuth } from "@src/context/AuthProvider";

const games: IGame[] = [];

const autoCompleteValues: { [key: string]: { id: number; label: string } } = {
  wordfind: { label: "Sopa de Letras", id: 1 },
  quiz: { label: "Cuestionarios", id: 2 },
  map: { label: "Mapas", id: 3 },
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [games, setGames] = useState<IGame[]>([]);
  const [open, setOpen] = useState(false);
  let filter = searchParams.get("filter") ?? null;
  const { auth } = useAuth();

  const handleFilterChange = function (
    event: React.SyntheticEvent,
    value: { id: number; label: string } | null
  ) {
    const activityTypes: { [key: string]: string } = {
      "Sopa de Letras": "wordfind",
      Cuestionarios: "quiz",
      Mapas: "map",
    };
    const params = new URLSearchParams(searchParams);
    params.delete("filter");
    if (!value) return setSearchParams(params.toString());
    setSearchParams({
      ...searchParams,
      filter: activityTypes[value?.label || ""],
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setOpen(true);
  const handleClose = (event: React.MouseEvent<HTMLDivElement>) =>
    setOpen(false);

  useEffect(() => {
    getGamesByTypeAndSearch(searchParams.get("filter") ?? "", search).then(
      (games) => {
        setGames(games);
      }
    );
    filter = searchParams.get("filter") ?? null;
  }, [searchParams, search]);

  return (
    <PageLayout>
      <main className="grow bg-white p-12 2xl:px-0 max-w-7xl mx-auto w-full">
        <div className="w-full flex gap-x-8 mb-12">
          <SearchBar
            onChange={handleSearchChange}
            placeholder="Buscar Actividad..."
            className="grow"
          />
          <CatalogDropdown
            value={filter ? autoCompleteValues[filter] : null}
            onChange={handleFilterChange}
          />
          {auth?.user?.role === "teacher" && (
            <>
              <Button
                onClick={handleOpen}
                variant="contained"
                className="text-base whitespace-nowrap normal-case bg-blue-500"
              >
                Agregar Actividad
              </Button>
              <AddGameModal open={open} handleClose={handleClose} />
            </>
          )}
        </div>
        <CatalogBody games={games} />
      </main>
    </PageLayout>
  );
}
