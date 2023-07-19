// The types of actions that you can dispatch to modify the state of the store
export const ActionTypes = {
  SHOW_SIDE_MENU: 'SHOW_SIDE_MENU',
  TOGGLE_SIDE_MENU: 'TOGGLE_SIDE_MENU',
};

// Helper functions to dispatch actions, optionally with payloads
export const mapActionCreators = {
  showSideMenu: (show) => {
    return { type: ActionTypes.SHOW_SIDE_MENU, payload: { show } };
  },
  toggleSideMenu: () => {
    return { type: ActionTypes.TOGGLE_SIDE_MENU };
  },
};

// Initial state of the store
const initialState = {
  sideMenuVisible: false,
};

// Function to handle actions and update the state of the store.
// Notes:
// - The reducer must return a new state object. It must never modify
//   the state object. State objects should be treated as immutable.
// - We set \`state\` to our \`initialState\` by default. Redux will
//   call reducer() with no state on startup, and we are expected to
//   return the initial state of the app in this case.
export const mapReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.SHOW_SIDE_MENU: {
      return {
        ...state,
        sideMenuVisible: payload.show,
      };
    }
    case ActionTypes.TOGGLE_SIDE_MENU: {
      return {
        ...state,
        sideMenuVisible: !state.sideMenuVisible,
      };
    }
  }

  return state;
};
