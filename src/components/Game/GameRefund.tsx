import { useCallback, useState } from 'react'
import { RPS } from '../../abis/RPS'
import useContract from '../../hooks/useContract'
import { Game, setGameData, setIsFetching, setIsLoading, useGame } from '../../contexts/GameContext'
import { Button, Spinner, Tooltip, useInterval } from '@chakra-ui/react'
import { canJ1Refund, canJ2Refund, getGameData, getPlayerId, hasJ2Played, isGameDone } from '../../utils'
import { Link, useNavigate } from 'react-router-dom'

interface PlayerIdProps {
    address?: string
    playerId: 1 | 2
}

interface InactiveRefundProps {
    handleDone?: () => void
}

export function secondsUntilTimeout({ lastAction, timeout }: Game, currentDate: Date): number {
    return Math.round((timeout - (currentDate.getTime() - lastAction.getTime())) / 1000)
}

function secondsToTime(e: number) {
    const m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(2, '0')
    const s = Math.floor(e % 60)
        .toString()
        .padStart(2, '0')

    return m + ':' + s
}

function InactiveRefundButton({ handleDone }: InactiveRefundProps) {
    const {
        state: { game },
    } = useGame()

    const [timeoutInSeconds, setTimeoutInSeconds] = useState(secondsUntilTimeout(game, new Date()))

    useInterval(() => {
        const secondsLeft = secondsUntilTimeout(game, new Date())
        if (secondsLeft >= 0) {
            setTimeoutInSeconds(secondsLeft)
        } else {
            handleDone && handleDone()
        }
    }, 1000)

    return (
        <Tooltip placement="top" shouldWrapChildren hasArrow label="Opponent has 5 minutes to play">
            <Button isDisabled colorScheme="teal">
                Cancel available in {secondsToTime(timeoutInSeconds)}
            </Button>
        </Tooltip>
    )
}

export default function GameRefund() {
    const navigate = useNavigate()
    const {
        state: { game, isLoading, isFetching },
        dispatch,
    } = useGame()
    const contract = useContract({ abi: RPS.abi, address: game.address })
    const gameDone = isGameDone(game)
    const playerId = getPlayerId(game)
    const currentDate = new Date()
    const [canClaimTimeout, setCanClaimTimeout] = useState(
        playerId === 1 ? canJ1Refund(game, currentDate) : canJ2Refund(game, currentDate)
    )

    const handleTimeout = useCallback(() => {
        setCanClaimTimeout(true)
    }, [setCanClaimTimeout])

    const handleClaimTimeout = useCallback(async () => {
        try {
            dispatch(setIsFetching(true))

            const action = playerId === 1 ? contract.j2Timeout() : contract.j1Timeout()
            const txn = await action
            await txn.wait()
        } catch (err) {
            console.error('Error on claim timeout', err)
        } finally {
            dispatch(setIsFetching(false))
            try {
                dispatch(setIsLoading(true))
                dispatch(setGameData(await getGameData(contract)))
            } finally {
                dispatch(setIsLoading(false))
            }
        }
    }, [contract, dispatch, playerId])

    if (gameDone || !playerId)
        return (
            <Link to="/">
                <Button colorScheme="teal">Create new game</Button>
            </Link>
        )
    if (playerId === 1 && hasJ2Played(game)) return <></>
    if (playerId === 2 && !hasJ2Played(game)) return <></>

    return !isLoading ? (
        canClaimTimeout ? (
            <Tooltip hasArrow label="Cancel game and retrieve your stake">
                <Button colorScheme="teal" disabled={isFetching} isLoading={isFetching} onClick={handleClaimTimeout}>
                    Cancel game
                </Button>
            </Tooltip>
        ) : (
            <InactiveRefundButton handleDone={() => setCanClaimTimeout(true)} />
        )
    ) : (
        <Spinner />
    )
}
