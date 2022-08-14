import { Box, Button, Flex, Select, Spinner, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { RPS } from '../../abis/RPS'
import { Move, Moves, setGameData, setIsFetching, setIsLoading, useGame } from '../../contexts/GameContext'
import useContract from '../../hooks/useContract'
import { getGameData } from '../../utils'
import { Card, CardHeader } from '../Card'
import SelectMove from '../SelectMove/SelectMove'

export default function Play() {
    const {
        state: { isFetching, game },
        dispatch,
    } = useGame()
    const { stake, address } = game
    const contract = useContract({ abi: RPS.abi, address })
    const [move, setMove] = React.useState<Move>()

    const onSubmit = useCallback(
        async (data: any) => {
            dispatch(setIsFetching(true))
            const { move } = data

            try {
                const txn = await contract.play(move, {
                    value: stake,
                })
                await txn.wait()
            } catch (err) {
                console.error('Error during play() transaction:', err)
            } finally {
                dispatch(setIsFetching(false))

                try {
                    dispatch(setIsLoading(true))
                    dispatch(setGameData(await getGameData(contract)))
                } finally {
                    dispatch(setIsLoading(false))
                }
            }
        },
        [contract, dispatch, stake]
    )

    return (
        <Card>
            <CardHeader title="Choose Your Move" />
            <Box p={5}>
                <Flex w="full" direction="column" alignItems="center" gap={2}>
                    {!isFetching ? (
                        <SelectMove
                            id="j1Move"
                            placeholder="Choose a move"
                            onChange={(e: any) => setMove(e.target.value)}
                        />
                    ) : (
                        <>
                            <Text>Submitting your move</Text>
                            <Spinner mb={3} />
                        </>
                    )}
                    {!isFetching && (
                        <Button
                            colorScheme="teal"
                            justifySelf="center"
                            onClick={() => onSubmit({ move })}
                            disabled={!move}
                            // isLoading={isFetching}
                        >
                            Make a Move
                        </Button>
                    )}
                </Flex>
            </Box>
        </Card>
    )
}
