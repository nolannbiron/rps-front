import { Button, Flex, Portal, useDisclosure, useModal } from '@chakra-ui/react'
import React from 'react'
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet'
import { Modal } from '../Modal'

export default function ConnectWallet() {
    const { connect, loading, disconnect, active } = useWeb3Wallet()
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button
                colorScheme="teal"
                onClick={() => (active ? disconnect() : onOpen())}
                isLoading={loading}
                variant="outline"
                size="md"
            >
                {!active ? 'Connect wallet' : 'Disconnect'}
            </Button>
            <Portal>
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    title="Connect wallet"
                    render={
                        <Flex alignItems="center" px={4} pb={4} gap={4} justifyContent="center" direction="column">
                            <Button
                                colorScheme="teal"
                                onClick={() => connect('injected').then(() => onClose())}
                                isLoading={loading}
                                variant="outline"
                                size="md"
                            >
                                Metamask
                            </Button>
                            <Button
                                colorScheme="teal"
                                onClick={() => connect('walletconnect').then(() => onClose())}
                                isLoading={loading}
                                variant="outline"
                                size="md"
                            >
                                Wallet Connect
                            </Button>
                        </Flex>
                    }
                />
            </Portal>
        </>
    )
}
