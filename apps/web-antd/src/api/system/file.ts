import { requestClient } from '../request';

export const uploadFileApi = (file: File) => {
  return requestClient.upload<API.File>('/file', { file });
};
