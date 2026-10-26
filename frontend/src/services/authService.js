import api from './api';

/**
 * Authentication Service
 * Endpoints for register, phone SMS 4-digit OTP verification, login, logout, and profile retrieval.
 */
export const authService = {
  /**
   * Register a new user account with phone number (dispatches 4-digit OTP via SMS)
   */
  async register(username, email, password, phoneNumber = '') {
    return api.post('/auth/register.php', {
      username,
      email,
      password,
      phone_number: phoneNumber,
    });
  },

  /**
   * Verify account using phone number or email and 4-digit OTP
   */
  async verifyCode(identifier, code) {
    return api.post('/auth/verify-code.php', {
      phone_number: identifier,
      email: identifier,
      code,
    });
  },

  /**
   * Resend a new random 4-digit OTP to user's phone via SMS
   */
  async resendCode(identifier) {
    return api.post('/auth/resend-code.php', {
      phone_number: identifier,
      email: identifier,
    });
  },


  /**
   * Login with user credentials
   */
  async login(usernameOrEmail, password) {
    return api.post('/auth/login.php', {
      username: usernameOrEmail,
      password,
    });
  },

  /**
   * Request password reset 4-digit code dispatched to email
   */
  async forgotPassword(emailOrUsername) {
    return api.post('/auth/forgot-password.php', {
      identifier: emailOrUsername,
      email: emailOrUsername,
      username: emailOrUsername,
    });
  },

  /**
   * Reset password with 4-digit code and new password
   */
  async resetPassword(emailOrUsername, code, password, confirmPassword) {
    return api.post('/auth/reset-password.php', {
      identifier: emailOrUsername,
      email: emailOrUsername,
      code,
      password,
      confirm_password: confirmPassword,
    });
  },

  /**
   * Invalidate current user session
   */
  async logout() {
    return api.post('/auth/logout.php', {});
  },

  /**
   * Fetch currently logged-in user profile
   */
  async getCurrentUser() {
    return api.get('/auth/me.php');
  },
};

export default authService;
