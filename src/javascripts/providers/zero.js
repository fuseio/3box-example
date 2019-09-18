import { fromPrivateKey, generate } from 'ethereumjs-wallet';
import WalletSubprovider from 'ethereumjs-wallet/provider-engine';
import ZeroClientProvider from 'web3-provider-engine/zero';
import { toBuffer } from 'ethereumjs-util';

export default (opts = {}) => {
  const wallet = opts.pk ? fromPrivateKey(toBuffer(opts.pk)) : generate();
  const walletProvider = new WalletSubprovider(wallet);

  const providerEngine = new ZeroClientProvider({
    rpcUrl: 'https://rpc.fusenet.io',
    ...walletProvider,
    engineParams: {
      useSkipCache: false,
    },
  });

  // TODO: The 3rd provider (BlockTracker) causing trouble. Find why.
  /* eslint no-underscore-dangle: 0 */
  providerEngine.removeProvider(providerEngine._providers[3]);
  providerEngine.networkVersion = '122';
  if (!window.ethereum) {
    window.ethereum = providerEngine;
    window.ethereum.enable = () =>
      new Promise((resolve, reject) => {
        /* eslint implicit-arrow-linebreak: ["error", "below"] */
        providerEngine.sendAsync({ method: 'eth_accounts', params: [] }, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response.result);
          }
        });
      });
  }
  return providerEngine;
};
