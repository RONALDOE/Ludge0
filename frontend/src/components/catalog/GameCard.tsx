import { IGame } from "@interfaces/games.i";
import { Card, CardMedia, CardContent, CardActions } from "@mui/material";
import { RiQuestionnaireFill } from 'react-icons/ri';
import { RiFileSearchFill } from 'react-icons/ri';
import { IoMap } from 'react-icons/io5';
import Button from "../common/Button";
import { Link } from "react-router-dom";
import { useAuth } from "@src/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { IMatch } from "@interfaces/match.i";
import { getMatchByGameAndUser, createMatch } from "@src/services/matches";

export default function GameCard({ game }: { game: IGame }) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleShowQuiz = async (event: React.MouseEvent) => {
    if (auth.user?.id && game.id) {
      const fetchedMatch = await getMatchByGameAndUser(game.id, auth.user?.id);
      if (fetchedMatch) {
        return navigate(`/quiz/${game.id}/${fetchedMatch.id}`);
      }

      const newMatch: IMatch = {
        participant: auth?.user?.id || '',
        game: game.id || '',
        status: 'pending',
        answers: [],
        time: {
          initial: new Date(),
        },
      };

      const newMatchCreated = await createMatch(newMatch);
      navigate(`/quiz/${game.id}/${newMatchCreated.id}`);
    }
  }

  return (
    <Card className="shadow rounded-md min-h-[388px] max-h-[388px] flex flex-col">
      <CardMedia className="bg-blue-200 flex place-content-center p-10">
        {game.type === 'quiz' && <RiQuestionnaireFill className="text-blue-500 text-[120px]" />}
        {game.type === 'wordfind' && <RiFileSearchFill className="text-blue-500 text-[120px]" />}
        {game.type === 'map' && <IoMap className="text-blue-500 text-[120px]" />}
      </CardMedia>
      <CardContent className="pt-6 pb-2">
        <h3 className='text-xl font-bold mb-4'>{game.title}</h3>
        <p className='text-sm text-zinc-500'>{game.description?.length > 135 ? game.description.substring(0, 125) + "..." : game.description}</p>
      </CardContent>
      <CardActions className="mt-auto">
        {game.type != 'quiz' || auth.user?.role === 'teacher' ? (
          <Link to={`/${game.type}/${game.id}`}>
            <Button variant="text">VER MÁS</Button>
          </Link>
        ) : (
          <Button variant="text" onClick={handleShowQuiz}>VER MÁS</Button>
        )
        }

      </CardActions>
    </Card>
  );
}