import api from './api';

export const userService = {
    searchUsers: (query) => api.get(`/users/search?query=${query}`),
    updateDetails: (data) => api.patch('/users/update-account', data),
    deleteAccount: () => api.delete('/users/delete-account'),
};
