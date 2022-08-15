import { ethers } from 'ethers'
import { useState, useEffect, useMemo } from 'react'
import { Contract } from 'ethers'
import { useWeb3React } from '@web3-react/core'

interface Props {
    abi: any
    address: string
}

export default function useContract({ abi, address }: Props) {
    const { provider, chainId, account } = useWeb3React()

    const [contract, setContract] = useState<Contract>(new ethers.Contract(address, abi, provider?.getSigner(account)))

    useEffect(() => {
        setContract(new Contract(address, abi, provider?.getSigner(account)))
    }, [address, account, chainId, provider])

    return contract
}
