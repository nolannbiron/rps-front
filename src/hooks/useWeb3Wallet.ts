import { WalletConnect } from '@web3-react/walletconnect'
import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { walletConnect } from '../utils/connectors/walletconnect'
import { metaMask } from '../utils/connectors/metamask'

export type ConnectionType = 'injected' | 'walletconnect'

export const useWeb3Wallet = () => {
    const { isActive, account } = useWeb3React()
    const [loading, setLoading] = React.useState(false)
    const connexionType = (localStorage.getItem('connexionType') as ConnectionType) || false

    const resetWalletConnector = () => {
        if (walletConnect && walletConnect instanceof WalletConnect && walletConnect.provider?.rpcUrl) {
            walletConnect.provider = undefined
        }
    }

    const connect = async (type: ConnectionType) => {
        setLoading(true)

        if (type === 'injected') {
            await metaMask.activate(5).then(() => localStorage.setItem('connexionType', 'injected'))
        } else if (type === 'walletconnect') {
            await walletConnect
                .activate(5)
                .then(() => localStorage.setItem('connexionType', 'walletconnect'))
                .catch(() => resetWalletConnector())
        }
        setLoading(false)
    }

    const disconnect = async () => {
        try {
            setLoading(true)
            connexionType === 'injected' ? await metaMask?.deactivate?.() : await walletConnect.deactivate()
            localStorage.removeItem('connexionType')
            setLoading(false)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    return {
        connect,
        disconnect,
        account,
        active: isActive,
        loading,
    }
}
