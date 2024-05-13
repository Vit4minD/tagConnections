'use client'
import { Box, ChakraProvider, useDisclosure } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { AwaitedReactNode, JSX, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction, useState } from 'react';
import { RxQuestionMarkCircled } from "react-icons/rx";
import { useToast } from '@chakra-ui/react'

export default function Home() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState(false);
    const [quantityWords, setQuatityWords] = useState([
        "FEW", "MANY", "LINK", "SEVERAL",
        "COUPLE", "JOIN", "SOME", "TIE",
        "BOTHER", "HANDFUL", "PAIN", "PEST",
        "FOOL", "LOVERS", "MAGICIAN", "TOWER"
    ]);
    const toast = useToast()
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const handleButtonClick = (word: string) => {
        if (selectedWords.includes(word)) {
            setSelectedWords(selectedWords.filter(selectedWord => selectedWord !== word));
        }
        else if (selectedWords.length === 4) {
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
    const shuffle = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setClicked(true);
        setQuatityWords(shuffleArray(quantityWords));
        setTimeout(() => {
            setClicked(false);
        }, 300);
    };

    //word list
    const yellow = ["COUPLE", "JOIN", "LINK", "TIE"]
    const green = ["BOTHER", "HANDFUL", "PAIN", "PEST"]
    const blue = ["FEW", "MANY", "SEVERAL", "SOME"]
    const purple = ["FOOL", "LOVERS", "MAGICIAN", "TOWER"]
    const groupAnswers = {
        'yellow': (<div className=' animate-popUp mt-2 flex-col font-sans h-24 text-xl w-full bg-nyt-yellow rounded-xl flex justify-center items-center'>
            <div className='flex-col font-bold text-center'>
                CONNECT
                <div className='font-normal'>
                    COUPLE, JOIN, LINK, TIE
                </div>
            </div>
        </div>),
        'green': (<div className=' animate-popUp mt-2 flex-col font-sans h-24 text-xl w-full bg-nyt-green rounded-xl flex justify-center items-center'>
            <div className='flex-col font-bold text-center'>
                NUISANCE
                <div className='font-normal'>
                    BOTHER, HANDFUL, PAIN, PEST
                </div>
            </div>
        </div>),
        'blue': (<div className=' animate-popUp mt-2 flex-col font-sans h-24 text-xl w-full bg-nyt-blue rounded-xl flex justify-center items-center'>
            <div className='flex-col font-bold text-center'>
                QUANTITY WORDS
                <div className='font-normal'>
                    FEW, MANY, SEVERAL, SOME
                </div>
            </div>
        </div>),
        'purple': (<div className=' animate-popUp mt-2 flex-col font-sans h-24 text-xl w-full bg-nyt-purple rounded-xl flex justify-center items-center'>
            <div className='flex-col font-bold text-center'>
                TAROT CARDS, WITH "THE"
                <div className='font-normal'>
                    FOOL, LOVERS, MAGICIAN, TOWER
                </div>
            </div>
        </div>)
    }
    const [correctAnswers, setCorrectAnswers] = useState<any>([])
    const [allSubmissions, setAllSubmissions] = useState<any>([])
    const [lives, setLives] = useState(4);
    const [visy, setVisy] = useState(false), [visg, setVisg] = useState(false), [visb, setVisb] = useState(false), [visp, setVisp] = useState(false);
    const checkAnswer = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const input = selectedWords.sort().toString();
        if (allSubmissions.includes(input)) {
            toast({
                position: 'top',
                duration: 2000,
                render: () => (
                    <div className=' mt-28 font-bold mx-auto w-fit text-center text-lg text-white p-4 rounded-xl bg-black'>
                        Already guessed!
                    </div>
                ),
            })
            return;
        } else {
            allSubmissions.push(selectedWords.sort().toString());
        }
        let diffy = 4, diffg = 4, diffb = 4, diffp = 4;
        let y = true, g = true, b = true, p = true;
        yellow.forEach((element) => {
            if (!selectedWords.includes(element)) y = false;
            else diffy--;
        });
        green.forEach((element) => {
            if (!selectedWords.includes(element)) g = false;
            else diffg--;
        });
        blue.forEach((element) => {
            if (!selectedWords.includes(element)) b = false;
            else diffb--;
        });
        purple.forEach((element) => {
            if (!selectedWords.includes(element)) p = false;
            else diffp--;
        });
        if (Math.min(diffy, diffg, diffb, diffp) == 1) {
            toast({
                position: 'top',
                duration: 2000,
                render: () => (
                    <div className=' mt-28 font-bold mx-auto w-fit text-center text-lg text-white p-4 rounded-xl bg-black'>
                        One away...
                    </div>
                ),
            })
        }
        if (y) {
            setVisy(true);
            const ans: SetStateAction<string[]> = []
            quantityWords.forEach((element) => {
                if (!yellow.includes(element))
                    ans.push(element)
            })
            setQuatityWords(ans)
            setSelectedWords([])
            setCorrectAnswers([...correctAnswers, groupAnswers['yellow']])
        }
        else if (g) {
            setVisg(true);
            const ans: SetStateAction<string[]> = []
            quantityWords.forEach((element) => {
                if (!green.includes(element))
                    ans.push(element)
            })
            setQuatityWords(ans)
            setSelectedWords([])
            setCorrectAnswers([...correctAnswers, groupAnswers['green']])
        }
        else if (b) {
            setVisb(true);
            const ans: SetStateAction<string[]> = []
            quantityWords.forEach((element) => {
                if (!blue.includes(element))
                    ans.push(element)
            })
            setQuatityWords(ans)
            setSelectedWords([])
            setCorrectAnswers([...correctAnswers, groupAnswers['blue']])
        }
        else if (p) {
            setVisp(true);
            const ans: SetStateAction<string[]> = []
            quantityWords.forEach((element) => {
                if (!purple.includes(element))
                    ans.push(element)
            })
            setQuatityWords(ans)
            setSelectedWords([])
            setCorrectAnswers([...correctAnswers, groupAnswers['purple']])
        } else {
            setLives(lives - 1);
        }
    };

    return (
        <main className='w-full h-full'>
            <div className="w-full pb-8  border-gray-300 border-2">
                <div className="mt-12 ml-40 gap-3 text-5xl flex justify-start font-extrabold font-sans">
                    <div>Griffin Connections</div>
                    <div className=" mt-7 text-2xl font-sans font-extralight">May 17, 2024</div>
                </div>
            </div>
            <button onClick={onOpen} className='hover:shadow-2xl flex ml-auto hover:bg-slate-200 ease-in-out duration-150 p-1 m-2 text-4xl'><RxQuestionMarkCircled /></button>
            <ChakraProvider>
                <Modal size='xl' isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody>
                            <img
                                src="/howToPlayConnections.png"
                                alt="Picture of the author"
                                className='w-full mt-7 pointer-events-none'
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </ChakraProvider>
            <div className='text-xl flex   mx-auto justify-center text-center'>Create four groups of four!</div>
            <div className='  mt-7 w-connectionW h-allConnections mx-auto  text-center'>
                {correctAnswers.map((element: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
                    <div key={index} >{element}</div>
                ))}
                <form>
                    <div className='ease-in-out duration-75 gap-x-2 grid grid-cols-4'>
                        {quantityWords.map((word, index) => (
                            <button onClick={(e) => { e.preventDefault(); handleButtonClick(word); }} key={index} value={word} className={`${selectedWords.includes(word) ? 'bg-nyt-grayer' : 'bg-nyt-gray'
                                } ${selectedWords.includes(word) ? 'text-white' : 'text-black'
                                } select-none ease-out duration-75 rounded-xl mt-2 h-24 items-center justify-center  flex text-xl bg-nyt-gray font-bold`}>
                                <label className={`hover: cursor-pointer ${clicked ? ' animate-fade' : ''}`}>{word}</label>
                            </button>
                        ))}
                    </div>
                    <div className='m-7 text-xl items-center justify-center flex'>
                        Mistakes remaining:
                        <span className={` ${lives >= 1 ? 'visible' : 'animate-shrink '} w-5 h-5 mx-2 inline-block rounded-full bg-nyt-grayer`}></span>
                        <span className={` ${lives >= 2 ? 'visible' : 'animate-shrink '} w-5 h-5 mx-2 inline-block rounded-full bg-nyt-grayer`}></span>
                        <span className={` ${lives >= 3 ? 'visible' : 'animate-shrink '} w-5 h-5 mx-2 inline-block rounded-full bg-nyt-grayer`}></span>
                        <span className={` ${lives >= 4 ? 'visible' : 'animate-shrink '} w-5 h-5 mx-2 inline-block rounded-full bg-nyt-grayer`}></span>
                    </div>
                    {correctAnswers.length != 4 ? <div className='justify-center font-semibold text-lg flex gap-x-8'>
                        <button onClick={shuffle} className={` py-4 px-6  rounded-full border-2 ${clicked ?
                            'text-nyt-covered  select-none hover:cursor-default border-nyt-covered' : 'hover:bg-gray-200 text-black border-black'}`}>
                            Shuffle
                        </button>
                        <button onClick={(e) => { e.preventDefault(); setSelectedWords([]) }} className={` py-4 px-6  rounded-full border-2 
                        ${selectedWords.length > 0 ? 'hover:bg-gray-200 text-black select-text border-black' : 'hover: pointer-events-none border-nyt-covered text-nyt-covered'}`}>
                            Deselect all
                        </button>
                        <button onClick={checkAnswer} className={` py-4 px-6  rounded-full border-2 
                        ${selectedWords.length == 4 ? 'hover:bg-gray-500 hover:border-gray-500 bg-black text-white select-text border-black' : 'hover: pointer-events-none border-nyt-covered text-nyt-covered'}`}>
                            Submit
                        </button>
                    </div> : null}
                </form>
            </div>
        </main>
    );
}

