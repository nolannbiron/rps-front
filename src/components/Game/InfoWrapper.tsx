import { Code, Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { FaRegCopy } from 'react-icons/fa'
import { useToast } from '@chakra-ui/react'

interface Props {
    title: string | React.ReactNode
    content: string
    important?: boolean
    winner?: boolean
}

export default function InfoWrapper({ title, content, important, winner }: Props): JSX.Element {
    const [showCopy, setShowCopy] = useState(false)

    const toast = useToast({
        title: `${title} copied to clipboard.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
        id: content,
    })

    const copyToClipboard = (): void => {
        navigator.clipboard.writeText(content)
        if (!toast.isActive(content)) toast()
    }

    return (
        <Flex direction="column">
            <Text fontSize="lg" fontWeight="medium" textAlign="center" mb={3}>
                {title}
            </Text>
            <Code
                onMouseEnter={() => setShowCopy(true)}
                onMouseLeave={() => setShowCopy(false)}
                colorScheme={important ? 'red' : winner ? 'whatsapp' : 'teal'}
                p={6}
                cursor="pointer"
                onClick={copyToClipboard}
                borderRadius={8}
                position="relative"
            >
                <Text isTruncated fontSize="md" fontWeight="bold" textAlign="center">
                    {content}
                </Text>
                {showCopy && <FaRegCopy size={15} style={{ position: 'absolute', top: 10, right: 10 }} />}
            </Code>
        </Flex>
    )
}
