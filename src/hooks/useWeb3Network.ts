import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'

export const useWeb3Network = () => {
    const { ethereum } = window
    const { isActive, account, provider, connector } = useWeb3React()
    const [networkError, setNetworkError] = useState(false)
    const [chainId, setChainId] = useState<number>()
    const toastId = 'web3-network-error'
    const toast = useToast({
        status: 'error',
        isClosable: true,
        duration: 5000,
        position: 'top-right',
        title: 'Wrong network, please switch to the correct one',
        id: toastId,
    })

    useEffect(() => {
        checkChainId()
    }, [isActive, account, provider, connector])

    const checkChainId = async () => {
        if (connector && isActive) {
            let chainId = (await provider?.detectNetwork())?.chainId
            setChainId(chainId)
            if (chainId !== 0x5 || chainId !== 5) {
                !toast.isActive(toastId) && toast()
                return setNetworkError(true)
            }
            return setNetworkError(false)
        } else {
            setNetworkError(false)
        }
    }

    const switchNetwork = async () => {
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x5' }],
            })
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            { chainId: '0x5', rpcUrl: 'https://goerli.infura.io/v3/5ac444b3c8014807ae1d035e482d996f' },
                        ],
                    })
                } catch (addError) {
                    console.error(addError)
                }
            }
        }
    }

    return {
        chainId,
        networkError,
        switchNetwork,
    }
}
