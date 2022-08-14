import { Button, Container, Flex, Heading, Input, Select, Spacer, Spinner, Text, useToast } from '@chakra-ui/react'
import { parseEther } from '@ethersproject/units'
import React, { ChangeEventHandler, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hasher } from '../abis/Hasher'
import { RPS } from '../abis/RPS'
import { Card, CardHeader } from '../components/Card'
import ConnectWallet from '../components/ConnectWallet'
import JoinGame from '../components/Game/JoinGame'
import NewGameForm, { NewGameData } from '../components/Game/NewGameForm'
import { GameContext } from '../contexts/GameContext'
import useContract from '../hooks/useContract'
import useContractFactory from '../hooks/useContractFactory'
import { randomSalt, getGameData } from '../utils'

export default function NewGame() {
    const hasher = useContract(Hasher)
    const rps = useContractFactory(RPS)
    const navigate = useNavigate()
    const [gameLoading, setGameLoading] = React.useState(false)
    const toast = useToast({
        status: 'error',
        duration: 5000,
        isClosable: true,
    })

    const handleNewGame = useCallback(
        async ({ j1Move, j2Address, stake }: NewGameData) => {
            setGameLoading(true)
            const salt = randomSalt()

            if (!hasher) return
            if (!rps) return

            try {
                const j1Commitment = await hasher.hash(j1Move, salt)
                const contract = await rps.deploy(j1Commitment, j2Address, {
                    value: parseEther(String(stake)),
                    gasLimit: 1000000,
                })

                await contract.deployed()
                navigate(`/game/${contract.address}`, { state: { salt: salt, move: j1Move } })
                setGameLoading(false)
            } catch (err) {
                setGameLoading(false)
            }
        },
        [hasher, rps]
    )

    return (
        <>
            <Container maxW="container.md">
                <Text fontSize="xl" fontWeight="bold" mb={1}>
                    Play the Web3 version of the famous game created by Sheldon Cooper. <br />
                </Text>
                <Text fontSize="md" fontWeight="medium" mb={6}>
                    Choose a move, your opponent, a stake price, and you're all set.
                </Text>
                <Card>
                    {!gameLoading && <CardHeader title="Create a game" />}
                    <Flex direction="column" px={5} py={5}>
                        {!gameLoading ? (
                            <>
                                <NewGameForm onClick={handleNewGame} />
                                <Text fontWeight="bold" textAlign="center" mt={3}>
                                    OR
                                </Text>
                                <JoinGame />
                            </>
                        ) : (
                            <Flex alignItems="center" justifyContent="center" direction="column" gap={4}>
                                <Heading fontSize="lg">Creating game</Heading>
                                <Spinner />
                            </Flex>
                        )}
                    </Flex>
                </Card>
            </Container>
        </>
    )
}
