import {combineReducers} from "redux";
import headerBannerActiveStyleReducer from "./style-switcher-reducers/headerBannerActiveReducer.js";

import chatReducers from "./chatReducers.js";
import faqReducer from "./faq";
import profileReducer from "./profileReducer";
import appStateReducers from "./appStateReducers.js";

const allReducers = combineReducers({
  faq: faqReducer,
  profile: profileReducer,
  chats: chatReducers,
  appState: appStateReducers,
  // notifications: notificationReducers,
  // menu: toggleMenu,
  // tableData: tableReducers,
  // areaChartData: areaChartReducers,
  // lineChartData: lineChartReducers,
  // tinyChartData: tinyChartReducers,
  // productsTable: productTableReducers,
  // products: productsReducers,
  // teams: teamReducres,
  // services: serviceReducers,
  // blogs: blogReducers,
  // headerStyle: headerStyleReducers,
  // headerActiveStyle: headerActiveStyleReducer,
  // headerBannerStyle: headerBannerStyleReducers,
  headerBAnnerActiveStyle: headerBannerActiveStyleReducer,
  // sidebarStyle: sidebarStyleReducers,
  // sidebarActiveStyle: sidebarActiveStyleReducer
});

export default allReducers;
