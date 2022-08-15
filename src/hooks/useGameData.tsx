import { useEffect } from 'react'
import { getGameData } from '../utils'
import { setError, setGameData, setIsLoading, useGame } from '../contexts/GameContext'
import useContract from './useContract'
import { RPS } from '../abis/RPS'

export interface Props {
    address: string
}

export default function useGameData({ address }: Props): void {
    const { dispatch } = useGame()
    const contract = useContract({ abi: RPS.abi, address })

    useEffect(() => {
        dispatch(setIsLoading(true))

        getGameData(contract)
            .then((gameData) => {
                dispatch(setGameData(gameData))
            })
            .catch(() => {
                dispatch(setError(true))
            })
            .finally(() => {
                dispatch(setIsLoading(false))
            })
    }, [contract])
}
