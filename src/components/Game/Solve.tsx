import React, { useContext, useCallback } from 'react'
import { Move, Moves, setGameData, setIsFetching, setIsLoading, useGame } from '../../contexts/GameContext'
import useContract from '../../hooks/useContract'
import { RPS } from '../../abis/RPS'
import { getGameData } from '../../utils'
import { Card, CardHeader } from '../Card'
import { Box, Button, Flex, Input, InputGroup, Select, toast, useToast } from '@chakra-ui/react'
import SelectMove from '../SelectMove/SelectMove'
import { BigNumber } from 'ethers'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'

export default function Solve() {
    const {
        state: { isFetching, game },
        dispatch,
    } = useGame()
    const [move, setMove] = React.useState<Move>()
    const [salt, setSalt] = React.useState<string>()
    const toast = useToast({
        isClosable: true,
        position: 'top-right',
        duration: 5000,
        status: 'error',
    })

    const contract = useContract({ abi: RPS.abi, address: game.address })

    const onSubmit = useCallback(
        async (data: any) => {
            dispatch(setIsFetching(true))
            const { move, salt } = data

            if (!isBigNumberish(salt)) toast({ title: 'Error with salt, verify what you entered' })

            try {
                const txn = await contract.solve(move, salt)
                await txn.wait()
            } finally {
                dispatch(setIsFetching(false))

                try {
                    dispatch(setIsLoading(true))

                    const [updatedGameData, playerOneWins, playerTwoWins] = await Promise.all([
                        getGameData(contract),
                        contract.win(move, game.j2.move),
                        contract.win(game.j2.move, move),
                    ])

                    const result = playerOneWins ? 'Player 1' : playerTwoWins ? 'Player 2' : "It's a tie"

                    updatedGameData.j1.move = Number(move) as Move
                    updatedGameData.j1.salt = salt
                    updatedGameData.result = result

                    dispatch(setGameData(updatedGameData))
                } finally {
                    dispatch(setIsLoading(false))
                }
            }
        },
        [contract, dispatch, game.j2.move]
    )

    return (
        <Card>
            <CardHeader title="Complete the game" />
            <Flex direction="column" p={5} gap={4}>
                <Flex w="full" direction="column" gap={2}>
                    <label htmlFor="j1Move">First move</label>
                    <SelectMove
                        id="j1Move"
                        value={game.j1.move}
                        placeholder="Your first move"
                        onChange={(e: any) => setMove(e.target.value)}
                    />
                </Flex>
                <Flex w="full" direction="column" gap={2}>
                    <label htmlFor="j1Move">Salt</label>
                    <InputGroup>
                        <Input
                            fontWeight="bold"
                            placeholder="Your salt"
                            onChange={(e: any) => setSalt(e.currentTarget.value)}
                        />
                    </InputGroup>
                </Flex>
                <Button
                    colorScheme="teal"
                    type="submit"
                    onClick={() => onSubmit({ move, salt })}
                    disabled={!move || !salt}
                >
                    Reveal Your Move
                </Button>
            </Flex>
        </Card>
    )
}
