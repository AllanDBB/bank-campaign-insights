import User from '../models/User.js';
import bcrypt from "bcryptjs";

class UserDAO {
  //create user (register)
  async createUser(userData) {
    try {
      // Chequear email unico
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        return {
          success: false,
          error: 'Email already exists'
        };
      }

      // password hasheada
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new User({
        ...userData,
        username: userData.email, 
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

  // get user by id (obtener perfil)
  async getUserById(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      if (typeof userId !== 'string' ||
          userId.length !== 24 ||
          !/^[a-fA-F0-9]{24}$/.test(userId)) {
        return {
          success: false,
          error: 'Invalid user ID format'
        };
      }

      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // find by email (login)
  async findByEmail(email) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all users (exclude password)
  async getAllUsers() {
    try {
      const users = await User.find({}).select('-password');
      return {
        success: true,
        users
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update user role
  async updateUserRole(userId, role) {
    try {
      if (!userId || !role) {
        return {
          success: false,
          error: 'User ID and role are required'
        };
      }

      if (!['ejecutivo', 'gerente'].includes(role)) {
        return {
          success: false,
          error: 'Invalid role. Must be ejecutivo or gerente'
        };
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select('-password');

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      if (typeof userId !== 'string' ||
          userId.length !== 24 ||
          !/^[a-fA-F0-9]{24}$/.test(userId)) {
        return {
          success: false,
          error: 'Invalid user ID format'
        };
      }

      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User deleted successfully',
        user
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
