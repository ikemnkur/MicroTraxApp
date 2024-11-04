import { useState, useEffect } from 'react';
import getBaseUrl from '../utils/getBaseUrl';

const useBaseUrl = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const url = getBaseUrl();
    setBaseUrl(url);
  }, []);

  return baseUrl;
};

export default useBaseUrl;