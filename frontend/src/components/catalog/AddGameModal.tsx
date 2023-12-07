import { Card, CardActionArea, Grid } from '@mui/material';
import { RiQuestionnaireFill } from 'react-icons/ri';
import { RiFileSearchFill } from 'react-icons/ri';
import { IoMap } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { createGame } from '@src/services/games';
import { IGame } from '@src/interfaces/games.i';
import { useAuth } from '@src/context/AuthProvider';
import { useNavigate } from 'react-router-dom';

type AddGameModalProps = {
  open: boolean;
  handleClose: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const games = [
  {
    title: 'Sopa de Letras',
    type: 'wordfind',
    icon: (
      <RiFileSearchFill className="text-blue-500 text-[120px] group-hover:text-blue-600" />
    ),
  },
  {
    title: 'Cuestionario',
    type: 'quiz',
    icon: (
      <RiQuestionnaireFill className="text-blue-500 text-[120px] group-hover:text-blue-600" />
    ),
  },
  {
    title: 'Mapa',
    type: 'map',
    icon: (
      <IoMap className="text-blue-500 text-[120px] group-hover:text-blue-600" />
    ),
  },
];

export default function AddGameModal({
  open,
  handleClose,
}: AddGameModalProps) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleAddQuiz = () => {
    const newQuiz: IGame = {
      title: 'Nuevo Cuestionario',
      description: '',
      type: 'quiz',
      activity: [],
      createdBy:
        auth?.user?.role === 'teacher' && auth?.data?.id ? auth?.data?.id : '',
      status: 'active',
    }

    createGame(newQuiz).then((res) => {
      if (res) {
        navigate(`/quiz/${res.id}`);
      }
    });
  };

  return (
    <>
      {open && (
        <div
          onClick={handleClose}
          className="z-10 fixed h-screen w-screen top-0 left-0 flex items-center justify-center bg-black/25"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="shadow bg-white w-10/12 min-w-[600px] max-w-[900px] rounded-md p-[min(2.5rem,5%)]"
          >
            <p className="text-blue-500 text-xl mb-8">
              Elige el tipo de Actividad
            </p>
            <Grid container spacing={1} justifyContent="space-between">
              {games.map((game, index) => (
                <Grid key={index} item xs={3.75}>
                  <Card className="rounded-md shadow">
                    <CardActionArea onClick={game.type === 'quiz' ? handleAddQuiz : undefined} className="bg-blue-200 group h-[300px] px-10 ">
                      <Link to={`/${game.type}`} className="flex flex-col w-full h-full items-center justify-center">
                        {game.icon}
                        <p className="text-blue-500 group-hover:text-blue-600 text-center mt-6 text-lg">
                          {game.title.toUpperCase()}
                        </p>
                      </Link>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      )}
    </>
  );
}
