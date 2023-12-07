import QuizActivity from "@src/components/quiz/QuizActivity"
import GameHeader from "@src/components/game/GameHeader"
import { useQuiz } from "@src/hooks/useQuiz"
import Button from "@src/components/common/Button"
import ImportWords from "@src/components/game/ImportActitivities"
import ExportWords from "@src/components/game/ExportActivities"
import { useState, useEffect, useRef } from "react"
import { IActivity } from "@src/interfaces/activity.i"
import { updateGame, deleteGame } from "@src/services/games"
import { compareQuiz } from "@lib/utils/compareQuiz"
import { useNavigate } from "react-router-dom"
import Modal from "@src/components/common/Modal"
import { useAuth } from "@src/context/AuthProvider"
import { Link } from "react-router-dom"

export default function Quiz() {
  const { auth } = useAuth();
  const { quiz, setQuiz } = useQuiz()
  const [words, setWords] = useState<IActivity[]>([])
  const [hasChanged, setHasChanged] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const prevQuizRef = useRef(quiz)
  const navigate = useNavigate()

  const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuiz({ ...quiz, title: event.target.value })
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuiz({ ...quiz, description: event.target.value })
  }

  const handleAddActivity = () => {
    setQuiz({ ...quiz, activity: [...quiz.activity, { question: "", answer: "", value: 1 }] })
  }

  const handleSave = () => {
    if (!hasChanged) return
    updateGame(quiz)
      .then(() => setHasChanged(false))
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteDialog(false)
  }

  const handleDelete = () => {
    if (!quiz.id) return alert('No se puede eliminar la actividad')
    deleteGame(quiz.id).then(() => {
      navigate('/catalog')
    })
  }

  useEffect(() => {
    setQuiz({ ...quiz, activity: words })
  }, [words])

  useEffect(() => {
    const prevQuiz = prevQuizRef.current
    if (!compareQuiz(quiz, prevQuiz)) {
      setHasChanged(true)
    }
    prevQuizRef.current = quiz
  }, [quiz])

  return (
    <>
      <GameHeader
        title={quiz.title}
        description={quiz.description}
        gameType="quiz"
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
        className="mb-7"
      />
      <div className="flex mb-8">
        <ImportWords gameType="quiz" setWords={setWords} />
        <ExportWords gameType="quiz" words={quiz.activity} />
        <Link to={`/quiz/received/${quiz.id}`} className="ml-auto ">
          <Button variant="text" className="text-blue-500 border-blue-500 hover:bg-blue-100/25 hover:text-blue-500">Ver Entregas</Button>
        </Link>
        <Button variant="outlined" className="ml-5 text-blue-500 border-blue-500 hover:bg-blue-100/25" onClick={() => setOpenDeleteDialog(true)}>Eliminar</Button>
        <Button onClick={handleSave} variant="outlined" className={`ml-5 ${hasChanged ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500 cursor-default hover:border-blue-300'}`}>Guardar</Button>
        <Modal className="p-5 flex flex-col" isOpen={openDeleteDialog} handleClose={handleCloseDeleteModal}>
          <p className="text-lg text-blue-500">
            ¿Estás seguro que deseas eliminar esta actividad?
          </p>
          <div className="ml-auto mt-5">
            <Button onClick={handleCloseDeleteModal} variant="outlined" className="w-24  mr-5 text-blue-500 border-blue-500 hover:bg-blue-500/5">Cancelar</Button>
            <Button onClick={handleDelete} className="w-24 text-white bg-blue-500 hover:bg-blue-600">Eliminar</Button>
          </div>
        </Modal>
      </div>
      <h2 className="text-zinc-600 text-2xl pb-1 mb-12 border-b-2 border-b-zinc-200 block">{`Preguntas (${quiz.activity.length})`}</h2>
      <ol className="list-decimal ml-4">
        {quiz.activity.map((activity, index) => (
          <li key={activity.id ?? index} className="mb-10 group relative pl-3">
            <QuizActivity index={index} quiz={quiz} setQuiz={setQuiz} activity={activity} />
          </li>
        ))}
      </ol>
      <Button onClick={handleAddActivity} className="text-blue-500 text-base transition-all">AGREGAR PREGUNTA</Button>
    </>
  )
}