import React from 'react'
import { Flex, Tag } from '@chakra-ui/react'
import { shortenAddress } from '.'

export const ownerTag = (address: string) => (
    <Flex direction="row" alignItems="center" gap={2}>
        {shortenAddress(address, 10)}
        <Tag>You</Tag>
    </Flex>
)
