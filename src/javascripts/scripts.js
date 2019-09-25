// Load jQuery from NPM
import '@babel/polyfill';
import $ from 'jquery';
import Box from '3box';
import initializeProvider from './providers';
import { separateData } from './utils/3box';

const get3box = ({ accountAddress }) => {
  return Box.openBox(accountAddress, window.ethereum);
};

const createUsersMetadata = async ({ accountAddress, metadata }) => {
  initializeProvider({ pk: window.pk });
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

let once = true
$(document).ready(() => {
  const interval = setInterval(async () => {
    console.log('interval')
    if (window.user && window.pk && once) {
      once = false
      await createUsersMetadata({ accountAddress: window.user.account, metadata: { ...window.user } })
      clearInterval(interval);
    }
  }, 100);
});

window.jQuery = $;
window.$ = $;
