import { formatEther } from '@ethersproject/units'
import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { Contract, ContractFactory } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { BigNumber } from 'ethers'
import { Game, Move } from '../contexts/GameContext'
import { useWeb3Wallet } from '../hooks/useWeb3Wallet'
import { Tag } from '@chakra-ui/react'
import { ownerTag } from './render'
import { useWeb3React } from '@web3-react/core'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: string) {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4) {
    const parsed = isAddress(address)
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// account is optional
export function getContract(address: string, ABI: any, library: any, account: string) {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new ethers.Contract(address, ABI, library.getSigner(account))
}

export function getContractFactory(bytecode: string, ABI: any, library: any, account?: string | null): ContractFactory {
    return new ContractFactory(ABI, bytecode, library.getSigner(account))
}

export const formatNumber = (value: number, library: any): string => {
    if (!library) return '0'

    value = parseFloat(library.utils.fromWei(value, 'ether'))

    return value < 1 ? value.toFixed(2) : value.toFixed(0)
}

export function randomSalt(): BigNumber {
    // Creates 8 x 32-bit integers
    const array = new Uint32Array(8)
    // Assign criptographically secure values for each item in the array
    window.crypto.getRandomValues(array)

    // Concatenates the string representation of the numbers together
    const str = array.reduce((acc, current) => acc + String(current), '')

    // Returns a BigNumber with at most 256 bits
    return BigNumber.from(str).mask(256)
}

const secondsToMiliseconds = (seconds: number): number => seconds * 1000

export const getGameData = async (contract: Contract): Promise<Game> => {
    const [j1Address, j1Commitment, j2Address, j2Move, stake, lastAction, timeoutSeconds] = await Promise.all([
        contract.j1(),
        contract.c1Hash(),
        contract.j2(),
        contract.c2(),
        contract.stake(),
        contract.lastAction(),
        contract.TIMEOUT(),
    ])

    const salt = localStorage.getItem(`salt_${j2Address}`)

    return {
        address: contract.address,
        j1: {
            address: j1Address,
            commitment: j1Commitment,
        },
        j2: {
            address: j2Address,
            move: j2Move as Move,
        },
        stake: BigNumber.from(stake),
        lastAction: new Date(secondsToMiliseconds(Number(lastAction))),
        timeout: secondsToMiliseconds(timeoutSeconds),
        result: '',
    }
}

export function canJ1Refund({ j2, lastAction, timeout, stake }: Game, currentDate: Date): boolean {
    if (Number(stake) === 0) {
        // Game is already settled
        return false
    }

    if (j2.move !== Move.Null) {
        // Player 2 has already played
        return false
    }

    return currentDate.getTime() - lastAction.getTime() >= timeout
}

export function canJ2Refund({ j2, lastAction, timeout, stake }: Game, currentDate: Date): boolean {
    if (Number(stake) === 0) {
        // Game is already settled
        return false
    }

    if (j2.move === Move.Null) {
        // Player 2 hasn't played yet
        return false
    }

    return currentDate.getTime() - lastAction.getTime() >= timeout
}

export function isGameDone({ stake }: Game): boolean {
    return Number(stake) === 0
}

export function hasJ2Played({ j2 }: Game): boolean {
    return j2.move !== Move.Null
}

export function secondsUntilTimeout({ lastAction, timeout }: Game, currentDate: Date): number {
    return Math.round((timeout - (currentDate.getTime() - lastAction.getTime())) / 1000)
}

export function verifyOwner(address: string) {
    const { account } = useWeb3Wallet()
    return account === address ? ownerTag(address) : address
}

export function isAddressEquals(address1: string, address2: string): boolean {
    return address1 === address2
}

export function validateFormAddress(address: string): boolean {
    return !!isAddress(address) ? true : false
}

export function getPlayerId(game: Game): 1 | 2 | undefined {
    const { account } = useWeb3Wallet()
    return account === game.j1.address ? 1 : account === game.j2.address ? 2 : undefined
}

export function useGetPlayerBalance() {
    const { account, provider } = useWeb3React()
    const [balance, setBalance] = React.useState<number>(0)

    useEffect(() => {
        async function fetch() {
            if (!provider) return
            const balance = await provider.getBalance(account ?? '')
            setBalance(Number(formatEther(balance)))
            return balance
        }
        fetch()
    }, [])

    return balance
}
