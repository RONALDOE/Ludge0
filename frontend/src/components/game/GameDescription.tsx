import { TextareaAutosize } from "@mui/material";

type GameDescriptionProps = {
  description?: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void | (() => void)
}

export default function GameTitle(props: GameDescriptionProps) {
  return (
    <TextareaAutosize
      placeholder="Descripción"
      onChange={props.onChange}
      className={`text-gray-500 resize-none w-full block text-lg mt-2 outline-none ${props.description ? 'text-zinc-500' : 'text-zinc-400'}`}
      value={props.description}
    />
  )
}