import { useQuiz } from '../../hooks/useQuiz'
import GameTitle from '@src/components/game/GameTitle'
import GameDescription from '@src/components/game/GameDescription'
import { Breadcrumbs } from '@mui/material'
import { Link } from 'react-router-dom'
import PageLayout from '@src/components/layout/PageLayout'
import { useState, useEffect } from 'react'
import { IMatch } from '@src/interfaces/match.i'
import { getMatchesByGame } from '@src/services/matches'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  TextField
} from '@mui/material'
import { FaTrashAlt } from "react-icons/fa";
import { IUser } from '@src/interfaces/user.i'
import { getUserById } from '@src/services/user'
import Button from '@src/components/common/Button'
import { AiFillEye } from 'react-icons/ai'
import { deleteMatch } from '@src/services/matches'
import Modal from '@src/components/common/Modal'
import { updateGame } from '@src/services/games'

const quizStatus: { [key: string]: string } = {
  active: 'Activo',
  inactive: 'Cerrado'
}

export default function QuizReceived() {
  const { quiz, setQuiz } = useQuiz()
  const [matches, setMatches] = useState<IMatch[]>([])
  const [users, setUsers] = useState<IUser[]>([])
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const handleCloseDeleteModal = () => {
    setOpenDeleteDialog(false)
  }

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    const matchId = event.currentTarget.parentElement?.id
    if (!matchId) return alert('No se puede eliminar la actividad')
    deleteMatch(matchId).then(() => {
      setOpenDeleteDialog(false)
      setMatches(matches.filter(match => match.id !== matchId))
    })
  }

  const handleStatusChange = (event: React.SyntheticEvent, value: string | null) => {
    if (value === 'Cerrado') {
      setQuiz({ ...quiz, status: 'inactive' })
      updateGame({ ...quiz, status: 'inactive' })
      return
    }
    setQuiz({ ...quiz, status: 'active' })
    updateGame({ ...quiz, status: 'active' })
  }


  useEffect(() => {
    if (!quiz.id) return;
    getMatchesByGame(quiz.id).then(matches => {
      setMatches(matches)
    })
  }, [quiz.id])

  useEffect(() => {
    const users: IUser[] = []
    matches.forEach(match => {
      getUserById(match.participant as string).then(user => {
        users.push(user)
        setUsers(users)
      })
    })
  }, [matches])

  return (
    <PageLayout>
      <main className='grow max-w-7xl w-full mx-auto p-10 2xl:pl-0'>
        <Breadcrumbs aria-label="breadcrumb" className="mb-8">
          <Link to={{ pathname: "/catalog", search: `?filter=quiz` }} className="text-zinc-400">Cuestionarios</Link>
          <Link to={`/quiz/${quiz.id}`} className="text-zinc-400">{quiz.title}</Link>
          <span className="text-blue-500">Entregas</span>
        </Breadcrumbs>
        <GameTitle title={quiz.title} gameType='quiz' onChange={() => { }} />
        <GameDescription description={quiz.description} onChange={() => { }} />
        <div className='w-full flex items-center mt-8  mb-12'>
          <h2 className="text-blue-500 text-2xl pb-1">Entregas</h2>
          <Autocomplete
            isOptionEqualToValue={(option, value) => option === value}
            onChange={handleStatusChange}
            renderInput={(params) => (
              <TextField {...params} color='primary' placeholder="Actividades" />
            )}
            options={[
              'Activo',
              'Cerrado',
            ]}
            className='ml-auto border-blue-500 w-48'
            blurOnSelect
            value={quizStatus[quiz.status]}
            defaultValue={null}
          />
        </div>
        <TableContainer className='shadow rounded-md'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-bold'>Usuario</TableCell>
                <TableCell className='font-bold'>Estado</TableCell>
                <TableCell className='font-bold'>Respuestas</TableCell>
                <TableCell className='font-bold'>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match, index) => (
                <TableRow key={match.id ?? index}>
                  <TableCell>{users[index]?.login.username}</TableCell>
                  <TableCell>{match.status}</TableCell>
                  <TableCell>{match.answers.length}</TableCell>
                  <TableCell>
                    <div className='flex items-center h-full w-full'>
                      <Link to={`/quiz/review/${quiz.id}/${match.id}`} className="text-blue-500 hover:text-blue-600"><AiFillEye className='text-lg' /></Link>
                      <Button onClick={() => setOpenDeleteDialog(true)} className="text-blue-500 hover:text-blue-500 px-3 ml-2 min-w-0"><FaTrashAlt className='text-base' /></Button>
                      <Modal className="p-5 flex flex-col" isOpen={openDeleteDialog} handleClose={handleCloseDeleteModal}>
                        <p className="text-lg text-blue-500">
                          ¿Estás seguro que deseas eliminar esta actividad?
                        </p>
                        <div id={match.id} className="ml-auto mt-5">
                          <Button onClick={handleCloseDeleteModal} variant="outlined" className="w-24  mr-5 text-blue-500 border-blue-500 hover:bg-blue-500/5">Cancelar</Button>
                          <Button onClick={handleDelete} className="w-24 text-white bg-blue-500 hover:bg-blue-600">Eliminar</Button>
                        </div>
                      </Modal>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </PageLayout >
  )
}