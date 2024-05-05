'use client'
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  return (
    <main>
      <div className='mt-20 text-8xl text-center w-full font-serif'>Welcome to Griffin Gazette Connections!</div>
      <div className='text-lg text-center w-full font-serif'>Based off the New York Times Game Connections.</div>
      <button className=' ease-in-out duration-100 text-4xl hover:bg-slate-200 border-2 hover:scale-110 hover:shadow-2xl shadow-xl rounded-3xl p-3 border-black items-center flex gap-x-2 justify-center font-serif absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <FcGoogle className="" />
        <div>Sign up with Google</div>
      </button>
    </main>
  );
}
