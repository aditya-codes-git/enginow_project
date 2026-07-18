import api from './api';

const organiserBlogService = {
  async getMyBlogs() {
    const response = await api.get('/organisers/blogs');
    return response.data.data || [];
  },

  async createBlog(data) {
    const response = await api.post('/organisers/blogs', data);
    return response.data.data;
  },

  async updateBlog(id, data) {
    const response = await api.patch(`/organisers/blogs/${id}`, data);
    return response.data.data;
  },

  async submitBlog(id) {
    const response = await api.patch(`/organisers/blogs/${id}/submit`);
    return response.data.data;
  },

  async deleteBlog(id) {
    const response = await api.delete(`/organisers/blogs/${id}`);
    return response.data;
  },
};

export default organiserBlogService;