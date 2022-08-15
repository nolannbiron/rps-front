import { Button, Container, Flex, Text } from '@chakra-ui/react'
import { useWeb3Network } from '../../hooks/useWeb3Network'
import { Card, CardHeader } from '../Card'

export default function SwitchNetwork(): JSX.Element {
    const { chainId, switchNetwork } = useWeb3Network()

    return (
        <Container maxW="container.md">
            <Card>
                <CardHeader title="Wrong network" />
                <Flex direction="column" alignItems="center" p={5} pt={0}>
                    <Text fontWeight="bold">You're on the wrong network : {chainId}</Text>
                    <Button _hover={{ bg: 'red.400', cursor: 'pointer' }} mt={4} bg="red.600" onClick={switchNetwork}>
                        Switch to Goerli
                    </Button>
                </Flex>
            </Card>
        </Container>
    )
}
