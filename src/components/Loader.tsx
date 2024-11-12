import React from 'react'
import { Skeleton } from './ui/skeleton';

const Loader = () => {
  return (
    <section className='h-2/3 flex flex-col gap-5 justify-center items-center'>
        <Skeleton className="w-2/3 h-[20px] rounded-full" />
        <Skeleton className="w-1/3 h-[20px] rounded-full" />
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
    </section>
  )

}

export default Loader;