import { TextareaAutosize } from "@mui/material";

type GameTitleProps = {
  title?: string
  gameType: 'wordfind' | 'quiz' | 'map',
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void | (() => void),
}

const gameTitles: { [key: string]: string } = {
  wordfind: "Nueva Sopa de Letras",
  quiz: "Nuevo Cuestionario",
  map: "Nuevo Mapa",
};

export default function GameTitle(props: GameTitleProps) {

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement | HTMLTextAreaElement>) => {
    const isEmpty = !event.target.value
    if (isEmpty) {
      event.target.value = gameTitles[props.gameType];
      props.onChange(event);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    event.currentTarget.select();
  };

  return (
    <TextareaAutosize
      onBlur={handleBlur}
      onClick={handleClick}
      onChange={props.onChange}
      className="outline-none block mb-8 text-blue-500 resize-none w-full text-4xl font-bold"
      value={props.title}
    />
  );
}
