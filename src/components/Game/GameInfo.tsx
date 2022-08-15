import { Flex, Tag } from '@chakra-ui/react'
import { Game, Move } from '../../contexts/GameContext'
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet'
import { isGameDone } from '../../utils'
import { formatEther } from '@ethersproject/units'
import InfoWrapper from './InfoWrapper'
import { getGameStatus } from './GameStatus'

interface Props {
    game: Game
}

interface TitleProps {
    title: string
}

const Owner = ({ title }: TitleProps) => (
    <Flex direction="row" justifyContent="center" gap={2} alignItems="center">
        {title}
        <Tag>You</Tag>
    </Flex>
)

export default function GameInfo({ game }: Props): JSX.Element {
    const { account } = useWeb3Wallet()
    const gameDone = isGameDone(game)
    const status = getGameStatus(game)

    return (
        <Flex direction="column" gap={4}>
            {gameDone && status !== 'cancelled' && !!game.result && (
                <InfoWrapper winner title="🏆 Winner" content={game.result} />
            )}
            <InfoWrapper title="💰 Stake" content={`${formatEther(game.stake)} ETH`} />
            <InfoWrapper
                title={account === game.j1.address ? <Owner title="👱 Player one" /> : `👱 Player one`}
                content={game.j1.address}
            />
            <InfoWrapper
                title={account === game.j2.address ? <Owner title="👱 Player two" /> : `👱 Player two`}
                content={game.j2.address}
            />
            <InfoWrapper title="#️⃣ Commitment" content={game.j1.commitment} />
            <InfoWrapper title="⏰ Last action" content={game.lastAction.toLocaleString()} />
            <InfoWrapper
                title="✍️ Player 2 move"
                content={game.j2.move === Move.Null ? '⌛️ Pending' : Move[game.j2.move]}
            />
        </Flex>
    )
}
