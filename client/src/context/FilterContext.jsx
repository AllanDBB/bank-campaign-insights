import  { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

// TODO: To fetch data with this filter in your component (e.g., Table.jsx):
//
// import { useActiveFilter } from '../context/FilterContext';
// import apiClient from '../services/api';
//
// const { activeFilter } = useActiveFilter();
// const queryString = activeFilter.queryParams?.toString() || '';
// const url = queryString
//   ? `/documents?${queryString}&page=1&limit=100&sortBy=createdAt&order=desc`
//   : `/documents?page=1&limit=100&sortBy=createdAt&order=desc`;
// const response = await apiClient.get(url, {
//   headers: { 'x-user-id': import.meta.env.VITE_USER_ID }
// });
export const useActiveFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useActiveFilter must be used within FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [activeFilter, setActiveFilter] = useState({
    id: null,
    name: null,
    queryParams: null
  });

  const applyFilter = (filterId, filterName, queryParams) => {
    setActiveFilter({
      id: filterId,
      name: filterName,
      queryParams: queryParams
    });

    // Log for debugging with pagination
    const queryString = queryParams ? queryParams.toString() : '';
    const url = queryString
      ? `/documents?${queryString}&page=1&limit=100&sortBy=createdAt&order=desc`
      : `/documents?page=1&limit=100&sortBy=createdAt&order=desc`;

    console.log(`Filter Applied: "${filterName}" | URL: ${url}`);


  };

  const clearFilter = () => {
    setActiveFilter({
      id: null,
      name: null,
      queryParams: null
    });
  };

  return (
    <FilterContext.Provider value={{ activeFilter, applyFilter, clearFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
