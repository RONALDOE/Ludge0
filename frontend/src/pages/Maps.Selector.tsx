import React from 'react'
import PageLayout from '@src/components/layout/PageLayout'
import Typography from '@mui/material/Typography'
import { useState, useRef } from 'react';
import { ReactSVG } from "react-svg";




export default function MapGame() {

    const pRef = useRef(null);


    const mapG = document.getElementsByTagName("g");
    const infoP = document.getElementById("info");

    const [mapIds] = useState([

        {
            "id": "ISO-DO-01",
            "subdivision": "Distrito Nacional",
            "category": "distrito"
        },
        {
            "id": "ISO-DO-02",
            "subdivision": "Azua",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-03",
            "subdivision": "Baoruco (Bahoruco)",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-04",
            "subdivision": "Barahona",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-05",
            "subdivision": "Dajabón",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-06",
            "subdivision": "Duarte",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-07",
            "subdivision": "Elías Piña",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-08",
            "subdivision": "El Seibo [El Seybo]",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-09",
            "subdivision": "Espaillat",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-10",
            "subdivision": "Independencia",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-11",
            "subdivision": "La Altagracia",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-12",
            "subdivision": "La Romana",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-13",
            "subdivision": "La Vega",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-14",
            "subdivision": "María Trinidad Sánchez",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-15",
            "subdivision": "Monte Cristi",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-16",
            "subdivision": "Pedernales",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-17",
            "subdivision": "Peravia",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-18",
            "subdivision": "Puerto Plata",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-19",
            "subdivision": "Hermanas Mirabal [nota 1]",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-20",
            "subdivision": "Samaná",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-21",
            "subdivision": "San Cristóbal",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-22",
            "subdivision": "San Juan",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-23",
            "subdivision": "San Pedro de Macorís",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-24",
            "subdivision": "Sánchez Ramírez",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-25",
            "subdivision": "Santiago",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-26",
            "subdivision": "Santiago Rodríguez",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-27",
            "subdivision": "Valverde",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-28",
            "subdivision": "Monseñor Nouel",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-29",
            "subdivision": "Monte Plata",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-30",
            "subdivision": "Hato Mayor",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-31",
            "subdivision": "San José de Ocoa ",
            "category": "provincia"
        },
        {
            "id": "ISO-DO-32",
            "subdivision": "Santo Domingo ",
            "category": "provincia"
        }
    ]);


    const handleClick = (event: React.MouseEvent<SVGElement>) => {
        const id = event.currentTarget.getAttribute("id");
        const targetObject = mapIds.find(obj => obj.id === id);
        console.log(targetObject);
        // pRef.current.textContent == targetObject.subdivision;
    };

    for (let i = 0; i < mapG.length; i++) {
        // mapG[i].addEventListener("click", handleClick);
    }
    /**
     * Eldiablo
     */

    return (
        <PageLayout>
            <div className="grow bg-white flex flex-col justify-center items-center">
                <Typography variant="h2" color="initial" id="infoP" ref={pRef}>mague</Typography>
                <div className="w-[900px] h-[725px] border-2 border-blue-500 rounded">
                    <ReactSVG src="/svg/provinces.svg" />


                </div>

            </div>
        </PageLayout>
    )
}
