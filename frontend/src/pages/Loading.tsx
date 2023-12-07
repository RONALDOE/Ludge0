import React from 'react'
import PageLayout from '@src/components/layout/PageLayout'
import { CircularProgress } from "@mui/material"

const Loading = () => {
    return (
        <PageLayout>
            <main className="grow bg-white px-10 py-10">
                <div className="flex flex-col h-full items-center justify-center gap-8">
                    <CircularProgress size="10rem"/>
                    <p className='text-2xl text-blue-500 font-semibold'>Cargando el contenido para ti...</p>
                </div>
            </main>
        </PageLayout>
    )
}

export default Loading