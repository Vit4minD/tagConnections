"use client";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "@/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from 'next/navigation'
import { setDoc, doc, collection, getDoc, updateDoc, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";
import React from "react";

export default function Home() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const colRef = collection(db, 'users');
  const [loading, setLoading] = useState(false);

  async function updateAllDocuments() {
    const collectionRef = collection(db, "users"); // Replace 'your-collection-name' with your actual collection name

    try {
      const querySnapshot = await getDocs(collectionRef);

      querySnapshot.forEach(async (docSnap) => {
        const docRef = doc(collectionRef, docSnap.id); // Use doc function here, not docSnap
        await setDoc(
          docRef,
          {
            allSubmissions: [],
            correctAnswersDisplay: [],
            lives: 4,
            visy: false,
            visg: false,
            visb: false,
            visp: false,
            correctAnswers: [],
            quantityWords: ['MAN', 'LIGHTS', 'STICK', 'BALL', 'ORNAMENT', 'SCARF', 'HAM', 'WREATH', 'COAL', 'GLOBE', 'CARROT', 'HOT COCOA', 'ANGEL', 'EGGNOG', 'MISTLETOE', 'CRANBERRY SAUCE']
          },
          { merge: false }
        );
        console.log(`Document ${docSnap.id} updated successfully`);
      });

      console.log("All documents updated successfully");
    } catch (error) {
      console.error("Error updating documents: ", error);
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await router.prefetch("/connections");
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
              quantityWords: ['MAN', 'LIGHTS', 'STICK', 'BALL', 'ORNAMENT', 'SCARF', 'HAM', 'WREATH', 'COAL', 'GLOBE', 'CARROT', 'HOT COCOA', 'ANGEL', 'EGGNOG', 'MISTLETOE', 'CRANBERRY SAUCE']
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
      setLoading(false);
      console.error("Error during sign-in:", error);
      alert("An error occurred during sign-in. Please try again.");
    }
  };

  return (
    <main className={`w-full min-h-screen flex flex-col ${loading ? 'bg-white' : 'bg-homepage'}`}>
      {loading ? // Step 2: Conditionally render loading screen
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' role="status">
          <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
        : <>
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
        </>
      }
    </main>
  );
}
