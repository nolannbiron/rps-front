import React, { useRef } from 'react'
import {
    Modal as ModalWrapper,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useColorModeValue,
    ModalContentProps,
} from '@chakra-ui/react'

interface ModalProps {
    render?: React.ReactNode
    footer?: React.ReactNode
    isOpen: boolean
    onClose: () => void
    title?: string
    maxW?: ModalContentProps['maxW']
}

export function Modal({ render, title, footer, isOpen, onClose, maxW = 'container.md' }: ModalProps) {
    const bg = useColorModeValue('whiteAlpha.900', 'gray.900')
    return (
        <ModalWrapper closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={bg} maxW={maxW}>
                {title && <ModalHeader>{title}</ModalHeader>}
                <ModalCloseButton />

                <ModalBody>{render}</ModalBody>
                {!!footer && <ModalFooter>{footer}</ModalFooter>}
            </ModalContent>
        </ModalWrapper>
    )
}
