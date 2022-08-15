import { LogoWrapper } from './styled'
import { ColorModeSwitcher } from '../ColorMode/ColorModeSwitcher'
import { Box, Button, chakra, Flex, Portal, Text, useColorModeValue } from '@chakra-ui/react'
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet'
import { useDisclosure } from '@chakra-ui/react'
import { Modal } from '../Modal'
import { useNavigate } from 'react-router-dom'
import ConnectWallet from '../ConnectWallet'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useGetPlayerBalance } from '../../utils'

export const Header = () => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { account } = useWeb3Wallet()
    const navigate = useNavigate()

    return (
        <>
            <chakra.header
                shadow="lg"
                h="80px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={[4, 6]}
                borderBottom="solid 2px"
                borderColor={useColorModeValue('rgba(255,255,255, 1)', 'rgba(255,255,255,0.15)')}
            >
                <Box cursor="pointer" onClick={() => navigate('/')}>
                    <LogoWrapper name="RPSLS" />
                </Box>
                <Flex alignItems="center" gap={4}>
                    <ColorModeSwitcher aria-label="" />
                    {!!account && (
                        <Flex cursor="pointer" alignItems="center" onClick={onOpen}>
                            <Jazzicon diameter={35} seed={jsNumberForAddress(account)} />
                        </Flex>
                    )}
                    <ConnectWallet />
                </Flex>
            </chakra.header>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Your account"
                render={
                    <Box mb={4}>
                        <Text noOfLines={1}>👱 Address : {account}</Text>
                        <Text>🤑 Balance : {useGetPlayerBalance()} ETH</Text>
                    </Box>
                }
            />
        </>
    )
}
