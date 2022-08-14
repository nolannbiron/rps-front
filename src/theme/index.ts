// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const colors = {
    border: {
        card: '#6C6969',
    },
}
const styles = {
    global: (props: any) => ({
        body: {
            color: mode('gray.900', 'whiteAlpha.900')(props),
            bg: mode('whiteAlpha.900', 'blackAlpha.900')(props),
        },
    }),
    Tooltip: {
        borderRadius: '100px',
    },
}

const theme = extendTheme({
    useSystemColorMode: true,
    styles,
    colors,
})

export default theme
