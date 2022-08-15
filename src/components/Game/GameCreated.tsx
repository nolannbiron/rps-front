import { Button, Container, Flex } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { CgArrowRight } from 'react-icons/cg'
import { useNavigate } from 'react-router-dom'
import { Move, Moves, setGameCreated, useGame } from '../../contexts/GameContext'
import { Card } from '../Card'
import InfoWrapper from './InfoWrapper'

interface Props {
    move: number
    salt: BigNumber
    address: string
}

export default function GameCreated({ move, salt, address }: Props): JSX.Element {
    const navigate = useNavigate()
    const { dispatch } = useGame()

    const handleNavigation = (): void => {
        dispatch(
            setGameCreated({
                j1Move: Move.Null,
                address: address,
                salt: undefined,
            })
        )
        navigate(`/game/${address}`)
    }

    return (
        <Container maxW="container.md" flexDirection="column">
            <Card>
                <Flex direction="column" alignItems="stretch" gap={10} p={5}>
                    <InfoWrapper title="Game address" content={address} />
                    <InfoWrapper title="Your move" content={Object.values(Moves)[move - 1]} />
                    <InfoWrapper title="Your Salt (You'll need it to solve the game)" important content={salt._hex} />
                    <Button
                        alignItems="center"
                        onClick={handleNavigation}
                        colorScheme="teal"
                        rightIcon={<CgArrowRight />}
                    >
                        Go to game
                    </Button>
                </Flex>
            </Card>
        </Container>
    )
}
