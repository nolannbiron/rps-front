import { BigNumber } from 'ethers'
import React, { createContext, useReducer } from 'react'
import { parseEther } from '@ethersproject/units'
export const Moves = {
    1: '👊 Rock',
    2: '📃 Paper',
    3: '✂️ Scissors',
    4: '🦎 Lizard',
    5: '🖖 Spock',
} as const

export enum Move {
    Null = 0,
    Rock = 1,
    Paper = 2,
    Scissors = 3,
    Lizard = 4,
    Spock = 5,
}

export type MoveValue = typeof Move[keyof typeof Move]
export type MoveKey = keyof typeof Move

export interface Game {
    address: string
    j1: {
        address: string
        commitment: string
        move?: Move
        salt?: BigNumber
    }
    j2: {
        address: string
        move: Move
    }
    stake: BigNumber
    lastAction: Date
    timeout: number
    result: string
}

interface GameState {
    game: Game
    isLoading: boolean
    isError: boolean
    isFetching: boolean
}

export type GameAction =
    | { type: 'SET_GAME'; payload: Game }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: boolean }
    | { type: 'SET_FETCHING'; payload: boolean }

interface GameContextType {
    state: GameState
    dispatch: React.Dispatch<GameAction>
}

const initialState: GameState = {
    game: {
        address: '',
        j1: {
            address: '',
            commitment: '',
        },
        j2: {
            address: '',
            move: Move.Null,
        },
        stake: parseEther('0.001'),
        lastAction: new Date(0),
        result: '',
        timeout: 0,
    },
    isLoading: false,
    isError: false,
    isFetching: false,
}

export const GameContext = createContext<GameContextType>({
    state: initialState,
    dispatch: () => {},
})

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'SET_GAME':
            return {
                ...state,
                game: action.payload,
            }
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            }
        case 'SET_ERROR':
            return {
                ...state,
                isError: action.payload,
            }
        case 'SET_FETCHING':
            return {
                ...state,
                isFetching: action.payload,
            }
        default:
            return state
    }
}

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState)

    return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

export const useGame = () => {
    const { state, dispatch } = React.useContext(GameContext)
    return {
        state,
        dispatch,
    }
}

export const setIsLoading = (value: boolean): { type: 'SET_LOADING'; payload: boolean } => ({
    type: 'SET_LOADING',
    payload: value,
})

export const setIsFetching = (value: boolean): { type: 'SET_FETCHING'; payload: boolean } => ({
    type: 'SET_FETCHING',
    payload: value,
})

export const setGameData = (value: Game): { type: 'SET_GAME'; payload: Game } => ({
    type: 'SET_GAME',
    payload: value,
})

export const setError = (value: boolean): { type: 'SET_ERROR'; payload: boolean } => ({
    type: 'SET_ERROR',
    payload: value,
})
