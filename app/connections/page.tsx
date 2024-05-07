'use client'
import { ChakraProvider, useDisclosure } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useState } from 'react';
import { RxQuestionMarkCircled } from "react-icons/rx";

export default function Home() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const quantityWords: string[] = [
        "FEW", "MANY", "SEVERAL", "SOME",
        "COUPLE", "JOIN", "LINK", "TIE",
        "BOTHER", "HANDFUL", "PAIN", "PEST",
        "FOOL", "LOVERS", "MAGICIAN", "TOWER"
    ];
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
                {/* <div className='mt-8 flex-col font-sans h-24 text-xl w-full bg-nyt-blue rounded-xl flex justify-center items-center'>
                    <div className='flex-col font-bold text-center'>
                        QUANTITY WORDS
                        <div className='font-normal'>
                            FEW, MANY, SEVERAL, SOME
                        </div>
                    </div>
                </div>
                <div className='mt-2 flex-col font-sans h-24 text-xl w-full bg-nyt-yellow rounded-xl flex justify-center items-center'>
                    <div className='flex-col font-bold text-center'>
                        CONNECT
                        <div className='font-normal'>
                            COUPLE, JOIN, LINK, TIE
                        </div>
                    </div>
                </div>
                <div className='mt-2 flex-col font-sans h-24 text-xl w-full bg-nyt-green rounded-xl flex justify-center items-center'>
                    <div className='flex-col font-bold text-center'>
                        NUISANCE
                        <div className='font-normal'>
                            BOTHER, HANDFUL, PAIN, PEST
                        </div>
                    </div>
                </div>
                <div className='mt-2 flex-col font-sans h-24 text-xl w-full bg-nyt-purple rounded-xl flex justify-center items-center'>
                    <div className='flex-col font-bold text-center'>
                        TAROT CARDS, WITH "THE"
                        <div className='font-normal'>
                            FOOL, LOVERS, MAGICIAN, TOWER
                        </div>
                    </div>
                </div> */}
                <form>
                    <div className=' ease-in-out duration-75 gap-x-2 grid grid-cols-4'>
                        {quantityWords.map((word, index) => (
                            <button onClick={(e) => {e.preventDefault(); handleButtonClick(word);}} key={index} value={word} className={`${selectedWords.includes(word) ? 'bg-nyt-grayer' : 'bg-nyt-gray'
                                } ${selectedWords.includes(word) ? 'text-white' : 'ease-linear duration-75 text-black'
                                } select-none rounded-xl mt-2 h-24 items-center justify-center  flex text-xl bg-nyt-gray font-bold`}>
                                {word}
                            </button>
                        ))}
                    </div>
                </form>
            </div>
        </main>
    );
}

