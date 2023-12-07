import { Button } from '@mui/material';
import { Link } from 'react-router-dom';


type ModuleSectionProps = {
  imgSrc: string;
  title: string;
  description: string;
  opposite?: boolean;
  url: string;
};

export default function ModuleSection(props: ModuleSectionProps) {
  const { imgSrc, title, description, opposite, url } = props;

  return (
    <section className="relative overflow-hidden">
      <img
        src={imgSrc}
        alt=""
        loading='lazy'
        className={`h-full saturate-50 object-cover w-full absolute ${opposite ? 'right-0' : 'left-0'
          }`}
      />
      <div
        className={`absolute h-full w-full bg-blue-500/60 ${opposite ? 'right-0' : 'left-0'
          }`}
      ></div>
      <div
        className={`absolute h-full scale-105 w-full bg-gradient-to-l from-white via-white/80 to-white/0 ${opposite ? 'right-0 rotate-180' : 'left-0 '
          }`}
      ></div>
      <div className="max-w-7xl flex mx-auto">
        <div className={`w-1/2 ${opposite ? 'order-2' : 'order-1'}`}></div>
        <div
          className={`w-1/2 py-48 px-14 flex ${opposite ? 'order-1 2xl:pl-0' : 'order-2 2xl:pr-0 text-right'
            }`}
        >
          <div
            className={`flex flex-col justify-center gap-4 z-10 ${opposite ? 'items-start' : 'items-end'
              }`}
          >
            <h2 className="text-3xl xl:text-4xl font-extrabold text-blue-500">
              {title}
            </h2>
            <p className="text-sm xl:text-lg">{description}</p>
            <Link to={{ pathname: "/catalog", search: `?filter=${url}` }}>
              <Button
                variant="contained"
                size="large"
                className="bg-blue-500 text-sm xl:text-base normal-case"
              >
                Ver más detalles
              </Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
