import GameHeader from '@src/components/game/GameHeader';
import { useMatch } from '@src/hooks/useMatch';
import { useEffect, useState, useRef } from 'react';
import { updateMatch } from '@src/services/matches';
import { IMatch } from '@src/interfaces/match.i';
import { TextareaAutosize } from '@mui/material';
import Button from '@src/components/common/Button';
import { compareMatch } from '@src/lib/utils/compareMatch';
import { useNavigate } from 'react-router';
import { useAuth } from '@src/context/AuthProvider';
import PageLayout from '@src/components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';
import GameTitle from '@src/components/game/GameTitle';
import GameDescription from '@src/components/game/GameDescription';
import { MdAddBox } from 'react-icons/md'
import { IoMdTrash } from 'react-icons/io'

export default function QuizReview() {
  const { match, setMatch, matchGame } = useMatch();
  const [hasChanged, setHasChanged] = useState(false)
  const prevMatchRef = useRef(match)
  const navigate = useNavigate()
  const { auth } = useAuth()

  if (auth.user?.role !== 'teacher') navigate('/')

  const handleAddNote = (event: React.MouseEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.parentElement?.id)
    const newAnswers = [...match.answers]
    newAnswers[index] = { ...newAnswers[index], "note": "La respuesta correcta era: " + matchGame.activity[index].answer }
    setMatch({ ...match, answers: newAnswers })
  }

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!match.id) return
    const index = Number(event.target.parentElement?.id);
    const newAnswers = [...match.answers];
    newAnswers[index] = { ...newAnswers[index], "note": event.target.value };
    setMatch({ ...match, answers: newAnswers });
  }

  const handleDeleteNote = (event: React.MouseEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.parentElement?.id)
    const newAnswers = [...match.answers]
    newAnswers[index] = { ...newAnswers[index], "note": undefined }
    setMatch({ ...match, answers: newAnswers })
  }

  const handleSave = () => {
    if (!hasChanged) return
    // add a space to the answers with empty answer
    const newAnswers = match.answers.filter((answer) => answer.note !== '').map((answer) => {
      if (answer.answer === '') {
        return { ...answer, answer: ' ' }
      }
      return answer
    })
    const newMatch: IMatch = {
      ...match,
      answers: newAnswers
    }
    console.log(newMatch)
    updateMatch(newMatch)
      .then(() => setHasChanged(false))
  }

  useEffect(() => {
    const prevMatch = prevMatchRef.current
    if (!compareMatch(match, prevMatch)) {
      setHasChanged(true)
    }
    prevMatchRef.current = match
  }, [match])

  return (
    <PageLayout>
      <main className='grow max-w-7xl w-full mx-auto p-10 2xl:pl-0'>
        {matchGame.id && (
          <>
            <div>
              <Breadcrumbs aria-label="breadcrumb" className="mb-8">
                <Link to={{ pathname: "/catalog", search: `?filter=quiz` }} className="text-zinc-400">Cuestionarios</Link>
                <Link to={`/quiz/${matchGame.id}`} className="text-zinc-400">{matchGame.title}</Link>
                <Link to={`/quiz/received/${matchGame.id}`} className="text-zinc-400">Entregas</Link>
                <span className="text-blue-500">{match.id}</span>
              </Breadcrumbs>
              <GameTitle title={matchGame.title} gameType='quiz' onChange={() => { }} />
              <GameDescription description={matchGame.description} onChange={() => { }} />
            </div>
            <Button className="mt-8" onClick={handleSave} disabled={!hasChanged}>Guardar Correción</Button>
            <h2 className="text-zinc-600 mt-10 text-2xl pb-1 mb-12 border-b-2 border-b-zinc-200 block">{`Puntuación ${match.answers.length - match.answers.filter(answer => answer.note !== undefined).length}/${matchGame.activity.length}`}</h2>
            <ol className="list-decimal ml-4">
              {matchGame.activity.map((activity, index) => (
                <li key={activity.id ?? index} id={index.toString()} className="mb-10 group relative pl-3">
                  <TextareaAutosize
                    placeholder="Pregunta"
                    id="question"
                    name={index.toString()}
                    className="outline-none block mb-4 w-full resize-none"
                    value={activity.question}
                    readOnly={true}
                  />
                  {match.answers[index]?.note === undefined ? (
                    <Button className="text-blue-500 min-w-0 p-0 bg-white hidden group-hover:inline-block text-2xl cursor-pointer absolute top-[-2px] left-[-23px]" onClick={handleAddNote}>
                      <MdAddBox />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDeleteNote}
                      className="text-blue-500 min-w-0 p-0 bg-white hidden group-hover:inline-block text-2xl cursor-pointer absolute top-[-2px] left-[-23px]"
                    >
                      <IoMdTrash />
                    </Button>
                  )
                  }
                  <TextareaAutosize
                    id="answer"
                    name={index.toString()}
                    placeholder="Respuesta"
                    className={`outline-none block mb-4 w-full  resize-none ${match.answers[index]?.note === undefined ? 'text-zinc-500' : 'text-red-400'}`}
                    value={'Respuesta del Estudiante: ' + match.answers[index]?.answer || ''}
                    readOnly={true}
                  />
                  <TextareaAutosize
                    id="answer"
                    name={index.toString()}
                    placeholder="Respuesta"
                    className="outline-none block mb-4 w-full text-zinc-500 resize-none"
                    value={"Respuesta Correcta: " + activity.answer || ''}
                    readOnly={true}
                  />
                  {(match.answers[index]?.note !== undefined) && (
                    <TextareaAutosize
                      placeholder="Nota"
                      id="note"
                      onChange={handleNoteChange}
                      name={index.toString()}
                      className="outline-none mb-0 w-full resize-none"
                      value={match.answers[index]?.note || ''}
                    />
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
      </main>
    </PageLayout>
  )
}