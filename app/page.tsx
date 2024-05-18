"use client";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "@/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const colRef = collection(db, 'users');

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const email = user.email;
        if (email) {
          const docRef = doc(colRef, email);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            await setDoc(docRef, {
              allSubmissions: [],
              correctAnswersDisplay: [],
              lives: 4,
              visy: false,
              visg: false,
              visb: false,
              visp: false,
              correctAnswers: [],
              quantityWords: [
                "IT", "HALLOWEEN", "SPIRIT WEEK", "SLEEP DE- PRIVATION",
                "SENIOR SUNRISE", "PHOTO- SYNTHESIS", "WINTER DANCE",
                "GIES", "SUNBURN", "TEAM", "AP EXAMS", "PROCRA- STINATION",
                "PROM", "ALONG", "SOLAR ECLIPSE", "HOMEWORK"
              ]
            });
          }
          router.push("/connections");
        } else {
          console.error("Email is null or undefined");
        }
      } else {
        console.error("User is null or undefined");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("An error occurred during sign-in. Please try again.");
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col bg-homepage">
      <h1 className="md:pt-20 pt-10 text-4xl md:text-6xl text-center w-full font-serif">
        Welcome to Griffin Gazette Connections!
      </h1>
      <p className="italic text-lg md:text-3xl text-center w-full font-serif">
        Based off the New York Times Game Connections.
      </p>
      <button 
        onClick={handleGoogleSignIn} 
        className="bg-white mt-8 md:mt-16 mx-auto ease-in-out duration-100 text-base md:text-4xl hover:bg-slate-200 border-2 hover:scale-105 hover:shadow-2xl shadow-xl rounded-3xl p-2 md:p-3 border-black items-center flex gap-x-2 justify-center font-serif"
      >
        <FcGoogle className="" />
        <span>Sign up with Google To Play</span>
      </button>
      <Image
        src="/homePageBG.png"
        alt="Home Page Background"
        className="mx-auto md:w-1/2 md:scale-105 pointer-events-none"
        width={600}
        height={400}
        priority
      />
      <Image
        src="/tagLogo.png"
        alt="TAG Logo"
        className="w-3/5 md:w-0 md:h-0 mx-auto pointer-events-none"
        width={300}
        height={300}
        priority
      />
      <footer className="md:absolute md:text-right md:p-2 md:bottom-0 w-full italic text-white text-xs font-bold text-center md:text-xl">
        Henry Tran
      </footer>
    </main>
  );
}
