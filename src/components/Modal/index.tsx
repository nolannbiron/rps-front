import React, { useRef } from 'react'
import {
    Modal as ModalWrapper,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    ModalCloseButton,
    useBreakpointValue,
    Slide,
    Box,
    useOutsideClick,
} from '@chakra-ui/react'
import MobileModal from './MobileModal'

interface ModalProps {
    render?: React.ReactNode
    footer?: React.ReactNode
    isOpen: boolean
    onClose: () => void
    title?: string
}

export function Modal({ render, title, footer, isOpen, onClose }: ModalProps) {
    return (
        <>
            <ModalWrapper closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent maxW="container.md">
                    {title && <ModalHeader>{title}</ModalHeader>}
                    <ModalCloseButton />

                    <ModalBody>{render}</ModalBody>
                    {!!footer && <ModalFooter>{footer}</ModalFooter>}
                </ModalContent>
            </ModalWrapper>
        </>
    )
}
