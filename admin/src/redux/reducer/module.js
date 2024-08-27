const { createSlice } = require('@reduxjs/toolkit');

const moduleReducer = createSlice({
    name: 'module',
    initialState: {
        sidebar: false,
        loading: false,
    },
    reducers: {
        openSidebar: (state) => {
            state.sidebar = true;
        },
        closeSidebar: (state) => {
            state.sidebar = false;
        },
        startLoading: (state) => {
            state.loading = true;
        },
        stopLoading: (state) => {
            state.loading = false;
        },
    },
});

export const { openSidebar, closeSidebar, startLoading, stopLoading } = moduleReducer.actions;

export default moduleReducer.reducer;
