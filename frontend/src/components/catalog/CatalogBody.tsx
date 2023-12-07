import { Grid } from '@mui/material';
import GameCard from '@src/components/catalog/GameCard';
import { IGame } from '@src/interfaces/games.i';

export default function CatalogBody({ games }: { games: IGame[] }) {
  return (
    <Grid container columns={3} spacing={12}>
      {games.map((game) => (
        <Grid key={game.id} item xs={1} >
          <GameCard game={game} key={game.id} />
        </Grid>
      ))}
    </Grid>
  )
}