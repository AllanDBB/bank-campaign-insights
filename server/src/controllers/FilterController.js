import FilterDAO from '../daos/FilterDAO.js';

class FilterController {
  constructor() {
    this.filterDAO = new FilterDAO();
  }

  async getFilters(req, res, next) {
    try {
      const result = await this.filterDAO.getFilters();

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.filters
      });
    } catch (error) {
      console.error('Error in getFilters:', error);
      next(error);
    }
  }

  async getFilterById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Filter ID is required'
        });
      }

      const result = await this.filterDAO.getFilterById(id);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.filter
      });
    } catch (error) {
      console.error('Error in getFilterById:', error);
      next(error);
    }
  }

  async createFilter(req, res, next) {
    try {
      const { id, filterName, filters } = req.body;

      if (!id || !filterName || !filters) {
        return res.status(400).json({
          success: false,
          message: 'Filter ID, name and filters are required'
        });
      }

      const result = await this.filterDAO.createFilter({
        id,
        filterName,
        filters
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Filter created successfully',
        data: result.filter
      });
    } catch (error) {
      console.error('Error in createFilter:', error);
      next(error);
    }
  }

  async updateFilter(req, res, next) {
    try {
      const { id } = req.params;
      const { filterName, filters } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Filter ID is required'
        });
      }

      if (!filterName || !filters) {
        return res.status(400).json({
          success: false,
          message: 'Filter name and filters are required'
        });
      }

      const result = await this.filterDAO.updateFilter(id, {
        filterName,
        filters
      });

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Filter updated successfully',
        data: result.filter
      });
    } catch (error) {
      console.error('Error in updateFilter:', error);
      next(error);
    }
  }

  async deleteFilter(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Filter ID is required'
        });
      }

      const result = await this.filterDAO.deleteFilter(id);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error in deleteFilter:', error);
      next(error);
    }
  }
}

export default FilterController;
