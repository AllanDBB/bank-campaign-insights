import Filter from '../models/Filter.js';

class FilterDAO {
  async getFilters() {
    try {
      const filters = await Filter.find({}).sort({ createdAt: -1 });
      return {
        success: true,
        filters: filters
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getFilterById(filterId) {
    try {
      const filter = await Filter.findOne({ id: filterId });
      if (!filter) {
        return {
          success: false,
          error: 'Filter not found'
        };
      }
      return {
        success: true,
        filter: filter
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createFilter(filterData) {
    try {
      const existingFilter = await Filter.findOne({ filterName: filterData.filterName });
      if (existingFilter) {
        return {
          success: false,
          error: 'A filter with this name already exists'
        };
      }

      const filter = new Filter(filterData);
      const savedFilter = await filter.save();
      return {
        success: true,
        filter: savedFilter
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          error: 'A filter with this name or ID already exists'
        };
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateFilter(filterId, filterData) {
    try {
      const existingFilter = await Filter.findOne({
        filterName: filterData.filterName,
        id: { $ne: filterId }
      });

      if (existingFilter) {
        return {
          success: false,
          error: 'A filter with this name already exists'
        };
      }

      const updatedFilter = await Filter.findOneAndUpdate(
        { id: filterId },
        {
          filterName: filterData.filterName,
          filters: filterData.filters
        },
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

  async deleteFilter(filterId) {
    try {
      const deletedFilter = await Filter.findOneAndDelete({ id: filterId });

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
