import { FETCH_USERS, AUTH, LOGOUT, FOLLOW_USER, UNFOLLOW_USER, FETCH_USER_DATA } from '../constants/actionTypes';

const initialState = {
  fetchedUsers: [], // Make sure fetchedUsers is initialized as an array
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, fetchedUsers: action.payload };
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
      return { ...state, authData: action.payload };
    case FETCH_USER_DATA:
      return {
        ...state,
        fetchedUsers: [...state.fetchedUsers.filter((user) => user._id !== action.payload._id), action.payload],
      }; // Update fetchedUsers with the new user data without duplicating users with the same _id
    default:
      return state;
  }
};

export default userReducer;
