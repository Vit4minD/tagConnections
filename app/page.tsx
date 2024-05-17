"use client";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "@/firebase/config";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import TagLogo from "../public/tagLogo.png";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";

export default function Home() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const [isNewUser, setIsNewUser] = useState(false);
  const colRef = collection(db, 'users');
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/connections");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const checkIfNewUser = (user: User) => {
    const creationTime = user.metadata.creationTime;
    const lastSignInTime = user.metadata.lastSignInTime;

    if (creationTime === lastSignInTime) {
      setIsNewUser(true);
    } else {
      setIsNewUser(false);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user; // Get the user object from the result
        const email = user.email;
        const docRef = doc(colRef, email == null ? '' : email);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          setDoc(docRef, {
            allSubmissions: [],
            correctAnswersDisplay: [],
            lives: 4,
            visy: false,
            visg: false,
            visb: false,
            visp: false,
            correctAnswers: [],
            quantityWords: ["IT", "HALLOWEEN", "SPIRIT WEEK", "SLEEP DE- PRIVATION", "SENIOR SUNRISE", "PHOTO- SYNTHESIS", "WINTER DANCE", "GIES", "SUNBURN", "TEAM", "AP EXAMS", "PROCRA- STINATION", "PROM", "ALONG", "SOLAR ECLIPSE", "HOMEWORK"]
          })
        }
        router.push("/connections");
      })
      .catch(() => {
        alert("Failed to sign in with Google");
      });
  };

  return (
    // <div className="h-screen w-full flex">
    //   <div
    //     id="LEFT_SIDE"
    //     className="flex flex-col items-center justify-start xl:bg-white bg-[#F6BF02] w-full xl:w-[60%] h-screen px-4 py-2"
    //   >
    //     <div className="mt-10 lg:mt-20 text-2xl font-semibold  md:text-4xl lg:text-6xl text-center w-full font-serif">
    //       Welcome to Griffin Gazette Connections!
    //     </div>
    //     <div className="mt-2 italic text-lg md:text-xl xl:text-2xl text-center text-wrap  w-full font-serif">
    //       Based off the New York Times Game Connections.
    //     </div>
    //     <button
    //       onClick={handleGoogleSignIn}
    //       className="bg-white relative top-1/4	ease-in-out duration-100 text-lg md:text-2xl xl:text-4xl hover:bg-slate-200 border-2 hover:scale-105 hover:shadow-2xl shadow-xl rounded-full py-2 px-4 xl:p-5 border-black items-center flex gap-2 justify-center font-medium"
    //     >
    //       <FcGoogle className="" />
    //       <div>Sign up with Google To Play</div>
    //     </button>
    //   </div>
    //   <div
    //     id="RIGHT_SIDE"
    //     className="hidden xl:flex bg-[#F6BF02] w-[40%] h-screen flex-col justify-center place-items-center gap-5 px-3 py-2"
    //   >
    //     <div className="text-5xl text-[#1a4eeaf8] font-bold text-center text-pretty ">
    //       {" "}
    //       The School for the Talented and Gifted{" "}
    //     </div>
    //     <Image alt="logo" src={TagLogo} />
    //   </div>
    // </div>
    <main className="w-full min-h-screen flex flex-col bg-homepage ">

      <div className='md:pt-20 pt-10 text-4xl  md:text-8xl text-center w-full font-serif'>Welcome to Griffin Gazette Connections!</div>

      <div className='italic text-lg md:text-3xl text-center w-full font-serif'>Based off the New York Times Game Connections.</div>
      <button onClick={handleGoogleSignIn} className=' bg-white mt-8 md:mt-16 mx-auto ease-in-out duration-100 text-base md:text-4xl hover:bg-slate-200 border-2 hover:scale-105 hover:shadow-2xl shadow-xl rounded-3xl p-2 md:p-3 border-black items-center flex gap-x-2 justify-center font-serif '>
        <FcGoogle className="" />
        <div>Sign up with Google To Play</div>
      </button>
      <img
        src="/homePageBG.png"
        alt="Picture of the author"
        className=" mx-auto md:w-3/4 md:scale-105 pointer-events-none"
      />
      <img
        src="/tagLogo.png"
        alt="Picture of the author"
        className="w-3/5 md:w-0 md:h-0 mx-auto pointer-events-none"
      />
      <div className="md:absolute md:text-right md:p-2 md:bottom-0 w-full italic text-white text-xs font-bold text-center md:text-xl">
        Henry Tran
      </div>
    </main>
  );
}
