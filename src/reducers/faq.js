import cloneDeep from "lodash/cloneDeep";

const initial_state = {
  faqs: []
};

export default (state = initial_state, action) => {
  const nextState = cloneDeep(state);
  const payload = action.payload;
  switch (action.type) {
    case "faqs":
      return {...state, faqs: payload};
    default:
      return nextState;
  }
};
