import {SliceCaseReducers, configureStore, createSlice} from '@reduxjs/toolkit';
import {PetOwner, PetSitter, User} from '../types/user';

const userSlice = createSlice<User, SliceCaseReducers<User>>({
  name: 'userSlice',
  initialState: {
    position: 0,
  },
  reducers: {
    setUser(_, action) {
      return action.payload;
    },
  },
});

const petOwnerSlice = createSlice<PetOwner, SliceCaseReducers<PetOwner>>({
  name: 'petOwnerSlice',
  initialState: {
    userId: '',
    pets: [],
    desiredDatesToPetSit: [],
    preferences: [],
  },
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    changePets(state, action) {
      state.pets = action.payload;
    },
    changePreferences(state, action) {
      state.preferences = action.payload;
    },
    changeDesiredDatesToPetSit(state, action) {
      state.desiredDatesToPetSit = action.payload;
    },
  },
});

const petSitterSlice = createSlice<PetSitter, SliceCaseReducers<PetSitter>>({
  name: 'petSitterSlice',
  initialState: {
    userId: '',
    preferedPets: [],
    availableTime: [],
    preferences: [],
  },
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    changePreferedPets(state, action) {
      state.preferedPets = action.payload;
    },
    changePreferences(state, action) {
      state.preferences = action.payload;
    },
    changeDesiredDatesToPetSit(state, action) {
      state.availableTime = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    petOwner: petOwnerSlice.reducer,
    petSitter: petSitterSlice.reducer,
  },
});

export const userActions = userSlice.actions;
export const petSitterActions = petSitterSlice.actions;
export const petOwnerActions = petOwnerSlice.actions;

export default store;
