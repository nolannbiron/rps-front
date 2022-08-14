import React from 'react'
import { Container, Flex, Text } from '@chakra-ui/react'
import { Card, CardHeader } from '../components/Card'
import ConnectWallet from '../components/ConnectWallet'

export default function Login() {
    return (
        <Container maxW="container.md">
            <Text fontSize="xl" fontWeight="bold" mb={1}>
                Play the Web3 version of the famous game created by Sheldon Cooper. <br />
            </Text>
            <Text fontSize="md" fontWeight="medium" mb={6}>
                Choose a move, your opponent, a stake price, and you're all set.
            </Text>
            <Card>
                <CardHeader title="Please login to use RPS" />
                <Flex direction="column" alignItems="center" justifyContent="center" px={5} py={5}>
                    <ConnectWallet />
                </Flex>
            </Card>
        </Container>
    )
}
