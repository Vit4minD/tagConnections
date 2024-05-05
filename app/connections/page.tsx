'use client'
import { ChakraProvider, useDisclosure } from '@chakra-ui/react'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { RxQuestionMarkCircled } from "react-icons/rx";
import Image from 'next/image'

export default function Home() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <main>
            <div className="w-full pb-8  border-gray-300 border-2">
                <div className="mt-12 ml-40 gap-3 text-6xl flex justify-start font-extrabold font-sans">
                    <div>Griffin Connections</div>
                    <div className=" mt-10 text-2xl font-sans font-extralight">May 17, 2024</div>
                </div>
            </div>
            <button onClick={onOpen} className='hover:shadow-2xl hover:bg-slate-200 ease-in-out duration-150 p-1 m-2 text-4xl'><RxQuestionMarkCircled /></button>
            <ChakraProvider>
                <Modal size='2xl' isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody>
                            <img
                                src="/howToPlayConnections.png"
                                alt="Picture of the author"
                                className='w-full mt-7'
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </ChakraProvider>

        </main>
    );
}
