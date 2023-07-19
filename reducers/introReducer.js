export const types = {
  SET_NAME: 'SET_NAME',
};

export const introActionCreators = {
  setName: () => {
    return { type: types.SET_NAME };
  },
};

const initialState = {
  name: '',
};

export const introReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.SET_NAME: {
      return {
        ...state,
        name: payload,
      };
    }
  }

  return state;
};

export const introSelectors = {
  getName : (state) => state.introReducer.name,
};

