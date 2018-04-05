import cloneDeep from "lodash/cloneDeep";

const initial_state = {
  my_profile: {},
  company_profile: {}
};

export default (state = initial_state, action) => {
  const nextState = cloneDeep(state);
  const payload = action.payload;
  switch (action.type) {
    case "my_profile":
      return {...state, my_profile: payload};
    case "company_profile":
      return {...state, company_profile: payload};
    default:
      return nextState;
  }
};
