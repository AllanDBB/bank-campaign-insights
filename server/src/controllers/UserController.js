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

      const result = await this.userDAO.createUser({
        name,
        username,
        lastname,
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
