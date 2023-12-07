import PageLayout from '@src/components/layout/PageLayout';
import Hero from '@src/components/home/Hero';
import ModuleSection from '@src/components/home/ModuleSection';

const modules = [
  {
    imgSrc: '/images/wordfind.jpg',
    title: 'Sopa de letras',
    description:
      'Juego interactivo con el que poner a prueba tus saberes en distintas áreas de las ciencias sociales.',
    url: 'wordfind',
  },
  {
    imgSrc: '/images/questionnaires.jpg',
    title: 'Cuestionarios',
    description:
      'Completa las preguntas y recibe las correcciones pertinentes de tu profesor.',
    url: 'quiz',
  },
  {
    imgSrc: '/images/maps.jpg',
    title: 'Mapas',
    description:
      'Juego interactivo con el que poner a prueba tus conocimientos en geografía con una variedad de mapas.',
    url: 'map',
  },
];

export default function Home() {
  return (
    <PageLayout>
      <main className="grow bg-white">
        <Hero />
        {modules.map((module, index) => (
          <ModuleSection
            key={module.title}
            imgSrc={module.imgSrc}
            title={module.title}
            description={module.description}
            opposite={(index + 1) % 2 === 0}
            url={module.url}
          />
        ))}
      </main>
    </PageLayout>
  );
}
