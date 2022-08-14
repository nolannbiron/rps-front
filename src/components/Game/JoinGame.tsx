import { Button, Flex, Input, InputGroup, Text } from '@chakra-ui/react'
import { isAddress } from '@ethersproject/address'
import { ethers } from 'ethers'
import React from 'react'
import { useNavigate } from 'react-router-dom'

async function isContract(address: string) {
    const provider = ethers.getDefaultProvider()
    return (await provider.getCode(address)) === '0x' ? true : false
}

export default function JoinGame() {
    const [address, setAddress] = React.useState('')
    const navigate = useNavigate()

    return (
        <>
            <Text fontSize="lg" fontWeight="bold" mt={3} mb={3}>
                Join a game
            </Text>
            <Flex alignItems="center" justifyContent="center" direction="column" gap={4}>
                <Flex w="full" direction="column" gap={2}>
                    <Input
                        type="text"
                        placeholder="Enter game address"
                        isInvalid={address.length > 6 && !isAddress(address)}
                        onChange={(e: any) => setAddress(e.currentTarget.value)}
                    />

                    {address.length > 6 && !isAddress(address) && (
                        <Text fontSize="xs" color="red.500">
                            Please enter a valid game address
                        </Text>
                    )}
                </Flex>
                <Button
                    colorScheme="teal"
                    isDisabled={!address || !isAddress(address)}
                    variant="solid"
                    onClick={() => navigate(`/game/${address}`)}
                >
                    Go to game
                </Button>
            </Flex>
        </>
    )
}
