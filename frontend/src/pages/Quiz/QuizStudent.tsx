import GameHeader from '@src/components/game/GameHeader';
import { useMatch } from '@src/hooks/useMatch';
import { useEffect, useState, useRef } from 'react';
import { updateMatch } from '@src/services/matches';
import { IMatch } from '@src/interfaces/match.i';
import { TextareaAutosize } from '@mui/material';
import Button from '@src/components/common/Button';
import { compareMatch } from '@src/lib/utils/compareMatch';

export default function QuizStudent() {
  const { match, setMatch, matchGame } = useMatch();
  const [hasChanged, setHasChanged] = useState(false)
  const prevMatchRef = useRef(match)

  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!match.id) return
    const index = Number(event.target.name);
    const newAnswers = [...match.answers];
    newAnswers[index] = { ...newAnswers[index], "answer": event.target.value };
    setMatch({ ...match, answers: newAnswers });
  }

  const handleSave = () => {
    if (!hasChanged || matchGame.status === 'inactive') return
    const newAnswers = match.answers.filter((answer) => answer.answer === '')
    const newMatch: IMatch = {
      ...match,
      answers: newAnswers
    }
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

  console.log(match)

  return (
    <>
      {matchGame.id && (
        <>
          <GameHeader description={matchGame.description} onDescriptionChange={() => { }} onTitleChange={() => { }} gameType="quiz" title={matchGame.title} />
          <Button className="mt-8" onClick={handleSave} disabled={!hasChanged || matchGame.status === 'inactive'}>Guardar Respuestas</Button>
          <h2 className="text-zinc-600 mt-10 text-2xl pb-1 mb-12 border-b-2 border-b-zinc-200 block">{`Respuestas ${match.answers.filter((answer) => answer.answer !== ' ').length}/${matchGame.activity.length}`}</h2>
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
                <TextareaAutosize
                  id="answer"
                  name={index.toString()}
                  placeholder="Respuesta"
                  className={`outline-none block mb-4 w-full  resize-none ${match.answers[index]?.note === undefined ? 'text-zinc-500' : 'text-red-400'}`}
                  onChange={handleAnswerChange}
                  value={match.answers[index]?.answer || ''}
                  readOnly={matchGame.status === 'inactive'}
                />
                {(match.answers[index]?.note !== undefined) && (
                  <TextareaAutosize
                    placeholder="Nota"
                    id="note"
                    readOnly={true}
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
    </>
  )
}