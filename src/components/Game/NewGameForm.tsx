import React, { useMemo } from 'react'
import {
    Button,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Tag,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet'
import { isAddress } from '@ethersproject/address'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled from 'styled-components'
import { Move } from '../../contexts/GameContext'
import { isAddressEquals, useGetPlayerBalance } from '../../utils'
import SelectMove from '../SelectMove/SelectMove'
import { chakra } from '@chakra-ui/react'
import { FaEthereum } from 'react-icons/fa'

export interface NewGameData {
    j1Move: Move
    j2Address: string
    stake: number
}

interface Props {
    onClick?: (data: NewGameData) => void
}

const RoundedJazzicon = styled(Jazzicon)`
    border-radius: 50%;
    padding: 4px;
`

export default function NewGameForm({ onClick }: Props) {
    const { account } = useWeb3Wallet()
    const [newGameData, setNewGameData] = React.useState<NewGameData>({
        j1Move: 0,
        j2Address: '',
        stake: 0,
    })
    const balance = useGetPlayerBalance()

    const validatej2Address = useMemo(() => {
        if (newGameData.j2Address === account) {
            return false
        }
        return true
    }, [newGameData.j2Address, account])

    const validateEthersBalance = useMemo(() => {
        if (newGameData.stake > balance) {
            return false
        }
        return true
    }, [newGameData.stake])

    if (!account) return <></>

    return (
        <Flex alignItems="center" justifyContent="center" direction="column" gap={4}>
            <Flex w="full" direction="column" gap={2}>
                <chakra.label fontWeight="medium" htmlFor="j1Move">
                    ✍️ Your move
                </chakra.label>
                <SelectMove
                    id="j1Move"
                    value={newGameData.j1Move}
                    placeholder="Choose a move"
                    onChange={(e) => setNewGameData({ ...newGameData, j1Move: e.target.value as any })}
                />
            </Flex>
            <Flex w="full" direction="column" gap={2}>
                <chakra.label
                    color={
                        isAddressEquals(newGameData.j2Address, account) ||
                        (!!newGameData.j2Address && !isAddress(newGameData.j2Address))
                            ? 'red.500'
                            : useColorModeValue('black', 'white')
                    }
                    fontWeight="medium"
                    htmlFor="j2Address"
                >
                    👱 Player 2 address
                </chakra.label>
                <InputGroup id="j2Address">
                    {isAddress(newGameData.j2Address) && (
                        <InputLeftElement
                            children={<RoundedJazzicon seed={jsNumberForAddress(newGameData.j2Address)} />}
                        />
                    )}
                    <Input
                        fontWeight="bold"
                        value={newGameData.j2Address}
                        type="text"
                        isInvalid={
                            isAddressEquals(newGameData.j2Address, account) ||
                            (!!newGameData.j2Address && !isAddress(newGameData.j2Address))
                        }
                        placeholder="Choose a player"
                        onChange={(e) =>
                            setNewGameData({
                                ...newGameData,
                                j2Address: e.currentTarget.value,
                            })
                        }
                    />
                </InputGroup>
                {isAddressEquals(newGameData.j2Address, account) && (
                    <Text fontSize="xs" color="red.500">
                        You can't play against yourself
                    </Text>
                )}
                {!!newGameData.j2Address && !isAddress(newGameData.j2Address) && (
                    <Text fontSize="xs" color="red.500">
                        Please enter a correct wallet address
                    </Text>
                )}
            </Flex>
            <Flex w="full" direction="column" gap={2}>
                <chakra.label
                    color={!validateEthersBalance ? 'red.500' : useColorModeValue('black', 'white')}
                    fontWeight="medium"
                    htmlFor="j2Address"
                >
                    💰 Stake
                </chakra.label>
                <InputGroup>
                    <Input
                        fontWeight="bold"
                        value={newGameData.stake}
                        type="number"
                        placeholder="Choose a stake"
                        isInvalid={!validateEthersBalance}
                        onChange={(e) => setNewGameData({ ...newGameData, stake: Number(e.currentTarget.value) })}
                        isTruncated
                        pr={32}
                    />
                    <InputRightElement
                        w="fit-content"
                        children={
                            <Flex>
                                <Button
                                    onClick={() => setNewGameData({ ...newGameData, stake: balance })}
                                    variant="link"
                                    fontWeight="bold"
                                    mr={2}
                                    _hover={{
                                        underline: 'none',
                                    }}
                                    bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.900')}
                                    disabled={newGameData.stake === balance}
                                >
                                    MAX
                                </Button>
                                <Tag w="full" as="div" px={3} fontWeight="bold">
                                    <Flex w="auto" justify="flex-start" alignItems="center" gap={1}>
                                        <FaEthereum /> ETH
                                    </Flex>
                                </Tag>
                            </Flex>
                        }
                        mr={3}
                    />
                </InputGroup>
                {!validateEthersBalance && (
                    <Text fontSize="xs" color="red.500">
                        Your balance is too low
                    </Text>
                )}
            </Flex>
            <Button
                colorScheme="teal"
                variant="solid"
                isDisabled={
                    !newGameData.j2Address ||
                    !validatej2Address ||
                    !newGameData.stake ||
                    !newGameData.j1Move ||
                    !validateEthersBalance
                }
                onClick={() => onClick && onClick(newGameData)}
            >
                Create game
            </Button>
        </Flex>
    )
}
