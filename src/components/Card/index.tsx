import React from 'react'
import { Box, chakra, Flex, Grid, Heading, Tooltip, BoxProps } from '@chakra-ui/react'
import styled from 'styled-components'
import { FaArrowLeft } from 'react-icons/fa'
import { MdHelpOutline } from 'react-icons/md'

const CardWrapper = chakra(Box, {
    baseStyle: {
        borderRadius: 16,
        border: 'solid 1px',
    },
})

const StyledCardHeader = styled(Box)`
    display: grid;
    grid-template-columns: auto;
    align-items: center;
    .titleCardHeader {
        grid-column-start: ${({ children }) => (React.Children.toArray(children).length > 1 ? 2 : 1)};
        justify-content: ${({ children }) => (React.Children.toArray(children).length === 1 ? 'start' : 'center')};
    }
`

export const BackButton = ({ onClick }: { onClick?: () => void }) => {
    return (
        <Box _hover={{ cursor: 'pointer', opacity: 0.8 }} onClick={onClick}>
            <FaArrowLeft size={22} />
        </Box>
    )
}

export const HelpButton = () => {
    return (
        <Tooltip
            hasArrow
            placement="bottom"
            label="Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus."
        >
            <span>
                <MdHelpOutline size={23} />
            </span>
        </Tooltip>
    )
}

interface CardHeaderProps {
    title: string
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
}

export const CardHeader = ({ title, iconLeft, iconRight }: CardHeaderProps) => {
    return (
        <StyledCardHeader pt={5} px={5}>
            {iconLeft && iconLeft}
            <Flex className="titleCardHeader">
                <Heading as="h2" size="md">
                    {title}
                </Heading>
            </Flex>
            {iconRight && <Flex justifyContent="flex-end">{iconRight}</Flex>}
        </StyledCardHeader>
    )
}

interface CardProps extends BoxProps {
    children: React.ReactNode
    header?: React.ReactNode
}

export const Card = ({ children, header, ...props }: CardProps) => {
    return (
        <CardWrapper {...props}>
            {header && header}
            {children}
        </CardWrapper>
    )
}
