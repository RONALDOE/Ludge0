import React from "react";
import { ButtonGroup, Button } from "@mui/material";
import ButtonDisabled from "../common/ButtonDisabled";

type DataGroupProps = {
  tiempo: string;
  preguntas: number;
  puntuacion: number;
  started: boolean;
  startGame: (bool: Boolean) => void;
};

const DataGroup = (props: DataGroupProps) => {
  return (
    <ButtonGroup variant="outlined" aria-label="outlined button group">
      <ButtonDisabled
        className="py-2.5 capitalize"
        text={"Tiempo Restante: " + props.tiempo}
      />
      <ButtonDisabled
        className="capitalize"
        text={"Preguntas Restantes: " + props.preguntas}
      />
      <ButtonDisabled
        className="capitalize"
        text={"Puntuación: " + props.puntuacion}
      />
      {props.started !== true ? (
        <Button
          disableElevation
          className="capitalize"
          variant="contained"
          onClick={() => props.startGame(true)}
        >
          Comenzar Juego
        </Button>
      ) : null}
    </ButtonGroup>
  );
};

export default DataGroup;
