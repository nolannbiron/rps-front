import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { getContractFactory } from '../utils'

interface Props {
    bytecode: any
    abi: any
}

export default function useContractFactory({ bytecode, abi }: Props) {
    const { provider, account } = useWeb3React()

    const contract = useMemo(() => {
        if (!abi || !provider || !bytecode) return null
        try {
            return getContractFactory(bytecode, abi, provider, account)
        } catch (error) {
            console.error('Failed to create contract', error)
            return null
        }
    }, [bytecode, abi, provider, account])

    return contract
}
