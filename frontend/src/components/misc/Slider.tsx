import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";


const images = [
  {
    id: 1,
    url: '/images/undraw_online_test_re_kyfx.svg',
    alt: 'Imagen 1',
    title: 'CREA',
    description: "Nuevas formas de aprender y enseñar tanto geografía como historia."
  },
  {
    id: 2,
    url: '/images/undraw_reading_time_re_phf7.svg',
    alt: 'Imagen 2',
    title: 'EXPLORA',
    description: "Una variedad de juegos y actividades para que puedas aprender de una forma divertida."
  },
  {
    id: 3,
    url: '/images/undraw_real_time_analytics_re_yliv.svg',
    alt: 'Imagen 3',
    title: 'CONOCE',
    description: "Más acerca de la geografía y la historia de nuestro país y el mundo."
  },
  // Agregar más imágenes aquí
];


export default function App() {
  return (
    <>

      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}

        modules={[Autoplay, Pagination]}
        className='w-full'
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="flex w-7/12 mx-auto max-w-[500px] min-w-[375px] flex-col items-center justify-center p-10 pt-5">
              <img src={image.url} alt={image.alt} loading="lazy" className="w-full aspect-square mb-1" />
              <p className="font-bold	capitalize text-4xl text-center w-full mb-3 text-white">{image.title}</p>
              <p className="text-center text-base text-blue-100">{image.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
