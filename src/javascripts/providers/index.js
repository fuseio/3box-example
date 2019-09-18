import getProvider from './zero';

const initializeProvider = ({ pk }) => {
  if (pk) {
    return getProvider({ pk });
  }
  return null;
};

export default initializeProvider;
