import { Box, Button, Container, Flex, Text } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { useLocation, useParams } from 'react-router-dom'
import { Card, CardHeader } from '../components/Card'
import GameInfo from '../components/Game/GameInfo'
import GameRefund from '../components/Game/GameRefund'
import { useGame } from '../contexts/GameContext'
import useGameData from '../hooks/useGameData'
import GameStatus from '../components/Game/GameStatus'
import Actions from '../components/Game/Actions'
import { Helmet } from 'react-helmet'
import GameCreated from '../components/Game/GameCreated'

interface GameLocationState {
    salt: BigNumber
    move: number
}

export default function Game(): JSX.Element {
    const { contract } = useParams() as NonNullable<{ contract: string }>
    const { state } = useLocation()
    useGameData({ address: contract })
    const {
        state: { game },
    } = useGame()

    if (!!(state as GameLocationState)?.move && !!(state as GameLocationState)?.salt)
        return (
            <GameCreated
                move={(state as GameLocationState).move}
                salt={(state as GameLocationState).salt}
                address={contract}
            />
        )

    console.log(game)

    return (
        <Container maxW="container.md" flexDirection="column" gap={3}>
            <Helmet>
                <title>Game {game.address}</title>
            </Helmet>

            <Flex gap={5} direction="column">
                <Card>
                    <Box p={5}>
                        <Flex direction={['column', 'row']} alignItems="center" justifyContent="space-between" gap={4}>
                            <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={1.5}>
                                    Status
                                </Text>
                                <GameStatus />
                            </Box>

                            <GameRefund />
                        </Flex>
                    </Box>
                </Card>
                <Actions />
                <Card>
                    <CardHeader title="Game Info" />
                    <Box px={5} my={5}>
                        <GameInfo game={game} />
                    </Box>
                </Card>
            </Flex>
        </Container>
    )
}
