export const SET_USER = 'SET_USER';

export const setUser = (userDetails) => ({
  type: SET_USER,
  payload: userDetails,
});
