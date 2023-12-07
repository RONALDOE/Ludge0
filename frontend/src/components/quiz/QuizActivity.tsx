import { IoMdTrash } from "react-icons/io"
import { TextareaAutosize } from "@mui/material"
import { IActivity } from "@interfaces/activity.i"
import { IGame } from "@interfaces/games.i"

type QuizActivityProps = {
  index: number,
  activity: IActivity,
  quiz: IGame,
  setQuiz: React.Dispatch<React.SetStateAction<IGame>>
}

export default function QuizActivity(props: QuizActivityProps) {
  const { index, activity, quiz, setQuiz } = props

  const handleActivityChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const index = Number(event.target.name)
    const newActivities = [...quiz.activity]
    newActivities[index] = { ...newActivities[index], [event.target.id]: event.target.value }
    setQuiz({ ...quiz, activity: newActivities })
  }

  const handleDeleteActivity = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const index = Number(event.currentTarget.id)
    const newActivities = [...quiz.activity]
    newActivities.splice(index, 1)
    setQuiz({ ...quiz, activity: newActivities })
  }

  return (
    <>
      <TextareaAutosize
        placeholder="Pregunta"
        id="question"
        name={index.toString()}
        className="outline-none block mb-4 w-full resize-none"
        value={activity.question}
        onChange={handleActivityChange}
      />
      <IoMdTrash
        onClick={handleDeleteActivity}
        id={index.toString()}
        className="text-blue-500 hidden group-hover:inline-block text-2xl cursor-pointer absolute top-[-2px] left-[-23px]"
      />
      <TextareaAutosize
        id="answer"
        onChange={handleActivityChange}
        name={index.toString()}
        placeholder="Respuesta"
        className="outline-none block mb-8 w-full text-zinc-500 resize-none"
        value={activity.answer}
      />
    </>
  )
}