import React from 'react'
import { chakra, Flex } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { ReactComponent as Logo } from '../../../assets/svg/logo.svg'

export const HeaderWrapper = chakra('header', {
    baseStyle: {
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 6,
        bg: 'white',
    },
})

export const LogoWrapper = ({ name }: { name: string }) => (
    <Flex alignItems="center" gap={3}>
        {/* <Logo /> */}
        <img
            src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🖖</text></svg>"
            width="30px"
            height="30px"
            alt=""
        />
        <Heading display={['none', '', 'block']} as="h1" size="md" textTransform="uppercase">
            {name}
        </Heading>
    </Flex>
)
