import apiClient from './client';
import type { paths } from './types';
import { mockProjects } from './mocks';

const USE_MOCK = true; //пока нет бэка - true

export const projectsApi = {
  getAll: async (params?: paths['/projects']['get']['parameters']['query']) => {
    if (USE_MOCK) {
      //моки - фильтрация
      let filtered = [...mockProjects];
      if (params?.search) {
        filtered = filtered.filter((p) =>
          p.title.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      return {
        data: {
          results: filtered,
          count: filtered.length,
          page: params?.page || 1,
          page_size: params?.page_size || 10,
        },
      };
    }
    //апи-вызов
    /*
    return apiClient.GET('/projects', {
      params: { query: params },
    });
    */
  },

  getById: async (projectId: number) => {
    if (USE_MOCK) {
      const project = mockProjects.find((p) => p.id === projectId);
      return { data: project || null };
    }
    //апи-вызов
    /*
    return apiClient.GET('/projects/{project_id}', {
      params: {
        path: { project_id: projectId },
      },
    });
    */
  },

  create: async (
    body: paths['/projects']['post']['requestBody']['content']['application/json']
  ) => {
    if (USE_MOCK) {
      const newProject = {
        id: Date.now(),
        title: body.title,
        description: body.description || '',
        created_at: new Date().toISOString(),
        owner_id: 1,
      };
      mockProjects.push(newProject);
      return { data: newProject };
    }
    //апи-вызов
    /*
    return apiClient.POST('/projects', { body });
    */
  },

  update: async (
    projectId: number,
    body: paths['/projects/{project_id}']['put']['requestBody']['content']['application/json']
  ) => {
    if (USE_MOCK) {
      const index = mockProjects.findIndex((p) => p.id === projectId);
      if (index !== -1) {
        const updatedProject = {
          ...mockProjects[index],
          ...body,
          description: body.description ?? '',
        };
        mockProjects[index] = updatedProject;
        return { data: mockProjects[index] };
      }
      throw new Error('Project not found');
    }
    //апи-вызов
    /*
    return apiClient.PUT('/projects/{project_id}', {
      params: { path: { project_id: projectId } },
      body,
    });
    */
  },

  archive: async (projectId: number) => {
    if (USE_MOCK) {
      const index = mockProjects.findIndex((p) => p.id === projectId);
      if (index !== -1) {
        mockProjects[index] = { ...mockProjects[index] };
        return { data: null };
      }
      throw new Error('Project not found');
    }
    //апи-вызов
    /*
    return apiClient.DELETE('/projects/{project_id}', {
      params: { path: { project_id: projectId } },
    });
    */
  },

  getProjectTags: async (projectId: number) => {
    if (USE_MOCK) {
      //моки - пустой массив
      return { data: [] };
    }
    //апи-вызов
    /*
    return apiClient.GET('/projects/{project_id}/tags', {
      params: { path: { project_id: projectId } },
    });
    */
  },

  assignTag: async (
    projectId: number,
    body: paths['/projects/{project_id}/tags']['post']['requestBody']['content']['application/json']
  ) => {
    if (USE_MOCK) {
      //моки-создание
      return {
        data: {
          id: Date.now(),
          project_id: projectId,
          tag_id: body.tag_id,
          created_at: new Date().toISOString(),
          is_active: true,
        },
      };
    }
    //апи-вызов
    /*
    return apiClient.POST('/projects/{project_id}/tags', {
      params: { path: { project_id: projectId } },
      body,
    });
    */
  },

  removeTag: async (projectId: number, tagId: number) => {
    if (USE_MOCK) {
      //моки - успех
      return { data: null };
    }
    //апи-вызов
    /*
    return apiClient.DELETE('/projects/{project_id}/tags/{tag_id}', {
      params: {
        path: {
          project_id: projectId,
          tag_id: tagId,
        },
      },
    });
    */
  },
};

export default projectsApi;
