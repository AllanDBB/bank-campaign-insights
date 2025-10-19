import UserDAO from '../daos/UserDAO.js';

class UserController {
  constructor() {
    this.userDAO = new UserDAO();
  }

  async createUser(req, res, next) {
    try {
      const { name, username, lastname, password } = req.body;

      if (!name || !username || !lastname || !password) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: name, username, lastname, password'
        });
      }

      // Basic validations
      if (name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters long'
        });
      }

      if (lastname.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Last name must be at least 2 characters long'
        });
      }

      if (username.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Username must be at least 3 characters long'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      const result = await this.userDAO.createUser({
        name: name.trim(),
        username: username.trim(),
        lastname: lastname.trim(),
        password
      });

      if (result.success) {
        return res.status(201).json({
          success: true,
          message: 'User created successfully',
          data: {
            id: result.user._id,
            name: result.user.name,
            username: result.user.username,
            lastname: result.user.lastname,
            createdAt: result.user.createdAt
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      console.error('Error in createUser:', error);
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const { id } = req.params;

      const result = await this.userDAO.getUserById(id);

      if (result.success) {
        return res.status(200).json({
          success: true,
          data: {
            id: result.user._id,
            name: result.user.name,
            username: result.user.username,
            lastname: result.user.lastname,
            createdAt: result.user.createdAt
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      console.error('Error in getUser:', error);
      next(error);
    }
  }
}

export default UserController;
