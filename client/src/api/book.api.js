import axiosInstance from './axiosConfig';

export const getAllBooks = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/books', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error.response?.data || { message: 'Failed to fetch books' };
  }
};

export const getBookById = async (id) => {
  try {
    const response = await axiosInstance.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch book' };
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await axiosInstance.post('/books', bookData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create book' };
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await axiosInstance.put(`/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update book' };
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await axiosInstance.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete book' };
  }
};