// Load jQuery from NPM
import '@babel/polyfill';
import $ from 'jquery';
import Web3 from 'web3';
import Box from '3box';
import initializeProvider from './providers';
import { separateData } from './utils/3box';

const getWeb3Instance = ({ pk }) => new Web3(initializeProvider({ pk }));

const get3box = ({ accountAddress }) => {
  return Box.openBox(accountAddress, window.ethereum);
};

const createUsersMetadata = async ({ accountAddress, metadata }) => {
  const box = await get3box({ accountAddress });
  const { publicData, privateData } = separateData(metadata);
  const publicFields = Object.keys(publicData);
  const publicValues = Object.values(publicData);
  await box.public.setMultiple(publicFields, publicValues);

  const privateFields = Object.keys(privateData);
  const privateValues = Object.values(privateData);
  await box.private.setMultiple(privateFields, privateValues);
  console.log('3box account created!');
}

$(document).ready(() => {
  const interval = setInterval(async () => {
    console.log('PK Interval')
    if (window && window.pk) {
      const givenWeb3 = getWeb3Instance({ pk: window.pk });
      clearInterval(interval);
    }
  }, 100);

  const userInterval = setInterval(async () => {
    console.log('USER interval')
    if (window && window.user) {
      createUsersMetadata({ accountAddress: window.user.account, metadata: { ...window.user } })
      clearInterval(userInterval);
    }
  }, 100);
});

window.jQuery = $;
window.$ = $;
