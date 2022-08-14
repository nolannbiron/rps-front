import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
    (actions) =>
        new WalletConnect({
            actions,
            options: {
                rpc: { 5: 'https://goerli.infura.io/v3/5ac444b3c8014807ae1d035e482d996f' },
                qrcode: true,
                bridge: 'https://bridge.walletconnect.org',
            },
        })
)
