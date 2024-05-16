"use client";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import TagLogo from "../public/tagLogo.png";
export default function Home() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/connections");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        router.push("/connections");
      })
      .catch(() => {
        alert("Failed to sign in with Google");
      });
  };

  return (
    <div className="h-screen w-full flex">
      <div
        id="LEFT_SIDE"
        className="flex flex-col items-center justify-start xl:bg-white bg-[#F6BF02] w-full xl:w-[60%] h-screen px-4 py-2"
      >
        <div className="mt-10 lg:mt-20 text-2xl font-semibold  md:text-4xl lg:text-6xl text-center w-full font-serif">
          Welcome to Griffin Gazette Connections!
        </div>
        <div className="mt-2 italic text-lg md:text-xl xl:text-2xl text-center text-wrap  w-full font-serif">
          Based off the New York Times Game Connections.
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="bg-white relative top-1/4	ease-in-out duration-100 text-lg md:text-2xl xl:text-4xl hover:bg-slate-200 border-2 hover:scale-105 hover:shadow-2xl shadow-xl rounded-full py-2 px-4 xl:p-5 border-black items-center flex gap-2 justify-center font-medium"
        >
          <FcGoogle className="" />
          <div>Sign up with Google To Play</div>
        </button>
      </div>
      <div
        id="RIGHT_SIDE"
        className="hidden xl:flex bg-[#F6BF02] w-[40%] h-screen flex-col justify-center place-items-center gap-5 px-3 py-2"
      >
        <div className="text-5xl text-[#1a4eeaf8] font-bold text-center text-pretty ">
          {" "}
          The School for the Talented and Gifted{" "}
        </div>
        <Image alt="logo" src={TagLogo} />
      </div>
    </div>
    // <main>
    //   <div className='mt-20 text-8xl text-center w-full font-serif'>Welcome to Griffin Gazette Connections!</div>
    //   <div className='italic text-xl text-center w-full font-serif'>Based off the New York Times Game Connections.</div>
    //   <button onClick={handleGoogleSignIn} className=' ease-in-out duration-100 text-4xl hover:bg-slate-200 border-2 hover:scale-105 hover:shadow-2xl shadow-xl rounded-3xl p-3 border-black items-center flex gap-x-2 justify-center font-serif absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
    //     <FcGoogle className="" />
    //     <div>Sign up with Google To Play</div>
    //   </button>
    // </main>
  );
}
