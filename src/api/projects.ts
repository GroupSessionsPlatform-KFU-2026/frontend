import apiClient from './client';
import type { paths } from './types';

export const projectsApi = {
  getAll: async (params?: paths['/projects']['get']['parameters']['query']) => {
    return apiClient.GET('/projects', {
      params: { query: params },
    });
  },

  getById: async (projectId: number) => {
    return apiClient.GET('/projects/{project_id}', {
      params: {
        path: { project_id: projectId },
      },
    });
  },

  create: async (
    body: paths['/projects']['post']['requestBody']['content']['application/json']
  ) => {
    return apiClient.POST('/projects', { body });
  },

  update: async (
    projectId: number,
    body: paths['/projects/{project_id}']['put']['requestBody']['content']['application/json']
  ) => {
    return apiClient.PUT('/projects/{project_id}', {
      params: { path: { project_id: projectId } },
      body,
    });
  },

  archive: async (projectId: number) => {
    return apiClient.DELETE('/projects/{project_id}', {
      params: { path: { project_id: projectId } },
    });
  },

  getProjectTags: async (projectId: number) => {
    return apiClient.GET('/projects/{project_id}/tags', {
      params: { path: { project_id: projectId } },
    });
  },

  assignTag: async (
    projectId: number,
    body: paths['/projects/{project_id}/tags']['post']['requestBody']['content']['application/json']
  ) => {
    return apiClient.POST('/projects/{project_id}/tags', {
      params: { path: { project_id: projectId } },
      body,
    });
  },

  removeTag: async (projectId: number, tagId: number) => {
    return apiClient.DELETE('/projects/{project_id}/tags/{tag_id}', {
      params: {
        path: {
          project_id: projectId,
          tag_id: tagId,
        },
      },
    });
  },
};

export default projectsApi;
