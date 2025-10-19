import Filter from '../models/Filter.js';

class FilterDAO {
  async getFilters(userId, queryParams = {}) {
    try {
      const { id, filterName } = queryParams;
      let query = { userId };

      if (id) {
        query._id = id;
      }

      if (filterName) {
        query.filterName = new RegExp(filterName, 'i');
      }

      const filters = await Filter.find(query).sort({ createdAt: -1 });

      if (id && filters.length === 0) {
        return {
          success: false,
          error: 'Filter not found'
        };
      }

      return {
        success: true,
        filters: filters,
        count: filters.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createFilter(userId, filterData) {
    try {
      const existingFilter = await Filter.findOne({
        userId,
        filterName: filterData.filterName
      });

      if (existingFilter) {
        return {
          success: false,
          error: 'A filter with this name already exists'
        };
      }

      const filter = new Filter({
        userId,
        ...filterData
      });
      const savedFilter = await filter.save();
      return {
        success: true,
        filter: savedFilter
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          error: 'A filter with this name already exists'
        };
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateFilter(userId, filterId, filterData) {
    try {
      if (filterData.filterName) {
        const existingFilter = await Filter.findOne({
          userId,
          filterName: filterData.filterName,
          _id: { $ne: filterId }
        });

        if (existingFilter) {
          return {
            success: false,
            error: 'A filter with this name already exists'
          };
        }
      }

      const updateFields = {};
      if (filterData.filterName !== undefined) {
        updateFields.filterName = filterData.filterName;
      }
      if (filterData.filters !== undefined) {
        updateFields.filters = filterData.filters;
      }

      const updatedFilter = await Filter.findOneAndUpdate(
        { _id: filterId, userId },
        { $set: updateFields },
        {
          new: true,
          runValidators: true
        }
      );

      if (!updatedFilter) {
        return {
          success: false,
          error: 'Filter not found'
        };
      }

      return {
        success: true,
        filter: updatedFilter
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          error: 'A filter with this name already exists'
        };
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteFilter(userId, filterId) {
    try {
      const deletedFilter = await Filter.findOneAndDelete({
        _id: filterId,
        userId
      });

      if (!deletedFilter) {
        return {
          success: false,
          error: 'Filter not found'
        };
      }

      return {
        success: true,
        message: 'Filter deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default FilterDAO;
