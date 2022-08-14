import { Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useGame } from '../../contexts/GameContext'
import { hasJ2Played, isGameDone } from '../../utils'
import GameRefund from './GameRefund'
import Play from './Play'

export default function J2Actions() {
    const {
        state: { game },
    } = useGame()
    const hasPlayed = hasJ2Played(game)
    const gameDone = isGameDone(game)

    return <>{!hasPlayed && !gameDone && <Play />}</>
}
