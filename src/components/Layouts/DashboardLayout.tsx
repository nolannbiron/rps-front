import { Flex, Box, Spinner } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { useWeb3Network } from '../../hooks/useWeb3Network'
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet'
import Login from '../../pages/Login'
import SwitchNetwork from '../SwitchNetwork'
import { Header } from './Header'

export const DashboardLayout = () => {
    const { active, loading } = useWeb3Wallet()
    const { networkError } = useWeb3Network()

    return (
        <>
            <Header />
            <Flex flex={1} h="full">
                <Box width="100%" h="full" px={5} py={8}>
                    {networkError ? <SwitchNetwork /> : loading ? <Spinner /> : active ? <Outlet /> : <Login />}
                </Box>
            </Flex>
        </>
    )
}
