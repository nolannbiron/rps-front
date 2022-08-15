import { Box, Button, Flex, Portal, useDisclosure } from '@chakra-ui/react'
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet'
import Metamask from '../../assets/svg/metamask.png'
import WalletConnect from '../../assets/svg/walletconnect.png'
import { Modal } from '../Modal'
import { useWeb3Network } from '../../hooks/useWeb3Network'

export default function ConnectWallet() {
    const { connect, loading, disconnect, active } = useWeb3Wallet()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { networkError } = useWeb3Network()
    return (
        <Box>
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
                    maxW="md"
                    render={
                        <Flex alignItems="center" px={4} pb={4} gap={4} justifyContent="center" direction="column">
                            <Button
                                colorScheme="orange"
                                onClick={() => connect('injected').then(() => onClose())}
                                isLoading={loading}
                                variant="outline"
                                size="md"
                                gap={3}
                            >
                                <img src={Metamask} width="20px" height="20px" />
                                Metamask
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={() => connect('walletconnect').then(() => onClose())}
                                isLoading={loading}
                                variant="outline"
                                size="md"
                                gap={2}
                                px={3}
                            >
                                <img src={WalletConnect} width="30px" height="30px" />
                                Wallet Connect
                            </Button>
                        </Flex>
                    }
                />
            </Portal>
        </Box>
    )
}
