import { ethers } from 'ethers'
import { useState, useEffect, useMemo } from 'react'
import { Contract } from 'ethers'
import { useWeb3React } from '@web3-react/core'

export type ContractInfo = { abi: any; address: string }

export default function useContract(contractInfo: ContractInfo) {
    const { provider, chainId, account } = useWeb3React()

    const contractAddress = contractInfo.address

    const { abi } = contractInfo

    const [contract, setContract] = useState<Contract>(
        new ethers.Contract(contractAddress, abi, provider?.getSigner(account))
    )

    useEffect(() => {
        setContract(new Contract(contractAddress, abi, provider?.getSigner(account)))
    }, [contractAddress, account, chainId, provider])

    return contract
}
