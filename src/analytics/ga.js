import * as ReactGA from "react-ga";
export function fireGaEventTrack(EVENT, ACTION, label) {
  ReactGA.event({
    category: EVENT,
    action: ACTION,
    label: label
  });
};
