import api from './api';

const uploadService = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // returns { success, message, data: { url, publicId } }
  },
};

export default uploadService;
