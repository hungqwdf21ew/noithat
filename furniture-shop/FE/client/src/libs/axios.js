import axios from 'axios';
import { getApiBaseUrl } from '../helpers/api.helper';

const instance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000
});

export default instance;
