import React from 'react'
import { Box, chakra, Flex } from '@chakra-ui/react'
import { FaWallet } from 'react-icons/fa'
import { MdSwapVert } from 'react-icons/md'
import { GiReceiveMoney } from 'react-icons/gi'
import { NavLink } from 'react-router-dom'

const ItemLink = chakra(NavLink)

interface Props {
    icon: React.ReactNode
    title: string
    to: string
}

const Item = ({ icon, title, to }: Props) => {
    return (
        <ItemLink
            _activeLink={{ opacity: 1 }}
            to={to}
            _hover={{ opacity: 1, cursor: 'pointer' }}
            opacity={0.6}
            display="flex"
            alignItems="center"
            justifyContent="start"
            gap={5}
        >
            {icon}
            <Box fontSize={18}>{title}</Box>
        </ItemLink>
    )
}

export const Sidebar = () => {
    return (
        <Box height="100%" px="10" py="16" borderRight="2px solid" borderColor="rgba(255, 255, 255, 0.15)">
            <Flex flexDir="column" height="100%" gap={5}>
                <Item to="/app/dashboard" icon={<FaWallet size={15} />} title="Dashboard" />
                <Item to="/app/stake" icon={<MdSwapVert size={18} />} title="stake" />
                <Item to="/app/rewards" icon={<GiReceiveMoney size={18} />} title="Rewards" />
            </Flex>
        </Box>
    )
}
