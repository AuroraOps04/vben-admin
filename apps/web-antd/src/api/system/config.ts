import { requestClient } from '../request';

const baseApi = '/sys_config';

export const getConfigApi = (key: string) => {
  return requestClient.get<API.Config>(`${baseApi}/${key}`);
};

export const createConfigApi = (data: API.Config) => {
  return requestClient.post(`${baseApi}`, data);
};

export const updateConfigApi = (data: API.Config) => {
  return requestClient.put(`${baseApi}/${data.key}`, data);
};
