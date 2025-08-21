import { requestClient } from '../request';

export const listRoleApi = (params: API.RoleParams) => {
  return requestClient.get<API.PageResult<API.Role>>('/role', { params });
};

export const createRoleApi = (data: API.Role) => {
  return requestClient.post<API.Role>('/role', data);
};

export const updateRoleApi = (data: API.Role) => {
  return requestClient.put<API.Role>(`/role/${data.id}`, data);
};

export const partialUpdateRoleApi = (data: Partial<API.Role>) => {
  return requestClient.request<API.Role>(`/role/${data.id}`, {
    method: 'PATCH',
    data,
  });
};

export const removeRoleApi = (id: number) => {
  return requestClient.delete(`/role/${id}`);
};
