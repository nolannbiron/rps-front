import { Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useGame } from '../../contexts/GameContext'
import { getPlayerId, hasJ2Played, isGameDone } from '../../utils'
import GameRefund from './GameRefund'
import Play from './Play'
import Solve from './Solve'

export default function Actions(): JSX.Element {
    const {
        state: { game },
    } = useGame()
    const hasPlayed = hasJ2Played(game)
    const gameDone = isGameDone(game)
    const playerId = getPlayerId(game)

    if (!playerId) return <></>

    if (playerId === 2 && !hasPlayed && !gameDone) return <Play />

    return <>{playerId === 1 && hasPlayed && !gameDone && <Solve />}</>
}
