"use client";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import Confetti from "./confetti";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  AwaitedReactNode,
  JSX,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { useToast } from "@chakra-ui/react";
import { auth, db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";

export default function Home() {
  const {
    isOpen: isFirstOpen,
    onOpen: onFirstOpen,
    onClose: onFirstClose,
  } = useDisclosure();

  // Second modal disclosure
  const {
    isOpen: isSecondOpen,
    onOpen: onSecondOpen,
    onClose: onSecondClose,
  } = useDisclosure();
  const [clicked, setClicked] = useState(false);
  const [quantityWords, setQuatityWords] = useState<string[]>([
    "MEMORIES",
    "SKIP",
    "CAP",
    "DREAM",
    "DOOMSCROLL",
    "FRIENDS",
    "LIFE",
    "SLACK",
    "PICTURES",
    "TASSEL",
    "DIPLOMA",
    "APPLICATION",
    "MAJOR",
    "SNOOZE",
    "LESSONS",
    "GOWN",
  ]);
  const [user, setUser] = useState<null | User>(null);
  const toast = useToast();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<any>([]);
  const [correctAnswersDisplay, setCorrectAnswersDisplay] = useState<string[]>(
    []
  );
  const [allSubmissions, setAllSubmissions] = useState<any>([]);
  const [lives, setLives] = useState(4);
  const [visy, setVisy] = useState(false),
    [visg, setVisg] = useState(false),
    [visb, setVisb] = useState(false),
    [visp, setVisp] = useState(false);
  const [dataJson, setDataJson] = useState<any>();

  useEffect(() => {
    async function fetchWords() {
      try {
        const res = await fetch("/api/words");
        const data = await res.json();
        setDataJson(data);
      } catch (e) {
        console.error("Failed to fetch wordSet from API", e);
      }
    }
    fetchWords();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocumentRef = doc(db, "users", user.email || "");
          const docSnapshot = await getDoc(userDocumentRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setLives(data.lives);
            setVisy(data.visy);
            setVisg(data.visg);
            setVisb(data.visb);
            setVisp(data.visp);
            setAllSubmissions(data.allSubmissions);
            const updatedCorrectAnswers: JSX.Element[] = [];
            data.correctAnswersDisplay.forEach((element: string) => {
              if (element === "yellow")
                updatedCorrectAnswers.push(groupAnswers.yellow);
              if (element === "green")
                updatedCorrectAnswers.push(groupAnswers.green);
              if (element === "blue")
                updatedCorrectAnswers.push(groupAnswers.blue);
              if (element === "purple")
                updatedCorrectAnswers.push(groupAnswers.purple);
            });

            setCorrectAnswersDisplay(data.correctAnswersDisplay);
            setCorrectAnswers(updatedCorrectAnswers);
            setQuatityWords(data.quantityWords);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };
    fetchUserData();
  }, [user, dataJson]);

  const updateUser = useCallback(async (userId: string, newData: any) => {
    const userRef = doc(db, "users", userId);
    try {
      await updateDoc(userRef, newData);
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });
    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleButtonClick = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(
        selectedWords.filter((selectedWord) => selectedWord !== word)
      );
    } else if (selectedWords.length === 4) {
      return;
    } else if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };
  function shuffleArray<T>(array: T[]): T[] {
    const length = array.length;
    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  const shuffle = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setClicked(true);
    setQuatityWords(shuffleArray(quantityWords));
    setTimeout(() => {
      setClicked(false);
    }, 300);
  };

  // Loading check (must be after all hooks, before using dataJson)

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const [selectAnimation, setSelectAnimation] = useState(false);
  const [correctAnimation, setCorrectAnimation] = useState(false);
  const [pauseSubmission, setPauseSubmission] = useState(false);

  const textSequence = [
    "OMG!!",
    "OMG!!",
    "OMG!!",
    "OMG!!",
    "tara :3 is playing!!!",
    "tara :3 is playing!!!",
    "tara :3 is playing!!!",
    "Click Me!!!!!",
    "Click Me!!!!!",
    "Click Me!!!!!",
  ];
  const noButtonResponses = [
    "Why'd you press that :(",
    "meanie.",
    "No? Are you sure?? :(",
    "You can't say no to this face! :(",
    "C'mon, give me a chance!",
    "Really? Not even a little bit? D:",
    "Was it something I said?",
    "I'll just ask again... :(",
    "No way... Try again!",
    "Don't make me cry :(",
    "Never back down never what!",
    "I'm heartbroken now 💔",
    "Think twice before clicking that!",
    "Are you playing hard to get? ",
    "Wait, I thought we had something special!",
    "Why so mean? ",
    "Oops, wrong button, right?",
    "Try saying yes this time! ",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [gifSrc, setGifSrc] = useState("/cat.gif"); // Default GIF
  const [valentineText, setValentineText] = useState(
    "Will you be my Valentine? :3"
  );
  const [isNoClicked, setIsNoClicked] = useState(false); // Track if 'No' button has been clicked
  const [noButtonPosition, setNoButtonPosition] = useState({
    top: "auto",
    left: "auto",
  }); // Default position
  const handleNoClick = () => {
    const randomTop = Math.floor(Math.random() * 80); // Random top position (up to 80% of screen)
    const randomLeft = Math.floor(Math.random() * 80); // Random left position (up to 80% of screen)
    setNoButtonPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
    setGifSrc("/sadMocha.gif"); // Change to a "No" reaction GIF
    setValentineText(
      noButtonResponses[Math.floor(Math.random() * noButtonResponses.length)]
    );
    setIsNoClicked(true); // Indicate that the 'No' button has been clicked
  };
  // Function to handle 'Yes' click: change text & GIF
  const handleYesClick = () => {
    setValentineText("Awesome Sauce :3");
    setGifSrc("/yesMocha.gif"); // Change to a "Yes" reaction GIF
    setAreButtonsVisible(false);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % textSequence.length);
    }, 400); // Change text every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [textSequence.length]);
  const [areButtonsVisible, setAreButtonsVisible] = useState(true); // Controls button visibility

  if (!dataJson) {
    return <div>Loading...</div>;
  }

  // Graduation Attire
  const yellow = dataJson.yellow;
  // What You Leave TAG With
  const green = dataJson.green;
  // Senioritis
  const blue = dataJson.blue;
  // College (e.g. College Major, College Dream, etc.)
  const purple = dataJson.purple;

  const groupAnswers = {
    yellow: (
      <div className="animate-popUp mt-2 flex-col font-sans h-20 text-base md:text-xl w-full bg-nyt-yellow rounded-xl flex justify-center items-center">
        <div className="flex-col font-bold text-center">
          {dataJson.yellowTitle}
          <div className="font-normal">
            {yellow[0]}, {yellow[1]}, {yellow[2]}, {yellow[3]}
          </div>
        </div>
      </div>
    ),
    green: (
      <div className=" animate-popUp mt-2 flex-col font-sans h-20 text-base md:text-xl w-full bg-nyt-green rounded-xl flex justify-center items-center">
        <div className="flex-col font-bold text-center">
          {dataJson.greenTitle}
          <div className="font-normal">
            {green[0]}, {green[1]}, {green[2]}, {green[3]}
          </div>
        </div>
      </div>
    ),
    blue: (
      <div className=" animate-popUp mt-2 flex-col font-sans h-20 text-base md:text-xl w-full bg-nyt-blue rounded-xl flex justify-center items-center">
        <div className="flex-col font-bold text-center">
          {dataJson.blueTitle}
          <div className="font-normal">
            {blue[0]}, {blue[1]}, {blue[2]}, {blue[3]}
          </div>
        </div>
      </div>
    ),
    purple: (
      <div className=" animate-popUp mt-2 flex-col font-sans h-20 text-base md:text-xl w-full bg-nyt-purple rounded-xl flex justify-center items-center">
        <div className="flex-col font-bold text-center">
          {dataJson.purpleTitle}
          <div className="font-normal">
            {purple[0]}, {purple[1]}, {purple[2]}, {purple[3]}
          </div>
        </div>
      </div>
    ),
  };
  const checkAnswer = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setPauseSubmission(true);
    setTimeout(() => {
      setPauseSubmission(false);
    }, 600);
    const input = selectedWords.sort().toString();
    if (allSubmissions.includes(input)) {
      toast({
        position: "top",
        duration: 2000,
        render: () => (
          <div className=" mt-28 font-bold mx-auto w-fit text-center text-sm md:text-lg text-white p-4 rounded-xl bg-black">
            Already guessed!
          </div>
        ),
      });
      return;
    } else {
      allSubmissions.push(selectedWords.sort().toString());
      const newSubs = allSubmissions;
      setAllSubmissions(newSubs);
      updateUser(user?.email ?? "", { allSubmissions: newSubs });
    }
    let diffy = 4,
      diffg = 4,
      diffb = 4,
      diffp = 4;
    let y = true,
      g = true,
      b = true,
      p = true;
    yellow.forEach((element: string) => {
      if (!selectedWords.includes(element)) y = false;
      else diffy--;
    });
    green.forEach((element: string) => {
      if (!selectedWords.includes(element)) g = false;
      else diffg--;
    });
    blue.forEach((element: string) => {
      if (!selectedWords.includes(element)) b = false;
      else diffb--;
    });
    purple.forEach((element: string) => {
      if (!selectedWords.includes(element)) p = false;
      else diffp--;
    });
    if (Math.min(diffy, diffg, diffb, diffp) == 1) {
      toast({
        position: "top",
        duration: 2000,
        render: () => (
          <div className=" mt-28 font-bold mx-auto w-fit text-center text-sm md:text-lg text-white p-4 rounded-xl bg-black">
            One away...
          </div>
        ),
      });
    }
    if (y) {
      setCorrectAnimation(true);
      setTimeout(() => {
        setCorrectAnimation(false);
      }, 1200);
      await delay(800);
      setVisy(true);
      const ans: SetStateAction<string[]> = [];
      quantityWords.forEach((element) => {
        if (!yellow.includes(element)) ans.push(element);
      });
      setSelectedWords([]);
      await delay(150);
      setQuatityWords(ans);
      const newAnswers = [...correctAnswers, groupAnswers["yellow"]];
      setCorrectAnswers(newAnswers);
      correctAnswersDisplay.push("yellow");
      const newDisplay = correctAnswersDisplay;
      updateUser(user?.email ?? "", {
        visy: true,
        quantityWords: ans,
        correctAnswersDisplay: newDisplay,
      });
    } else if (g) {
      setCorrectAnimation(true);
      setTimeout(() => {
        setCorrectAnimation(false);
      }, 1200);
      await delay(800);
      setVisg(true);
      const ans: SetStateAction<string[]> = [];
      quantityWords.forEach((element) => {
        if (!green.includes(element)) ans.push(element);
      });
      setSelectedWords([]);
      await delay(150);
      setQuatityWords(ans);
      const newAnswers = [...correctAnswers, groupAnswers["green"]];
      setCorrectAnswers(newAnswers);
      correctAnswersDisplay.push("green");
      const newDisplay = correctAnswersDisplay;
      updateUser(user?.email ?? "", {
        visg: true,
        quantityWords: ans,
        correctAnswersDisplay: newDisplay,
      });
    } else if (b) {
      setCorrectAnimation(true);
      setTimeout(() => {
        setCorrectAnimation(false);
      }, 1200);
      await delay(800);
      setVisb(true);
      const ans: SetStateAction<string[]> = [];
      quantityWords.forEach((element) => {
        if (!blue.includes(element)) ans.push(element);
      });
      setSelectedWords([]);
      await delay(150);
      setQuatityWords(ans);
      const newAnswers = [...correctAnswers, groupAnswers["blue"]];
      setCorrectAnswers(newAnswers);
      correctAnswersDisplay.push("blue");
      const newDisplay = correctAnswersDisplay;
      updateUser(user?.email ?? "", {
        visb: true,
        quantityWords: ans,
        correctAnswersDisplay: newDisplay,
      });
    } else if (p) {
      setCorrectAnimation(true);
      setTimeout(() => {
        setCorrectAnimation(false);
      }, 1200);
      await delay(800);
      setVisp(true);
      updateUser(user?.email ?? "", { visy: true });
      const ans: SetStateAction<string[]> = [];
      quantityWords.forEach((element) => {
        if (!purple.includes(element)) ans.push(element);
      });
      setSelectedWords([]);
      await delay(150);
      setQuatityWords(ans);
      const newAnswers = [...correctAnswers, groupAnswers["purple"]];
      setCorrectAnswers(newAnswers);
      correctAnswersDisplay.push("purple");
      const newDisplay = correctAnswersDisplay;
      updateUser(user?.email ?? "", {
        visp: true,
        quantityWords: ans,
        correctAnswersDisplay: newDisplay,
      });
    } else {
      setSelectAnimation(true);
      setTimeout(() => {
        setSelectAnimation(false);
      }, 600);
      const newLives = lives - 1;
      setLives(newLives);
      updateUser(user?.email ?? "", { lives: newLives });
      if (newLives == 0) {
        toast({
          position: "top",
          duration: 2000,
          render: () => (
            <div className=" mt-28 font-bold mx-auto w-fit text-center text-sm md:text-lg text-white p-4 rounded-xl bg-black">
              Better Luck Next Time
            </div>
          ),
        });
        let ans1: any[] = [];
        let ans2: any[] = [];
        let ans3: any[] = [];
        let ans4: any[] = [];
        let dans1: any[] = [];
        let dans2: any[] = [];
        let dans3: any[] = [];
        let dans4: any[] = [];
        setSelectedWords([]);
        if (!visy) {
          await delay(800);
          setVisy(true);
          quantityWords.forEach((element) => {
            if (!yellow.includes(element)) ans1.push(element);
          });
          await delay(150);
          await setQuatityWords(ans1);
          dans1 = [...correctAnswers, groupAnswers["yellow"]];
          setCorrectAnswers(dans1);
          correctAnswersDisplay.push("yellow");
          const newDisplay = correctAnswersDisplay;
          updateUser(user?.email ?? "", {
            visy: true,
            quantityWords: ans1,
            correctAnswersDisplay: newDisplay,
          });
          await delay(1200);
        }
        if (!visg) {
          await delay(800);
          setVisg(true);
          if (ans1.length == 0) ans1 = quantityWords;
          ans1.forEach((element) => {
            if (!green.includes(element)) ans2.push(element);
          });
          await delay(150);
          await setQuatityWords(ans2);
          if (dans1.length == 0) dans1 = correctAnswers;
          dans2 = [...dans1, groupAnswers["green"]];
          setCorrectAnswers(dans2);
          correctAnswersDisplay.push("green");
          const newDisplay = correctAnswersDisplay;
          updateUser(user?.email ?? "", {
            visg: true,
            quantityWords: ans2,
            correctAnswersDisplay: newDisplay,
          });
          await delay(1200);
        }
        if (!visb) {
          await delay(800);
          setVisb(true);
          if (ans2.length == 0) ans2 = ans1;
          if (ans1.length == 0) ans2 = quantityWords;
          ans2.forEach((element) => {
            if (!blue.includes(element)) ans3.push(element);
          });
          await delay(150);
          await setQuatityWords(ans3);
          if (dans2.length == 0) dans2 = dans1;
          if (dans2.length == 0) dans2 = correctAnswers;
          dans3 = [...dans2, groupAnswers["blue"]];
          setCorrectAnswers(dans3);
          correctAnswersDisplay.push("blue");
          const newDisplay = correctAnswersDisplay;
          updateUser(user?.email ?? "", {
            visb: true,
            quantityWords: ans3,
            correctAnswersDisplay: newDisplay,
          });
          await delay(1200);
        }
        if (!visp) {
          await delay(800);
          setVisp(true);
          if (ans3.length == 0) ans3 = ans2;
          if (ans3.length == 0) ans3 = ans1;
          if (ans3.length == 0) ans3 = quantityWords;
          ans3.forEach((element) => {
            if (!purple.includes(element)) ans4.push(element);
          });
          await delay(150);
          await setQuatityWords(ans4);
          if (dans3.length == 0) dans3 = dans2;
          if (dans2.length == 0) dans3 = dans1;
          if (dans2.length == 0) dans3 = correctAnswers;
          dans4 = [...dans3, groupAnswers["purple"]];
          setCorrectAnswers(dans4);
          correctAnswersDisplay.push("purple");
          const newDisplay = correctAnswersDisplay;
          updateUser(user?.email ?? "", {
            visp: true,
            quantityWords: ans4,
            correctAnswersDisplay: newDisplay,
          });
          await delay(1200);
        }
      }
    }
  };

  return (
    <ChakraProvider>
      <main className="w-svw h-svh text-center flex-col items-center justify-center">
        <div className="hidden lg:block w-full pb-8 border-gray-300 border-2">
          <div className="mt-12 ml-40 gap-3 text-5xl flex justify-start items-end font-extrabold font-sans">
            <div className="">Griffin Connections</div>
            <div className="text-2xl font-sans font-extralight">
              May 16, 2025
            </div>
          </div>
        </div>
        <button
          onClick={onFirstOpen}
          className="hover:shadow-2xl flex ml-auto hover:bg-slate-200 ease-in-out duration-150 p-1 m-1 md:m-2 text-2xl md:text-4xl"
        >
          <RxQuestionMarkCircled />
        </button>

        <Modal size="xl" isOpen={isFirstOpen} onClose={onFirstClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <img
                src="/howToPlayConnections.png"
                alt="Picture of the author"
                className="w-full mt-7 pointer-events-none"
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        <div className="md:text-xl flex text-lg mx-auto justify-center text-center">
          Create four TAG-themed groups of four!
        </div>
        <div className="h-smallConnections w-smallW mt-7 mx-auto md:w-connectionW md:h-allConnections md:mx-auto text-center">
          {correctAnswers.map(
            (
              element:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<AwaitedReactNode>
                | null
                | undefined,
              index: Key | null | undefined
            ) => (
              <div key={index}>{element}</div>
            )
          )}
          <form>
            <div className="animate-popUp ease-in-out duration-75 gap-x-1 md:gap-x-2 grid grid-cols-4">
              {quantityWords.map((word, index) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleButtonClick(word);
                  }}
                  key={index}
                  value={word}
                  className={`select-none ease-out duration-75 rounded-xl mt-2 h-20 lg:h-24 items-center text-sm md:text-sm justify-center flex lg:text-xl font-bold
                ${
                  selectedWords.includes(word)
                    ? "bg-nyt-grayer text-white"
                    : "bg-nyt-gray text-black"
                }
                ${
                  selectedWords.includes(word) && selectAnimation
                    ? "animate-shake"
                    : ""
                }
                ${
                  selectedWords.includes(word) && correctAnimation
                    ? "animate-bounceOnce"
                    : ""
                }`}
                >
                  <label
                    className={`lg:max-w-[150px] max-w-[97.91px] hover: cursor-pointer ${
                      clicked ? " animate-fade" : ""
                    }`}
                  >
                    {word}
                  </label>
                </button>
              ))}
            </div>
            <div className="m-7 text-base md:text-xl items-center justify-center flex">
              Mistakes remaining:
              {[1, 2, 3, 4].map((num) => (
                <span
                  key={num}
                  className={`w-4 h-4 md:w-5 md:h-5 mx-1 md:mx-2 inline-block rounded-full bg-nyt-grayer ${
                    lives >= num ? "visible" : "animate-shrink"
                  }`}
                ></span>
              ))}
            </div>
            {correctAnswers.length !== 4 && (
              <div className="justify-center font-semibold text-sm md:text-lg flex gap-x-3 md:gap-x-8">
                <button
                  onClick={shuffle}
                  className={`py-4 px-6 rounded-full border-2 ${
                    clicked
                      ? "text-nyt-covered select-none hover:cursor-default border-nyt-covered"
                      : "hover:bg-gray-200 text-black border-black"
                  } ${lives === 0 ? "scale-0" : ""}`}
                >
                  Shuffle
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedWords([]);
                  }}
                  className={`py-4 px-6 rounded-full border-2 ${
                    selectedWords.length > 0
                      ? "hover:bg-gray-200 text-black select-text border-black"
                      : "hover: pointer-events-none border-nyt-covered text-nyt-covered"
                  } ${lives === 0 ? "scale-0" : ""}`}
                >
                  Deselect all
                </button>
                <button
                  onClick={checkAnswer}
                  className={`py-4 px-6 rounded-full border-2 ${
                    pauseSubmission
                      ? "select-none hover: pointer-events-none bg-gray-500 border-gray-500"
                      : ""
                  } ${
                    selectedWords.length === 4
                      ? "hover:bg-gray-500 hover:border-gray-500 bg-black text-white select-text border-black"
                      : "hover: pointer-events-none border-nyt-covered text-nyt-covered"
                  } ${lives === 0 ? "scale-0" : ""}`}
                >
                  Submit
                </button>
              </div>
            )}
          </form>
          {correctAnswers.length === 4 &&
            (user?.email == "henryctran2007@gmail.com" ||
              user?.email == "tara.canady@tagmagnet.org" ||
              user?.email == "tara.canadyyy@gmail.com") && (
              <>
                <button
                  onClick={onSecondOpen}
                  className="hover:scale-110 duration-200 hover:shadow-lg hover:bg-red-200 w-full animate-bounce anime p-4 font-mono font-bold border-2 border-[#ff445f] text-[#ff445f] justify-center text-3xl md:text-3xl flex gap-x-3 md:gap-x-8 rounded-lg"
                >
                  {textSequence[currentIndex]}
                </button>
                <Modal
                  size="6xl"
                  isOpen={isSecondOpen}
                  onClose={onSecondClose}
                  isCentered
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                      <div className="w-full h-screen flex flex-col justify-center items-center">
                        <p className="text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 font-mono text-4xl">
                          {valentineText}
                        </p>
                        <img
                          src={gifSrc}
                          alt="Instruction Animation"
                          className=""
                        />
                        {areButtonsVisible && (
                          <div className="w-1/3 flex flex-row gap-x-4 justify-between">
                            <button
                              onClick={handleNoClick}
                              className={`w-fit sm:w-[30%] font-bold p-4 bg-black rounded-2xl text-white font-mono text-2xl ${
                                isNoClicked ? "absolute" : "" // Only make the button absolute after it’s clicked
                              }`}
                              style={{
                                top: noButtonPosition.top,
                                left: noButtonPosition.left,
                                transition: "all 0.3s ease-in-out",
                              }}
                            >
                              No
                            </button>

                            {/* Yes Button */}
                            <button
                              onClick={handleYesClick}
                              className="w-fit sm:w-[30%] font-bold p-4 bg-[#ff445f] rounded-2xl text-white font-mono text-2xl"
                            >
                              Yes
                            </button>
                          </div>
                        )}
                      </div>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </>
            )}
        </div>
        {correctAnswersDisplay.length === 4 && <Confetti />}
      </main>
    </ChakraProvider>
  );
}
