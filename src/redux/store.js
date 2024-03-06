import { configureStore } from '@reduxjs/toolkit';
import testReduce from './slice/testSlice';

export const store = configureStore({
  reducer: {
    test: testReduce,
  },
});
