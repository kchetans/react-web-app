import {LOGIN} from "../constants/ga";
import {fireGaEventTrack} from "./ga";

export function fireLoginEventTrack(ACTION, label = "") {
  ACTION = "" + ACTION;
  label = "" + label;
  fireGaEventTrack(LOGIN, ACTION, label);
}

export function fireEventTrack(EVENT, ACTION = "", label = "") {
  ACTION = "" + ACTION;
  label = "" + label;
  fireGaEventTrack(EVENT, ACTION, label);
}


export function fireNavigationEventTrack(EVENT, ACTION = "", label = "") {
  ACTION = "" + ACTION;
  label = "" + label;
  fireGaEventTrack(EVENT, ACTION, label);
}
