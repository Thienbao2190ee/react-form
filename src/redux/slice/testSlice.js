import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const createTest = createAsyncThunk('test/create', async (data, { rejectWithValue }) => {
  const retrievedData = JSON.parse(localStorage.getItem('dataTest'));
  if (retrievedData) {
    const newData = [data, ...retrievedData];
    localStorage.setItem('dataTest', JSON.stringify(newData));
    return newData;
  } else {
    localStorage.setItem('dataTest', JSON.stringify([data]));
    return [data];
  }
});

export const getDataTest = createAsyncThunk('test/get', async (data, { rejectWithValue }) => {
  const retrievedData = JSON.parse(localStorage.getItem('dataTest'));

  return retrievedData;
});

export const checkAnswer = createAsyncThunk('test/check', async (data, { rejectWithValue }) => {
  localStorage.setItem('dataCheck', JSON.stringify(data));
  return data;
});
export const getCheckAnswer = createAsyncThunk('test/getcheck', async (data, { rejectWithValue }) => {
  const retrievedData = JSON.parse(localStorage.getItem('dataCheck'));

  return retrievedData;
});

const testSilces = createSlice({
  name: 'test',
  initialState: {
    data: [],
    checkAnswer: null,
  },
  extraReducers: (builder) => {
    //getall Action
    builder
      .addCase(createTest.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(createTest.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload;
        state.serverError = action.error.message;
      });
    builder
      .addCase(getDataTest.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getDataTest.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getDataTest.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload;
        state.serverError = action.error.message;
      });

    builder
      .addCase(checkAnswer.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(checkAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.checkAnswer = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(checkAnswer.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload;
        state.serverError = action.error.message;
      });

    builder
      .addCase(getCheckAnswer.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getCheckAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.checkAnswer = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getCheckAnswer.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload;
        state.serverError = action.error.message;
      });
  },
});

export const selectTest = (state) => state?.test;
export default testSilces.reducer;
