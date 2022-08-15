import { Box, BoxProps, Tag, TagLabel, TagLeftIcon, TagProps } from '@chakra-ui/react'
import { CgDanger, CgSandClock } from 'react-icons/cg'
import { Game, useGame } from '../../contexts/GameContext'
import { getPlayerId, hasJ2Played, isGameDone } from '../../utils'
import { ImCheckmark, ImCross } from 'react-icons/im'

interface Props extends BoxProps {}

export type GameStatus = 'pending' | 'settled' | 'cancelled' | 'actionNeeded'

export const getGameStatusTag = (game: Game): { icon: any; color: TagProps['colorScheme']; label: string } => {
    const isSettled = isGameDone(game)
    const hasPlayed = hasJ2Played(game)
    const playerId = getPlayerId(game)
    let status: GameStatus
    if (!playerId) {
        status = isSettled ? (hasPlayed ? 'settled' : 'cancelled') : !hasPlayed ? 'actionNeeded' : 'pending'
    } else {
        status = isSettled
            ? hasPlayed
                ? 'settled'
                : 'cancelled'
            : playerId === 1 && hasPlayed
            ? 'actionNeeded'
            : playerId === 2 && !hasPlayed
            ? 'actionNeeded'
            : 'pending'
    }

    switch (status) {
        case 'settled':
            return {
                icon: ImCheckmark,
                color: 'green',
                label: 'Settled',
            }
        case 'cancelled':
            return {
                icon: ImCross,
                color: 'red',
                label: 'Cancelled',
            }
        case 'actionNeeded':
            return {
                icon: CgDanger,
                color: 'red',
                label: 'Action needed',
            }
        case 'pending':
            return {
                icon: CgSandClock,
                color: 'gray',
                label: 'Pending',
            }
    }
}

export const getGameStatus = (game: Game): GameStatus => {
    const isSettled = isGameDone(game)
    const hasPlayed = hasJ2Played(game)
    const playerId = getPlayerId(game)

    if (!playerId) {
        return isSettled ? (hasPlayed ? 'settled' : 'cancelled') : !hasPlayed ? 'actionNeeded' : 'pending'
    }

    return isSettled
        ? hasPlayed
            ? 'settled'
            : 'cancelled'
        : playerId === 1 && hasPlayed
        ? 'actionNeeded'
        : playerId === 2 && !hasPlayed
        ? 'actionNeeded'
        : 'pending'
}

export default function GameStatus({ ...props }: Props): JSX.Element {
    const {
        state: { game },
    } = useGame()

    const { icon, color, label } = getGameStatusTag(game)
    return (
        <Box {...props}>
            <Tag size="lg" variant="subtle" colorScheme={color}>
                <TagLeftIcon boxSize="12px" as={icon} />
                <TagLabel>{label}</TagLabel>
            </Tag>
        </Box>
    )
}
