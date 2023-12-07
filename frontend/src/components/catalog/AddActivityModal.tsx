import { Card, CardActionArea, CardMedia, Grid } from '@mui/material';
import { RiQuestionnaireFill } from 'react-icons/ri';
import { RiFileSearchFill } from 'react-icons/ri';
import { IoMap } from 'react-icons/io5';
import { Link } from 'react-router-dom';

type AddActivityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const activities = [
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

export default function AddActivityModal({
  open,
  handleClose,
}: AddActivityModalProps) {
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
              {activities.map((activity, index) => (
                <Grid key={index} item xs={3.75}>
                  <Card className="rounded-md shadow">
                    <CardActionArea className="bg-blue-200 group h-[300px] px-10 ">
                      <Link to={`/${activity.type}`} className="flex flex-col w-full h-full items-center justify-center">
                        {activity.icon}
                        <p className="text-blue-500 group-hover:text-blue-600 text-center mt-6 text-lg">
                          {activity.title.toUpperCase()}
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
