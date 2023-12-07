import GameTitle from "@src/components/game/GameTitle"
import GameDescription from "@src/components/game/GameDescription"
import GameBreadcrumbs from "@src/components/game/GameBreadcrumbs"
import { useAuth } from "@src/context/AuthProvider"

type GameHeaderProps = {
  title: string,
  description: string,
  gameType: 'wordfind' | 'quiz' | 'map',
  onTitleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void | (() => void),
  onDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void | (() => void)
  className?: string
}

export default function GameHeader(props: GameHeaderProps) {
  const { auth } = useAuth()

  return (
    <div className={props.className}>
      <GameBreadcrumbs gameType={props.gameType} title={props.title} />
      <GameTitle title={props.title} gameType={props.gameType} onChange={props.onTitleChange} />
      <GameDescription description={props.description} onChange={props.onDescriptionChange} />
    </div>
  )
}