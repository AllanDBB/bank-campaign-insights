import FilterDAO from '../daos/FilterDAO.js';

class FilterController {
  constructor() {
    this.filterDAO = new FilterDAO();
  }

  async getFilters(req, res, next) {
    try {
      const { id, filterName } = req.query;

      const result = await this.filterDAO.getFilters(req.user.id, { id, filterName });

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.filters,
        count: result.count
      });
    } catch (error) {
      console.error('Error in getFilters:', error);
      next(error);
    }
  }

  async createFilter(req, res, next) {
    try {
      const { filterName, filters } = req.body;

      if (!filterName || !filters) {
        return res.status(400).json({
          success: false,
          message: 'Filter name and filters are required'
        });
      }

      const result = await this.filterDAO.createFilter(req.user.id, {
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

      const updateData = {};
      if (filterName) updateData.filterName = filterName;
      if (filters) updateData.filters = filters;

      const result = await this.filterDAO.updateFilter(req.user.id, id, updateData);

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

      const result = await this.filterDAO.deleteFilter(req.user.id, id);

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
