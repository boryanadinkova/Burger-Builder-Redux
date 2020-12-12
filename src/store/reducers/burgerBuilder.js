import * as actionTypes from "../actions/actionTypes";

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
};

const INGREDIENT_PRICES = {
  salad: 1.5,
  bacon: 1.7,
  cheese: 1.5,
  meat: 2,
  buildInProcess: false
};

const addIngredient = (state, action) => {
  return {
    ...state,
    ingredients: {
      ...state.ingredients,
      [action.ingredientName]: state.ingredients[action.ingredientName] + 1,
    },
    buildInProcess: true,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
  };
};

const removeIngredient = (state, action) => {
  return {
    ...state,
    ingredients: {
      ...state.ingredients,
      [action.ingredientName]: state.ingredients[action.ingredientName] - 1,
    },
    buildInProcess: true,
    totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
  };
};

const setIngredients = (state, action) => {
  return {
    ...state,
    ingredients: action.ingredients,
    totalPrice: 4,
    error: false,
    buildInProcess: false
  };
};

const fetchIngredientsFailed = (state, action) => {
  return {
    ...state,
    error: true,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT:
      return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS:
      return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return fetchIngredientsFailed(state, action);
    default:
      return state;
  }
};

export default reducer;
