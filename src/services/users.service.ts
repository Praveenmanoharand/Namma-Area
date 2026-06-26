// Backwards-compatibility wrapper routing to modular services
export { 
  getCurrentUser, 
  login, 
  register, 
  logout,
  googleSignIn
} from './auth.service';

export { 
  createUserProfile, 
  getUserProfile, 
  updateUserProfile, 
  initUsersListener 
} from './user.service';
