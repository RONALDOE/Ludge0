import React from 'react';
import PageLayout from '@src/components/layout/PageLayout';

const NotFound = () => {
  return (
    <>
      <PageLayout>
        <main className="grow bg-white px-10 py-10">
          <div className="flex flex-col h-full items-center justify-center gap-8">
              <img className="h-96" src="/images/restrictedimage.svg" alt="" />
              <p className='text-2xl font-semibold'>Oops! Parece que no tienes la llave de esta puerta</p>
          </div>
        </main>
      </PageLayout>
    </>
  )
}

export default NotFound