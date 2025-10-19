import User from '../models/User.js';
import bcrypt from 'bcrypt';

class UserDAO {
  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new User({
        ...userData,
        password: hashedPassword
      });

      const result = await user.save();
      return {
        success: true,
        user: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      return {
        success: true,
        user: user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default UserDAO;
