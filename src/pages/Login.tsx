import React from 'react'
import { Container, Flex } from '@chakra-ui/react'
import { Card, CardHeader } from '../components/Card'
import ConnectWallet from '../components/ConnectWallet'

export default function Login() {
    return (
        <Container>
            <Card>
                <CardHeader title="Please login to use RPS" />
                <Flex direction="column" alignItems="center" justifyContent="center" px={5} py={5}>
                    <ConnectWallet />
                </Flex>
            </Card>
        </Container>
    )
}
