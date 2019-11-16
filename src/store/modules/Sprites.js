import { createReducer } from 'reduxsauce';

export const Types = {
  ADD: 'sprites/ADD',
};

export const INITIAL_STATE = {};

export const Creators = {
  addSprite: sprite => ({
    type: Types.ADD,
    payload: sprite,
  }),
};

export const onAdd = (state = INITIAL_STATE, { payload: { name, ...props } }) => ({
  ...state,
  [name]: {
    name,
    ...props,
  },
});

export const HANDLERS = {
  [Types.ADD]: onAdd,
};

export default createReducer(INITIAL_STATE, HANDLERS);
