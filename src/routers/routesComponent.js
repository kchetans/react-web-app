import React, {Component} from "react";
import {Redirect, Route} from "react-router-dom";
import Buttons from "../pages/buttons.js";
import AppBars from "../pages/appbar.js";
import UiComponents from "../pages/uiComponents.js";
import Cards from "../pages/cards.js";
import Sliders from "../pages/sliders.js";
import DatePickers from "../pages/datepickers.js";
import Dialogs from "../pages/dialogs.js";
import Tabs from "../pages/tabs.js";
import TimePickers from "../pages/timePicker.js";
import ProgressBars from "../pages/progress.js";
import PopOvers from "../pages/popover.js";
import Lists from "../pages/lists.js";
import Menus from "../pages/menus.js";
import Icons from "../pages/icons.js";
import GridLists from "../pages/gridList.js";
import Grids from "../pages/grid.js";
import Forms from "../pages/forms.js";
import Switches from "../pages/switches.js";
import FormLayouts from "../pages/formLayouts.js";
import LineCharts from "../pages/lineCharts.js";
import BarCharts from "../pages/barCharts.js";
import AreaCharts from "../pages/areaChart.js";
import PieCharts from "../pages/pieChart.js";
import OtherCharts from "../pages/otherCharts.js";
import BootstrapTables from "../pages/bootstrapTables.js";
import UserTables from "../pages/userTables.js";
import EcommerceDashboard from "../pages/ecommerceDashboard.js";
import EcommerceProductsPage from "../pages/products.js";
import OrderReviews from "../pages/orderReview.js";
import About from "../pages/about.js";
import ServicePage from "../pages/services.js";
import Contact from "../pages/contact.js";
import BlogPage from "../pages/blog.js";
import Prices from "../pages/price.js";
import FaqPage from "../pages/faqPage.js";

import RegisterPage from "../pages/register.js";
import ForgotPasswordPage from "../pages/forgotPassword.js";
import MailConfirmPage from "../pages/mailConfirm.js";
import Page404 from "../pages/page404.js";
import PageLayoutDefault from "../pages/layoutDefault.js";
import PageLayoutBanner from "../pages/layoutBanner.js";

import {isLoggedIn} from "../AuthService.js";

import PostJob from "../pages/wx_postjob.js";
import MyjobsPage from "../components/_recruiter/myjobs/myjobs.jsx";
import JobATSPage from "../components/_recruiter/myjobs/job-ats.jsx";
import ChatsPage from "../components/_common/chats/chats.jsx";
import PeopleSearchPage from "../components/_recruiter/people/people.jsx";
import EmployerProfilePage from "../components/_recruiter/employer-profile/profilepage.jsx";
import SettingsPage from "../components/settings/settings.jsx";
import FAQPage from "../components/faq/faq.jsx";
import LoginPage from "../components/_common/loginpage.jsx";
import InsightsPage from "../components/_common/insights/main";
import JobsPage from "../components/_admin/jobs/jobsPage";
import CompanyProfilePage from "../components/_recruiter/company-profile/CompanyProfilePage";
import withTracker from "../analytics/withTracker";
import PublicJobs from "../components/public-jobs/PublicJobs";
import ParentCompoent from "../components/test/ParentCompoent";

class RoutesComponent extends Component {

  render() {
    const PrivateRoute = ({component: Component, ...rest}) => (
      <Route {...rest} render={props => (
        isLoggedIn() ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/login'
          }}/>
        )
      )}/>
    );

    return (
      <div>
        <Route exact path="/login" component={withTracker(LoginPage)}/>
        <PrivateRoute exact path="/" component={withTracker(PostJob)}/>
        <PrivateRoute exact path="/postjob" component={withTracker(PostJob)}/>
        <PrivateRoute exact path="/myjobs" component={withTracker(MyjobsPage)}/>
        <PrivateRoute exact path="/jobats" component={withTracker(JobATSPage)}/>
        <PrivateRoute exact path="/chats" component={withTracker(ChatsPage)}/>
        <PrivateRoute exact path="/people" component={withTracker(PeopleSearchPage)}/>
        <PrivateRoute exact path="/empprofile" component={withTracker(EmployerProfilePage)}/>
        <PrivateRoute exact path="/company-profile" component={withTracker(CompanyProfilePage)}/>

        <PrivateRoute exact path="/settings" component={SettingsPage}/>
        <PrivateRoute exact path="/faq" component={withTracker(FAQPage)}/>
        <PrivateRoute exact path="/insights" component={withTracker(InsightsPage)}/>
        <Route exact path="/admin/jobs" component={withTracker(JobsPage)}/>


        <Route exact path="/jobs/:job_slug" component={withTracker(PublicJobs)}/>
        <Route exact path="/test" component={withTracker(ParentCompoent)}/>


        <Route path="/ui-kit/buttons" component={Buttons}/>
        <Route path="/ui-kit/appbars" component={AppBars}/>
        <Route path="/ui-kit/ui-components" component={UiComponents}/>
        <Route path="/ui-kit/cards" component={Cards}/>
        <Route path="/ui-kit/sliders" component={Sliders}/>
        <Route path="/ui-kit/datepickers" component={DatePickers}/>
        <Route path="/ui-kit/timepickers" component={TimePickers}/>
        <Route path="/ui-kit/dialogs" component={Dialogs}/>
        <Route path="/ui-kit/tabs" component={Tabs}/>
        <Route path="/ui-kit/progress" component={ProgressBars}/>
        <Route path="/ui-kit/popovers" component={PopOvers}/>
        <Route path="/ui-kit/lists" component={Lists}/>
        <Route path="/ui-kit/menus" component={Menus}/>
        <Route path="/ui-kit/icons" component={Icons}/>
        <Route path="/ui-kit/gridlists" component={GridLists}/>
        <Route path="/ui-kit/grids" component={Grids}/>
        <Route path="/forms/basic-forms" component={Forms}/>
        <Route path="/forms/switches" component={Switches}/>
        <Route path="/forms/form-layouts" component={FormLayouts}/>
        <Route path="/charts/line-charts" component={LineCharts}/>
        <Route path="/charts/bar-charts" component={BarCharts}/>
        <Route path="/charts/area-charts" component={AreaCharts}/>
        <Route path="/charts/pie-charts" component={PieCharts}/>
        <Route path="/charts/other-charts" component={OtherCharts}/>
        <Route path="/table/bootstrap-tables" component={BootstrapTables}/>
        <Route path="/table/user-tables" component={UserTables}/>
        <Route path="/ecommerce/dashboard" component={EcommerceDashboard}/>
        <Route path="/ecommerce/products" component={EcommerceProductsPage}/>
        <Route path="/ecommerce/order-review" component={OrderReviews}/>
        <Route path="/pages/about" component={About}/>
        <Route path="/pages/services" component={ServicePage}/>
        <Route path="/pages/contact" component={Contact}/>
        <Route path="/pages/blog" component={BlogPage}/>
        <Route path="/pages/pricing-table" component={Prices}/>
        <Route path="/pages/faq" component={FaqPage}/>
        <Route path="/other-pages/login" component={LoginPage}/>
        <Route path="/other-pages/register" component={RegisterPage}/>
        <Route path="/other-pages/forgot-password" component={ForgotPasswordPage}/>
        <Route path="/other-pages/mail-confirmation" component={MailConfirmPage}/>
        <Route path="/other-pages/404" component={Page404}/>
        <Route path="/page-layout/default" component={PageLayoutDefault}/>
        <Route path="/page-layout/banner" component={PageLayoutBanner}/>
      </div>
    );
  }
}

export default RoutesComponent;
