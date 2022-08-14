import { Box, Slide, useOutsideClick } from '@chakra-ui/react'
import { useRef } from 'react'
import { useSwipe } from '../../hooks/useSwipe'

interface Props {
    onClose: () => void
    isOpen: boolean
    render: React.ReactNode
}

export default function MobileModal({ render, isOpen, onClose }: Props): JSX.Element {
    const ref = useRef<HTMLDivElement>(null)
    useOutsideClick({ ref, handler: onClose })

    return (
        <Slide in={isOpen} ref={ref} direction="bottom">
            <Box bg="white" p="40px" color="white" mt="4" rounded="md" shadow="md">
                {render}
            </Box>
        </Slide>
    )
}
