import React, { useCallback } from 'react'
import { Move, setGameData, setIsFetching, setIsLoading, useGame } from '../../contexts/GameContext'
import useContract from '../../hooks/useContract'
import { RPS } from '../../abis/RPS'
import { getGameData } from '../../utils'
import { Card, CardHeader } from '../Card'
import { Button, Flex, Input, InputGroup, Spinner, Text, useToast } from '@chakra-ui/react'
import SelectMove from '../SelectMove/SelectMove'
import { BigNumber, isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'

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
        async (data: { move?: Move; salt?: any }) => {
            dispatch(setIsFetching(true))
            const { move, salt } = data

            if (!isBigNumberish(salt)) toast({ title: 'Error with salt, verify what you entered' })

            try {
                const txn = await contract.solve(move, salt)
                await txn.wait()
            } catch (e) {
                console.log(e)
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

                    if (result === 'Player 1') {
                        toast({
                            title: '🤑 You win!',
                            status: 'success',
                            description: `A total of ${game.stake.toNumber() * 2} ETH`,
                        })
                    } else if (result === 'Player 2') {
                        toast({ title: 'You lose! Try again 👊', status: 'error' })
                    } else {
                        toast({ title: "It's a tie!", status: 'info' })
                    }

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
                {isFetching ? (
                    <Flex direction="column" alignItems="center">
                        <Text mb={3}>Fetching results</Text>
                        <Spinner mb={3} />
                    </Flex>
                ) : (
                    <>
                        <Flex w="full" direction="column" gap={2}>
                            <label htmlFor="j1Move">First move</label>
                            <SelectMove
                                id="j1Move"
                                value={move}
                                placeholder="Your first move"
                                onChange={(e) => setMove(Number(e.target.value))}
                            />
                        </Flex>
                        <Flex w="full" direction="column" gap={2}>
                            <label htmlFor="j1Move">Salt</label>
                            <InputGroup>
                                <Input
                                    fontWeight="bold"
                                    placeholder="Your salt"
                                    onChange={(e) => setSalt(e.currentTarget.value)}
                                />
                            </InputGroup>
                        </Flex>
                        <Button
                            colorScheme="teal"
                            type="submit"
                            onClick={() => onSubmit({ move, salt: salt })}
                            disabled={!move || !salt}
                        >
                            Reveal Your Move
                        </Button>
                    </>
                )}
            </Flex>
        </Card>
    )
}
