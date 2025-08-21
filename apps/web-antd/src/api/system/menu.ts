import { requestClient } from '#/api/request';

export const createMenuApi = (data: API.Menu) => {
  return requestClient.post<API.Menu>('/menu', data);
};

export const updateMenuApi = (data: API.Menu) => {
  return requestClient.put<API.Menu>(`/menu/${data.id}`, data);
};

export const partialUpdateMenuApi = (data: Partial<API.Menu>) => {
  return requestClient.request<API.Menu>(`/menu/${data.id}`, {
    data,
    method: 'PATCH',
  });
};

export const treeMenuApi = () => {
  return requestClient.get<API.TreeMenu[]>('/menu/tree');
};

export const deleteMenuApi = (id: number) => {
  return requestClient.delete<API.TreeMenu>(`/menu/${id}`);
};
