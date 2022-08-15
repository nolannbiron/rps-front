import { Container, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { parseEther } from '@ethersproject/units'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hasher } from '../abis/Hasher'
import { RPS } from '../abis/RPS'
import { Card, CardHeader } from '../components/Card'
import JoinGame from '../components/Game/JoinGame'
import NewGameForm, { NewGameData } from '../components/Game/NewGameForm'
import { setGameCreated, useGame } from '../contexts/GameContext'
import useContract from '../hooks/useContract'
import useContractFactory from '../hooks/useContractFactory'
import { randomSalt } from '../utils'

export default function NewGame() {
    const hasher = useContract(Hasher)
    const rps = useContractFactory(RPS)
    const navigate = useNavigate()
    const [gameLoading, setGameLoading] = React.useState(false)
    const { dispatch } = useGame()

    const handleNewGame = useCallback(
        async ({ j1Move, j2Address, stake }: NewGameData) => {
            setGameLoading(true)
            const salt = randomSalt()

            if (!hasher || !rps) return setGameLoading(false)

            try {
                const j1Hash = await hasher.hash(j1Move, salt)
                const contract = await rps.deploy(j1Hash, j2Address, {
                    value: parseEther(stake.toString()),
                    gasLimit: 1000000,
                })

                await contract.deployed()
                dispatch(setGameCreated({ address: contract.address, salt: salt, j1Move }))
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
