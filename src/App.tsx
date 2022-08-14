import React, { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme/index'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewGame from './pages/NewGame'
import { DashboardLayout } from './components/Layouts/DashboardLayout'
import { Web3ReactProvider } from '@web3-react/core'
import Game from './pages/Game'
import Login from './pages/Login'
import { GameProvider } from './contexts/GameContext'
import { Helmet } from 'react-helmet'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { Web3ReactHooks } from '@web3-react/core'
import { metaMask, hooks as metaMaskHooks } from './utils/connectors/metamask'
import { walletConnect, hooks as walletConnectHooks } from './utils/connectors/walletconnect'
import { ConnectionType } from './hooks/useWeb3Wallet'

const connectors: [MetaMask | WalletConnect, Web3ReactHooks][] = [
    [metaMask, metaMaskHooks],
    [walletConnect, walletConnectHooks],
]
function App() {
    const connexionType = (localStorage.getItem('connexionType') as ConnectionType) || false

    useEffect(() => {
        if (connexionType === 'injected') {
            void metaMask.connectEagerly().catch(() => {
                console.debug('Failed to connect eagerly to metamask')
            })
        } else if (connexionType === 'walletconnect') {
            walletConnect.connectEagerly().catch(() => {
                console.debug('Failed to connect eagerly to walletconnect')
            })
        }
    }, [])

    return (
        <Web3ReactProvider connectors={connectors}>
            <ChakraProvider theme={theme}>
                <GameProvider>
                    <Helmet>
                        <title>RPSLS</title>
                    </Helmet>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<DashboardLayout />}>
                                <Route index element={<NewGame />} />
                                <Route path="/game/:contract" element={<Game />} />
                                <Route path="/login" element={<Login />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </GameProvider>
            </ChakraProvider>
        </Web3ReactProvider>
    )
}

export default App
