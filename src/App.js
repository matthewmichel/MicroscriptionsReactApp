import React, { Component } from 'react';
import './App.css';
import logo from './microscriptionsLogo_AllWhite.png';
import normalLogo from './logo_04.png';
import dualiPhoneImage from './mockup-featuring-two-overlapping-iphones-xs-max-and-a-solid-color-backdrop-251-el.png'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { Grid, Paper, Icon, InputAdornment, IconButton, Divider, Card, CardContent, Snackbar, Tooltip, DialogActions, Backdrop, Checkbox } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { DialogContentText, emphasize, Slider } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DetailedUserMicroscriptionDialog from './DetailedUserMicroscriptionDialog'
import LoginRedirectDialog from './LoginRedirectDialog';
import MainMenu from './MainMenu'
import AddNewMicroscriptionDialog from './AddNewMicroscriptionDialog'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import CookieConsent from 'react-cookie-consent';
import myFirstMicroscriptionQR from './MyFirstQRCode.png';
import StripeCheckout from 'react-stripe-checkout';
import CircularSlider from '@fseehawer/react-circular-slider';
import { Container, Row, Col } from 'react-grid-system';
import { ScaleLoader } from 'react-spinners';
import { Chart } from '@bit/primefaces.primereact.chart';
import validator from 'email-validator';
import ForgotPasswordRedirect from './ForgotPasswordRedirect';
import queryString from 'query-string'
import ReactGA from 'react-ga';
// ICONS
import { MonetizationOnIcon, Email, Person, Lock, Visibility, VisibilityOff, AccountCircle, CropFree, Devices, ArrowForward, LineStyle, Block, FlashOnOutlined, AddToQueue, AttachMoney } from '@material-ui/icons';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import NewUserMicroscriptionDialog from './NewUserMicroscriptionDialog'
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

class App extends React.Component {

  // --------------------------------------------------------------------------------------------------------------
  //                                                STATE VARIABLES
  // --------------------------------------------------------------------------------------------------------------
  constructor(props) {
    super(props);

    const { cookies } = props;

    this.state = {
      userId: null,
      authToken: null,
      userData: null,
      loggedIn: false,
      userMicroscriptionList: [],
      userOneTimePurchasesList: [],
      developerMicroscriptionList: [],
      selectedMicroscription: null,
      showUserDetailedMicroscriptionModal: false,
      showDeveloperDetailedMicroscriptionModal: false,
      showLogInPage: false,
      appCurrentScreen: 'Random',
      isDeveloper: false,
      developerRevenue: -7.77,
      weeklyDeveloperRevenue: -7.77,
      monthlyDeveloperRevenue: -7.77,
      dailyDeveloperRevenue: -7.77,
      showNewMicroscriptionDialog: false, // This controls the dialog box that pops up when a creator wants to add a new microscription
      showNewMicroscriptionDialogAfterLogin: false,
      addNewMicroscriptionId: null,
      showNewUserMicroscriptionDialog: false, // This controls the dialog box that pops up when a user logs in after visitng a link that leads to a microscription
      mcrscrpur: cookies.get('mcrscrpur') || 'invalid',
      mcrscrpax: cookies.get('mcrscrpax') || 'invalid',
      sliderPaymentAmount: 5,
      showRegistrationPassword1: false,
      showRegistrationPassword2: false,
      currentpi: '',
      piready: false,
      stripe: null,
      showExpiredSessionSnackbar: false,
      showUnsubscribeConfirmation: false,
      unsubscribeMicroscription: null,
      showInvalidLoginSnackbar: false,
      loading: false,
      registrationTaCChecked: false,
      registrationUsernameInUse: false,
      registrationInvalidPasswords: false,
      registrationInvalidEmail: false,
      showForgotPasswordEmailField: false,
      showForgotPasswordSuccessfulEmailSend: false,
      updateToCreatorInvalidEmailError: false,
      updateToCreatorInvalidFieldsError: false,
      registrationEmailValid: false,
      registrationFieldsIncomplete: false,
      registrationEmailInUse: false,
    };
  }

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  // --------------------------------------------------------------------------------------------------------------
  //                                                  WEB REQUESTS
  // --------------------------------------------------------------------------------------------------------------
  getUserInformation(userId) {
    axios.get(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/getuserdetailsbyuserid?userid=` + userId + `&token=` + this.state.authToken)
      .then((res) => {
        if (res.data == null) {
        } else if (res.data != null) {
          this.setState({ userData: res.data, loading: false })
          this.getUserMicroscriptionList(this.state.userId);
          if (this.state.userData.isDeveloper == true) {
            this.setState({ isDeveloper: true })
            this.getDeveloperMicroscriptionList(this.state.userId)
            this.getDeveloperRevenue(this.state.userId, "-1")
            this.getDeveloperRevenue(this.state.userId, "1")
            this.getDeveloperRevenue(this.state.userId, "7")
            this.getDeveloperRevenue(this.state.userId, "30")
          }

          if (this.state.showNewMicroscriptionDialogAfterLogin) {
            this.setState({ showNewUserMicroscriptionDialog: true })
          }


          ReactGA.event({
            category: "Successful Sign In",
            action: "A user successfully signed in.",
          });

        }
      })
  }

  getUserMicroscriptionList(userId) {
    this.setState({ loading: true });
    axios.get(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/getmicroscriptionbyuserid?userid=` + userId + `&token=` + this.state.authToken)
      .then((res) => {
        if (res.data == null) {
          console.log('invalid request. potentially bad userId')
        } else if (res.data != null) {
          console.log(res.data);
          var microscriptionList = [];
          var oneTimePurchasesList = [];
          res.data.forEach(microscription => {
            if (microscription.billingCycle != 0) {
              microscriptionList.push(microscription);
            } else if (microscription.billingCycle == 0) {
              oneTimePurchasesList.push(microscription);
            }
          })
          this.setState({ userMicroscriptionList: microscriptionList, userOneTimePurchasesList: oneTimePurchasesList, appCurrentScreen: 'MyAccount', loading: false })
        }
      })
  }

  getDeveloperMicroscriptionList(userId) {
    axios.get(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/getmicroscriptionbydeveloper?developerid=` + userId + `&token=` + this.state.authToken)
      .then((res) => {
        if (res.data == null) {
          console.log('invalid request. potentially bad userId')
        } else if (res.data != null) {
          console.log(res.data);
          this.setState({ developerMicroscriptionList: res.data })
        }
      })
  }

  getDeveloperRevenue(developerId, timeframe) {
    axios.get(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/mcrscrpdevdata/getrevenuewithinxdaysbydeveloperid?developerid=` + developerId + `&timeinterval=` + timeframe + `&token=` + this.state.authToken)
      .then((res) => {
        if (res.data.sum == null) {

        } else if (res.data.sum != null) {
          if (timeframe == "-1") {
            this.setState({ developerRevenue: res.data.sum })
          } else if (timeframe == "1") {
            this.setState({ dailyDeveloperRevenue: res.data.sum })
          } else if (timeframe == "7") {
            this.setState({ weeklyDeveloperRevenue: res.data.sum })
          } else if (timeframe == "30") {
            this.setState({ monthlyDeveloperRevenue: res.data.sum })
          }

          console.log('GET DEV REV: ' + res.data.sum)

        }
      })
  }

  checkUserCredentials() {

    let currentComponent = this
    this.setState({ loading: true });



    axios.get(`https://uc5za0d1xe.execute-api.us-east-2.amazonaws.com/100/account/checkcredentials?un=` + document.getElementById('usernameTxt').value + `&px=` + encodeURIComponent(document.getElementById('passwordTxt').value))
      .then((res) => {
        console.log(res);
        if (res.data == null) {
          document.getElementById('passwordTxt').value = ''
          this.setState({ userId: res.data.userId, authToken: res.data.sessionKeyId, loading: false })
        } else if (res.data == "invalid") {
          document.getElementById('passwordTxt').value = ''
          this.setState({ showInvalidLoginSnackbar: true, loading: false });
        } else if (res.data != null) {
          this.handleMcrscrpurChange(res.data.userId);
          this.handleMcrscrpaxChange(res.data.sessionKeyId);
          this.setState({ userId: res.data.userId, loggedIn: true, authToken: res.data.sessionKeyId, loading: false })
          this.getUserInformation(res.data.userId)

        }
      })

  }

  createPaymentIntent() {
    this.setState({ loading: true });
    axios.get(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/stripe/createpaymentintent?chgamt=` + ((Number(this.state.sliderPaymentAmount * 0.029 + 0.31 + this.state.sliderPaymentAmount).toFixed(2)) * 100) + `&userid=` + this.state.userId + `&token=` + this.state.authToken)
      .then((res) => {
        console.log("paymentIntent response: " + res.data);
        if (res.data == "704") {
          console.log("pi response: " + res.data);
          this.setState({ loading: false });
        } else if (res.data == "702") {
          console.log("paymentIntent response: " + res.data);
          this.setState({ loading: false });
        } else if (res.data != null) {
          this.setState({ currentpi: res.data, piready: true, loading: false });
        }
      })
  }

  // --------------------------------------------------------------------------------------------------------------
  //                                                  FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------

  logoutUser = () => {
    this.setState({ loading: true });
    console.log("logging out user.")
    this.handleMcrscrpurChange(null);
    this.handleMcrscrpaxChange(null);
    this.setState({ userData: null, userId: null, loggedIn: false, loading: false, isDeveloper: false });
  }

  UserMicroscriptionSelected = key => {
    this.setState({ selectedMicroscription: key });
  }

  handleMcrscrpurChange(name) {
    const { cookies } = this.props;

    cookies.set('mcrscrpur', name, { path: '/' });
    this.setState({ mcrscrpur: name });
  }

  handleMcrscrpaxChange(name) {
    const { cookies } = this.props;

    cookies.set('mcrscrpax', name, { path: '/' });
    this.setState({ mcrscrpax: name });
  }

  handleSnackbarLogoutClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ showExpiredSessionSnackbar: false });
  };

  handleSnackbarInvalidLoginClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ showInvalidLoginSnackbar: false });
  };

  handleUnsubscribe = () => {
    console.log("unsubscribe clicked for: " + this.props.microscription.microscriptionId);
    this.setState({ showUnsubscribeConfirmation: true });
  }

  handleConfirmUnsubscribe = () => {
    this.setState({ loading: true, showUnsubscribeConfirmation: false });
    const userid = {
      userid: this.state.userId
    }

    const mcrscrpid = {
      mcrscrpid: this.state.unsubscribeMicroscription.microscriptionId
    }

    console.log("unsubscribe confirmed");
    axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/unsubscribeuser?mcrscrpid=` + this.state.unsubscribeMicroscription.microscriptionId + `&userid=` + this.state.userId + `&token=` + this.state.authToken, {})
      .then(res => {
        console.log(res);
        console.log(res.data);
        if (res.status == 200) {
          this.setState({ showUnsubscribeConfirmation: false, loading: false });
          this.getUserMicroscriptionList(this.state.userId);
        }
      })
  }

  onKeyDownHandlerLogin = e => {
    if (e.keyCode === 13) {
      this.checkUserCredentials();
    }
  };

  onKeyDownEmailValidatorRegistration = emailElementId => {
    if (validator.validate(document.getElementById('registrationEmail').value)) {
      this.setState({ registrationEmailValid: true });
    } else {
      this.setState({ registrationEmailValid: false });
    }
  }

  handleRegistrationCheckbox = event => {
    this.setState({ registrationTaCChecked: event.target.checked });
  };

  // --------------------------------------------------------------------------------------------------------------
  //                                                  CALLBACKS
  // --------------------------------------------------------------------------------------------------------------

  userDialogClosedCallback = (isClosed, reloadUserMicroscriptionList) => {
    console.log("closing modal");
    this.setState({ showUserDetailedMicroscriptionModal: isClosed });
    if (reloadUserMicroscriptionList == true) {
      this.getUserMicroscriptionList(this.state.userId);
    }
  }

  developerDialogClosedCallback = (isClosed, reloadDeveloperMicroscriptionList) => {
    console.log("closing modal");
    this.setState({ showDeveloperDetailedMicroscriptionModal: isClosed });
    if (reloadDeveloperMicroscriptionList == true) {
      this.getDeveloperMicroscriptionList(this.state.userId);
    }
  }

  addNewMicroscriptionDialogClosedCallback = (isClosed, reloadDeveloperMicroscriptionList) => {
    console.log("closing modal");
    this.setState({ showNewMicroscriptionDialog: isClosed });
    if (reloadDeveloperMicroscriptionList == true) {
      this.getDeveloperMicroscriptionList(this.state.userId);
    }
  }

  CallbackShowLoginWindow = (showLogin) => {
    console.log("showing login window");
    this.setState({ showLogInPage: showLogin });
  }

  CallbackSetAppScreen = (screenName) => {
    console.log('setting app screen to: ' + screenName);
    this.setState({ appCurrentScreen: screenName });
  }

  CallbackChangeLoadingValue = (boolean) => {
    this.setState({ loading: boolean });
  }

  CallbackAddNewMicroscriptionId = (microscriptionId) => {
    console.log('setting addNewMicroscriptionId: ' + microscriptionId);
    this.setState({ addNewMicroscriptionId: microscriptionId });
  }

  CallbackShowNewUserMicroscriptionDialogAfterLogin = (value) => {
    console.log('setting showNewUserMicroscriptionDialogAfterLogin: ' + value);
    this.setState({ showNewMicroscriptionDialogAfterLogin: value });
  }

  CallbackAddNewUserMicroscriptionComplete = (reloadUserMicroscriptionList) => {
    if (reloadUserMicroscriptionList) {
      this.getUserMicroscriptionList(this.state.userId);
    }
  }

  componentDidMount() {
    const { cookies } = this.props;

    //console.log('id key ' +  cookies.get('mcrscrpur'));
    //console.log('ax key ' +  cookies.get('mcrscrpax'));



    if (cookies.get('mcrscrpur') != null && cookies.get('mcrscrpax') != null) {
      //console.log('keys found. ' + cookies.get('mcrscrpur') + ' ' + cookies.get('mcrscrpax'))
      axios.get(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/getuserdetailsbyuserid?userid=` + cookies.get('mcrscrpur') + `&token=` + cookies.get('mcrscrpax'))
        .then((res) => {
          if (res.data == "702") {
            console.log("702");
            this.setState({ showExpiredSessionSnackbar: true, appCurrentScreen: 'Home' });
            this.handleMcrscrpurChange(null);
            this.handleMcrscrpaxChange(null);
          } else if (res.data == "704") {
            console.log("704");
            this.handleMcrscrpurChange(null);
            this.handleMcrscrpaxChange(null);
            this.setState({ appCurrentScreen: 'Home' });
          }
          else if (res.data != null) {
            this.setState({ userData: res.data })
            this.setState({ userId: res.data.userId, loggedIn: true, authToken: cookies.get('mcrscrpax') })
            this.getUserMicroscriptionList(this.state.userId);

            ReactGA.event({
              category: "Successful Sign In",
              action: "A user successfully signed in with stored cookies."
            });

            if (this.state.userData.isDeveloper == true) {
              this.setState({ isDeveloper: true })
              this.getDeveloperMicroscriptionList(this.state.userId)
              this.getDeveloperRevenue(this.state.userId, "-1")
              this.getDeveloperRevenue(this.state.userId, "1")
              this.getDeveloperRevenue(this.state.userId, "7")
              this.getDeveloperRevenue(this.state.userId, "30")
            }

            if (this.state.showNewMicroscriptionDialogAfterLogin) {
              this.setState({ showNewUserMicroscriptionDialog: true })
            }

          }
        })
    } else {
      this.setState({ appCurrentScreen: 'Home' });
    }
  }

  onToken = (token) => {
    console.log('token id: ' + JSON.stringify(token));

    console.log('request url: ' + `https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/stripe/webchargepaymentintent?pi=` + this.state.currentpi + `&ct=` + token.id
      + `&userid=` + this.state.userId + `&token=` + this.state.authToken)

    axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/stripe/webchargepaymentintent?pi=` + this.state.currentpi + `&ct=` + token.id
      + `&userid=` + this.state.userId + `&token=` + this.state.authToken, {})
      .then(res => {
        console.log(res);
        console.log(res.data);
        if (res.data == "success") {
          this.setState({ appCurrentScreen: 'MyAccount' })
          this.getUserInformation(this.state.userId);
        }

        ReactGA.event({
          category: "Payment Successful",
          action: "Credit added to user account.",
          label: "$" + this.state.sliderPaymentAmount + " has been added to a user account. PI: " + this.currentpi,
        });
      })
  }

  // --------------------------------------------------------------------------------------------------------------
  //                                                 RENDER APP.JS
  // --------------------------------------------------------------------------------------------------------------

  render() {

    // --------------------------------------------------------------------------------------------------------------
    //                                                  DATA MODELS
    // --------------------------------------------------------------------------------------------------------------

    const developerRevenueData = {
      labels: ['Today', 'This Week', 'This Month', 'Over a Month'],
      datasets: [
        {
          data: [Number(this.state.dailyDeveloperRevenue).toFixed(2), Number(this.state.weeklyDeveloperRevenue).toFixed(2), Number(this.state.monthlyDeveloperRevenue).toFixed(2), Number(this.state.developerRevenue - this.state.monthlyDeveloperRevenue - this.state.weeklyDeveloperRevenue - this.state.dailyDeveloperRevenue).toFixed(2)],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#5bcf5f'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#5bcf5f']
        }
      ]
    };

    // GOOGLE ANALYTICS
    const trackingId = "UA-157985337-1"; // Replace with your Google Analytics tracking ID
    ReactGA.initialize(trackingId);
    ReactGA.pageview(this.state.userId == null ? "guest" : this.state.userId);
    ReactGA.set({
      userId: this.state.userId,
      // any data that is relevant to the user session
      // that you would like to track with google analytics
    })

    const userId = this.state.userId
    const userData = this.state.userData
    let welcomeText;

    if (userId == null) {
      welcomeText = 'Please log in.'
    } else if (userId != null && userData != null) {
      welcomeText = 'Welcome, ' + this.state.userData.mcrscrpUsername + '.'
    }

    const Arrow = ({ text, className }) => {
      return (
        <div
          className={className}
        >{text}</div>
      );
    };

    const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
    const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

    const { selectedMicroscription } = this.state;

    function Alert(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    var modalStyle = {
      top: `0%`,
      left: `0%`,
      transform: `translate(0%, 0%)`,
    }

    return (
      <div className="App">

        <header className="App-header">
          <Route exact path={"/microscription"} render={props => <NewUserMicroscriptionDialog {...props} loadingCallback={this.CallbackChangeLoadingValue} onCompletion={this.CallbackAddNewUserMicroscriptionComplete} userId={this.state.userId} isLoggedIn={this.state.loggedIn} setAppScreen={this.CallbackSetAppScreen} setAddNewMicroscriptionId={this.CallbackAddNewMicroscriptionId} setShowNewUserMicroscriptionDialogAfterLogin={this.CallbackShowNewUserMicroscriptionDialogAfterLogin} authToken={this.state.authToken} />} />
          <Route exact path={"/redirecturl"} render={props => <LoginRedirectDialog {...props} showDialog={true} />} />
          <Route exact path={"/passwordreset"} render={props => <ForgotPasswordRedirect {...props} setAppScreen={this.CallbackSetAppScreen} />} />
        </header>

        <CookieConsent location="bottom" buttonText="I Understand." expires={150} style={{ width: '70%', marginLeft: '15%' }} buttonStyle={{ alignContent: "center" }}>
          By using Microscriptions, you agree to let us use cookies for a better user experience.
        </CookieConsent>

        <MainMenu showLoginCallback={this.CallbackShowLoginWindow} appCurrentScreen={this.CallbackSetAppScreen} isLoggedIn={this.state.loggedIn} />

        <Snackbar open={this.state.showExpiredSessionSnackbar} autoHideDuration={10000} onClose={this.handleSnackbarLogoutClose}>
          <Alert onClose={this.handleSnackbarLogoutClose} severity="warning" style={{ color: 'black' }}>
            Logged Out - Session Expired
          </Alert>
        </Snackbar>

        <Snackbar open={this.state.showInvalidLoginSnackbar} autoHideDuration={5000} onClose={this.handleSnackbarInvalidLoginClose}>
          <Alert onClose={this.handleSnackbarInvalidLoginClose} severity="error" style={{ color: 'white' }}>
            Wrong Username or Password
          </Alert>
        </Snackbar>

        {this.state.showNewUserMicroscriptionDialog ?
          <NewUserMicroscriptionDialog loadingCallback={this.CallbackChangeLoadingValue} onCompletion={this.CallbackAddNewUserMicroscriptionComplete} userId={this.state.userId} isLoggedIn={this.state.loggedIn} microscriptionId={this.state.addNewMicroscriptionId} setAppScreen={this.CallbackSetAppScreen} setAddNewMicroscriptionId={this.CallbackAddNewMicroscriptionId} setShowNewUserMicroscriptionDialogAfterLogin={this.CallbackShowNewUserMicroscriptionDialogAfterLogin} authToken={this.state.authToken} />
          :
          <div></div>
        }

        <Dialog open={this.state.showUnsubscribeConfirmation}
          onClose={this.handleModalClose}
        >
          <div style={modalStyle} className="ModalUnsubscribeConfirmationStyle">
            <h3>Unsubscribe?</h3>
            <p>Are you sure you want to unsubscribe from {this.state.unsubscribeMicroscription != null ? this.state.unsubscribeMicroscription.microscriptionName : ''}?</p>
            <DialogActions>
              <Button onClick={this.handleConfirmUnsubscribe}>Yes</Button>
              <Button onClick={this.handleModalClose}>Cancel</Button>
            </DialogActions>

          </div>
        </Dialog>

        <Backdrop open={this.state.loading} onClick={() => { }} style={{ zIndex: '100', color: '#fff' }}>
          <ScaleLoader
            size={150}
            color={"#349CDE"}
            loading={this.state.loading}
          />
        </Backdrop>

        {/* IF APPCURRENTSCREEN == MyAccount */}
        {this.state.appCurrentScreen == 'MyAccount' ?
          <body className="App-Body">
            <div>
              <Grid container direction="row" justify="center" >
                <Grid item style={{ fontFamily: 'Avenir' }}>
                  <Grid containter direction="column" style={{ borderRightStyle: 'solid', borderRightWidth: '1px', padding: '1em', alignContent: "0px auto" }}>
                    <Grid item>
                      <Grid container direction="row" style={{ margin: 'auto', width: 'auto' }}>
                        <Grid item style={{ fontSize: '24px', marginTop: '9px' }}>¢</Grid>
                        <Grid item style={{ fontSize: '35px', background: "linear-gradient(90deg, #E15392 0%, #349CDE 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{this.state.userData.mcrscrpUsername}</Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <h4>Account Credit: <Paper style={{ backgroundColor: '#DDDDDD' }}><h3>${this.state.userData.accountCredit}</h3></Paper></h4>
                    </Grid>
                    <Grid item>
                      <Button variant="contained"
                        style={{
                          background: "linear-gradient(90deg, #E15392, #349CDE)",
                          padding: '15px',
                          color: 'white'
                        }}
                        onClick={() => {
                          this.setState({ appCurrentScreen: 'AddCredit' })
                        }}>
                        Add Credit
                          </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item style={{ textAlign: 'left', paddingLeft: '1em' }}>
                  <Grid container direction="column" justify="center">
                    <Grid item style={{ textAlign: "center" }}>
                      <h2 style={{ fontFamily: 'Avenir' }}>Your Microscriptions</h2>
                    </Grid>
                    {this.state.userMicroscriptionList[0] == null ? <div style={{ textAlign: 'center' }}><p style={{ fontSize: '15px' }}>When you subscribe to different Microscriptions <br />they will start appearing here.</p>
                      <p style={{ fontSize: '20px' }}>To start adding Microscriptions:</p>
                      <p style={{ fontSize: '20px' }}>1. Scan QR Code or Click Link</p>
                      <Grid container direction="row" justify="center" alignItems="center">
                        <img src={myFirstMicroscriptionQR} />
                        <a href="/microscription?s=310db2e3-1d8f-4707-b196-94fcdeadc3fa" target="_self" style={{ textDecoration: 'none' }}>
                          <Button onClick={() => {
                            ReactGA.event({
                              category: "Initial Microscription",
                              action: "A user has subscribed to the first test microscription.",
                            });
                          }} variant="contained"
                            style={{
                              background: "linear-gradient(90deg, #E15392, #349CDE)",
                              padding: '15px',
                              color: 'white'
                            }}>Subscribe</Button>
                        </a>
                      </Grid>
                      <p style={{ fontSize: '20px' }}>2. Click 'Subscribe'</p>
                    </div> : <div></div>}
                    {console.log("value 0 " + this.state.userMicroscriptionList[0])}
                    {this.state.userMicroscriptionList != "704" ? this.state.userMicroscriptionList.map((microscription, index) => (
                      <div>
                        <Grid item xs={9} style={{ fontFamily: 'Avenir', margin: 'auto' }}>
                          <Grid container direction="row" justify="center">
                            <Grid item style={{ borderRightStyle: 'solid', borderRightWidth: '1px' }} xs={6}>
                              <Grid container direction="column" style={{ padding: '1em' }}>
                                <Grid item>
                                  <p style={{ margin: '1px' }}><strong>{microscription.microscriptionName}</strong></p>
                                </Grid>
                                <Grid item>
                                  <p style={{ margin: '1px', fontSize: '20px' }}>{microscription.microscriptionDescription}</p>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item style={{ borderRightStyle: 'solid', borderRightWidth: '1px', textAlign: "center", alignContent: "center" }} xs={4}>
                              <Grid container direction="column" style={{ padding: '1em' }}>
                                <h3 style={{ margin: '1px' }}>${((Number(microscription.microscriptionCost)))}</h3>
                                due on<br />

                                <p style={{ margin: '1px', fontSize: '20px', width: '100%' }}>{microscription.nextBillingDate}</p>
                              </Grid>
                            </Grid>
                            <Grid item xs={2}>
                              <Grid container direction="column" style={{ padding: '1em' }}>
                                <Tooltip title="Unsubscribe">
                                  <IconButton size="medium" onClick={() => {
                                    this.setState({ unsubscribeMicroscription: microscription, showUnsubscribeConfirmation: true })
                                  }}><Block /></IconButton>
                                </Tooltip>
                                <Tooltip title="Upcoming Feature">
                                  <span>
                                    <IconButton disabled size="medium"><Email /></IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Upcoming Feature">
                                  <span>
                                    <IconButton disabled size="medium"><Devices /></IconButton>
                                  </span>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Card style={{ marginBottom: '40px', background: "linear-gradient(90deg, rgba(" + microscription.primaryColorRed + "," + microscription.primaryColorGreen + "," + microscription.primaryColorBlue + ", 1), rgba(" + microscription.secondaryColorRed + "," + microscription.secondaryColorGreen + "," + microscription.secondaryColorBlue + ", 1))", maxHeigt: '7px', minHeight: '7px', height: '7px' }} >
                              <CardContent>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>

                      </div>
                      // <Grid item>
                      //   <Button onClick={() => {
                      //     this.setState({ selectedMicroscription: microscription });
                      //     this.setState({ showUserDetailedMicroscriptionModal: true });
                      //   }} style={{ margin: '1em', fontFamily: 'Avenir' }}>
                      //     <Paper style={{ paddingLeft: '1em', paddingRight: '1em', paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                      //       <Grid containter direction="column" justify="space-between">
                      //         <Grid container direction="row" alignContent="space-between" alignItems="stretch" >
                      //           <Grid item style={{ paddingRight: '1em' }}>
                      //             <h3>{microscription.microscriptionName}</h3>
                      //           </Grid>
                      //           <Grid item><p>{microscription.microscriptionCost}</p></Grid>
                      //         </Grid>
                      //       </Grid>
                      //     </Paper>
                      //   </Button>
                      // </Grid>
                    )) : <div></div>}

                    {this.state.userOneTimePurchasesList.length > 0 ? <Grid item style={{ textAlign: "center" }}>
                      <h2 style={{ fontFamily: 'Avenir' }}>Your One Time Purchases</h2>
                    </Grid> : <div></div>}

                    {this.state.userMicroscriptionList != "704" ? this.state.userOneTimePurchasesList.map((microscription, index) => (
                      <div>
                        <Grid item xs={9} style={{ fontFamily: 'Avenir', margin: 'auto' }}>
                          <Grid container direction="row" justify="center">
                            <Grid item style={{ borderRightStyle: 'solid', borderRightWidth: '1px' }} xs={6}>
                              <Grid container direction="column" style={{ padding: '1em' }}>
                                <Grid item>
                                  <p style={{ margin: '1px' }}><strong>{microscription.microscriptionName}</strong></p>
                                </Grid>
                                <Grid item>
                                  <p style={{ margin: '1px', fontSize: '20px' }}>{microscription.microscriptionDescription}</p>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item style={{ borderRightStyle: 'solid', borderRightWidth: '1px', textAlign: "center", alignContent: "center" }} xs={4}>
                              <Grid container direction="column" justify="center" style={{ padding: '1em' }}>
                                <h3 style={{ margin: '1px' }}>${((Number(microscription.microscriptionCost)))}</h3>
                              </Grid>
                            </Grid>
                            <Grid item xs={2}>
                              <Grid container direction="column" style={{ padding: '1em' }}>
                                <Tooltip title="Upcoming Feature">
                                  <span>
                                    <IconButton disabled size="medium"><Email /></IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Upcoming Feature">
                                  <span>
                                    <IconButton disabled size="medium"><Devices /></IconButton>
                                  </span>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Card style={{ marginBottom: '40px', background: "linear-gradient(90deg, rgba(" + microscription.primaryColorRed + "," + microscription.primaryColorGreen + "," + microscription.primaryColorBlue + ", 1), rgba(" + microscription.secondaryColorRed + "," + microscription.secondaryColorGreen + "," + microscription.secondaryColorBlue + ", 1))", maxHeigt: '7px', minHeight: '7px', height: '7px' }} >
                              <CardContent>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>


                      </div>
                      // <Grid item>
                      //   <Button onClick={() => {
                      //     this.setState({ selectedMicroscription: microscription });
                      //     this.setState({ showUserDetailedMicroscriptionModal: true });
                      //   }} style={{ margin: '1em', fontFamily: 'Avenir' }}>
                      //     <Paper style={{ paddingLeft: '1em', paddingRight: '1em', paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                      //       <Grid containter direction="column" justify="space-between">
                      //         <Grid container direction="row" alignContent="space-between" alignItems="stretch" >
                      //           <Grid item style={{ paddingRight: '1em' }}>
                      //             <h3>{microscription.microscriptionName}</h3>
                      //           </Grid>
                      //           <Grid item><p>{microscription.microscriptionCost}</p></Grid>
                      //         </Grid>
                      //       </Grid>
                      //     </Paper>
                      //   </Button>
                      // </Grid>
                    )) : <div></div>}


                    {this.state.showUserDetailedMicroscriptionModal == true ? (<DetailedUserMicroscriptionDialog microscription={this.state.selectedMicroscription} userId={this.state.userId} dialogClosed={this.userDialogClosedCallback} isDeveloperModal={false} authToken={this.state.authToken} />) : (<div></div>)}

                  </Grid>
                </Grid>
              </Grid>

              {/* <div className="userMicroscriptionList" style={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap' }}>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >

                </Grid>
                <div className="BottomPadding"></div>
              </div> */}
            </div>
          </body>
          : this.state.appCurrentScreen == 'Login' ?
            // IF CURRENTSCREEN == Login
            <div className="HomePageBackground">
              <Paper style={{ width: '75%', padding: '2em', backgroundColor: 'rgb(255,255,255,85%)', margin: 'auto' }}>
                <Grid container direction="column" justify="center">
                  <Grid item>
                    <img src={normalLogo} className="App-Logo" alt="logo" style={{ paddingBottom: '2em' }} />
                  </Grid>
                  <Grid item>
                    <h3 style={{ padding: '1em' }}>{this.state.loggedIn ? '' : 'Log In'}</h3>
                  </Grid>
                  <Grid item>
                    {this.state.userId == null ? (<TextField onKeyDown={this.onKeyDownHandlerLogin} className="inputTxtField" id="usernameTxt" label="Username" variant="outlined" />) : (<div></div>)} <br /><br />
                    {this.state.userId == null ? (<TextField onKeyDown={this.onKeyDownHandlerLogin} className="inputTxtField" id="passwordTxt" label="Password" variant="outlined" type="password" onKeyUp={(refName, e) => { console.log(refName + ' | ' + e) }} />) : (<div></div>)} <br /><br />
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" autofocus onClick={() => {
                      console.log(this.state.loggedIn)
                      if (this.state.loggedIn == true) {
                        this.logoutUser()
                      } else if (this.state.loggedIn == false) {
                        this.checkUserCredentials()
                      }
                    }}>
                      {this.state.userData == null ? ('Log In') : ('Log Out')}
                    </Button>
                    <br /><br />
                    {!this.state.loggedIn ? <Button variant="outlined" onClick={() => { this.setState({ appCurrentScreen: 'Register' }) }}>Don't have an account? Register here.</Button> : <div></div>}
                  </Grid>
                  <br /><br />
                  <Grid item>
                    {this.state.showForgotPasswordEmailField ? <div><TextField id="forgotPasswordEmail" label="Email Address" /><br /></div> : <div></div>}
                    {!this.state.loggedIn ? <Button onClick={() => {
                      if (this.state.showForgotPasswordEmailField) {
                        axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/user/forgotmypassword?em=` + document.getElementById('forgotPasswordEmail').value, {})
                          .then(res => {
                            if (res.data == 'success') {
                              this.setState({ showForgotPasswordSuccessfulEmailSend: true, showForgotPasswordEmailField: false });
                            }
                          })
                      } else {
                        this.setState({ showForgotPasswordEmailField: true });
                      }
                    }}>{this.state.showForgotPasswordEmailField ? 'Request Password Reset' : 'Forgot my Password'}</Button> : <div></div>}
                    {this.state.showForgotPasswordSuccessfulEmailSend ? <p style={{ color: 'red' }} >An email has been sent to reset your password.</p> : <div></div>}
                  </Grid>
                </Grid>
              </Paper>
            </div>

            : this.state.appCurrentScreen == 'Home' ?
              // IF CURRENTSCREEN == Home
              <div >
                <Grid container style={{ alignItems: 'center', margin: 'auto' }} className="GradientBackground" justify="center">
                  <Grid item>
                    <img src={logo} className="App-Logo" alt="logo" />
                    <h2 className="TaglineStyle">
                      Simple. Micro. Subscriptions.
              </h2>

                    <Button onClick={() => {
                      this.setState({ appCurrentScreen: 'Login' })
                    }} style={{ fontFamily: 'Avenir', color: 'white', marginRight: '3em' }}>
                      <p>Log In</p>
                    </Button>
                    <Button onClick={() => {
                      this.setState({ appCurrentScreen: 'Register' })
                    }} style={{ fontFamily: 'Avenir', backgroundColor: 'white' }}>
                      <p style={{ background: "linear-gradient(90deg, #E15392 0%, #349CDE 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Register</p>
                    </Button>

                  </Grid>
                  <Grid item>
                    <img src={dualiPhoneImage} style={{ width: '90vh', height: "auto" }} />
                  </Grid>
                </Grid>
                <Grid container justify="center" direction="column" className="GradientBackground">
                  <Grid item>
                    <h3 style={{ fontFamily: 'Avenir', color: 'white' }}>Support your favorite products and content by Microscribing.</h3>
                    <p style={{ fontFamily: 'Avenir', color: 'white' }}>Microscriptions are extremely small subscriptions that allow product developers and content creators to start earning revenue from what they've created.</p>
                    <p style={{ fontFamily: 'Avenir', color: 'white' }}>This revenue helps deliver <u>better</u> products to <strong>you</strong>, the end user.</p>
                  </Grid>
                  <Grid item>
                    <Grid container direction="row" style={{ color: 'white', paddingTop: '3em', paddingLeft: '5em', paddingRight: '5em' }} alignItems="baseline" justify="space-between">
                      <Grid item style={{ padding: "2em" }}>
                        <CropFree />
                        <br />
                        <h3>Scan Code or</h3>
                        <h3>Click Link</h3>
                      </Grid>
                      <Grid item>
                        <br />
                        <h2><ArrowForward /></h2>
                      </Grid>
                      <Grid item style={{ padding: "2em" }}>
                        <Devices />
                        <br />
                        <h3>Confirm Microscription on</h3>
                        <h3>iOS or Web</h3>
                      </Grid>
                      <Grid item>
                        <br />
                        <h2><ArrowForward /></h2>
                      </Grid>
                      <Grid item style={{ padding: "2em" }}>
                        <LineStyle />
                        <br />
                        <h3>Enjoy Your Content now</h3>
                        <h3>Better Than Ever</h3>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

              </div>

              : this.state.appCurrentScreen == 'Creator' && this.state.isDeveloper == true ?
                // IF CURRENTSCREEN == Creator && User is a creator
                <div>
                  <h1 className="BottomPadding" style={{ fontFamily: 'Avenir' }}>Creator Portal</h1>

                  <br />

                  <Grid container direction="column" style={{ padding: '35px' }}>
                    <Grid item>
                      <Grid container direction="row" justify="center">
                        <Grid item>
                          <Paper style={{ padding: '15px', backgroundColor: '#DDDDDD', width: 'auto', height: 'auto', margin: '30px', alignItems: 'center' }}>
                            <Grid container direction="column">
                              <Grid item>Revenue</Grid>
                              <Grid item>
                                {Number(this.state.developerRevenue) == 0.00 ? <h4 style={{ width: '400px' }}>Your Revenue Data will show up here<br />when your users start subscribing.</h4> :
                                  <div style={{ width: 400 }}>
                                    <Chart type='doughnut' data={developerRevenueData} />
                                  </div>
                                }
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                        <Grid item>
                          <Paper style={{ padding: '15px', backgroundColor: '#DDDDDD', width: 'auto', height: 'auto', margin: '30px', alignItems: 'center' }}>
                            <Grid container direction="column">
                              <Grid item>Lifetime Earnings</Grid>
                              <Grid item>
                                <div style={{ width: 400 }}>
                                  <h1>${this.state.developerRevenue}</h1>
                                </div>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" style={{
                        background: "linear-gradient(90deg, #E15392, #349CDE)",
                        padding: '30px',
                        color: 'white',
                        margin: '4em',
                      }}
                        onClick={() => {
                          console.log('Add new microscription clicked.');
                          this.setState({ showNewMicroscriptionDialog: true })
                        }}>
                        Add New Microscription
                          </Button>
                    </Grid>
                  </Grid>

                  <Grid container direction="row" style={{ marginBottom: '50px' }} justify="center">
                    <Grid item style={{ borderRightStyle: 'solid', borderRightWidth: '1px' }}>
                      <div className="userMicroscriptionList" style={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap' }}>
                        <Grid container
                          direction="row"
                          justify="center"
                          alignItems="center">

                          <br /><br />
                          {this.state.developerMicroscriptionList.map((microscription, index) => (
                            <Button onClick={() => {
                              this.setState({ selectedMicroscription: microscription });
                              this.setState({ showDeveloperDetailedMicroscriptionModal: true });
                              console.log(this.state.selectedMicroscription)
                            }} style={{ margin: '1em', fontFamily: 'Avenir' }}>
                              <Paper style={{ paddingLeft: '1em', paddingRight: '1em', paddingTop: '0.5em', paddingBottom: '0.5em', background: "linear-gradient(90deg, rgba(" + microscription.primaryColorRed + "," + microscription.primaryColorGreen + "," + microscription.primaryColorBlue + ", 1), rgba(" + microscription.secondaryColorRed + "," + microscription.secondaryColorGreen + "," + microscription.secondaryColorBlue + ", 1))" }}>
                                <Grid containter direction="column">
                                  <Grid container direction="row" alignContent="space-between" alignItems="stretch" >
                                    <Grid item style={{ paddingRight: '1em' }}>
                                      <h3>{microscription.microscriptionName}</h3>
                                    </Grid>
                                    <Grid item><p>{microscription.microscriptionCost}</p></Grid>
                                  </Grid>
                                  <Grid container direction="row">
                                    <Grid item style={{ paddingRight: '1em' }}>
                                      <p>User Count: <strong>xx</strong></p>
                                    </Grid>
                                    <Grid item>
                                      <p>Monthly Revenue: <strong>$x.xx</strong></p>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Paper>
                            </Button>
                          ))}
                          {this.state.showDeveloperDetailedMicroscriptionModal == true ? (<DetailedUserMicroscriptionDialog microscription={this.state.selectedMicroscription} userId={this.state.userId} dialogClosed={this.developerDialogClosedCallback} isDeveloperModal={true} authToken={this.state.authToken} />) : (<div></div>)}
                        </Grid>
                        <br />
                        {this.state.showNewMicroscriptionDialog == true ? (<AddNewMicroscriptionDialog userId={this.state.userId} dialogClosed={this.addNewMicroscriptionDialogClosedCallback} authToken={this.state.authToken} />) : (<div></div>)}
                        <br />
                        <br />
                      </div>
                    </Grid>
                    <Grid item>
                      <Grid container direction="column">
                        <Grid item>
                          <h1>Creator FAQ</h1>
                          <p style={{}}>Welcome to your Creator Portal. Here you can create and edit your Microscriptions. This is also where you adjust settings and view analytics. Please use the contact support button below to email us if you have any issues. </p>
                        </Grid>
                      </Grid>
                    </Grid>

                  </Grid>

                </div>

                : this.state.appCurrentScreen == 'Creator' && this.state.isDeveloper == false ?
                  // IF CURRENTSCREEN == Login && User is not a creator
                  <div style={{ fontFamily: 'Avenir', color: 'white' }} className="GradientBackground">
                    <h1>Become a Microscriptions Creator!</h1>
                    <h3>Build your own Microscriptions, and find new ways for your business to generate revenue.</h3>
                    <br />
                    <p>Creating Microscriptions is super simple, and you can start generating revenue immediatley.</p>
                    <Grid container direction="row" style={{ color: 'white', paddingTop: '3em', paddingLeft: '5em', paddingRight: '5em' }} alignItems="baseline" justify="center">
                      <Grid item style={{ padding: "2em" }}>
                        <AddToQueue />
                        <br />
                        <h3>Step 1</h3>
                        <h3>Create Microscription</h3>
                      </Grid>
                      <Grid item>
                        <br />
                        <h2><ArrowForward /></h2>
                      </Grid>
                      <Grid item style={{ padding: "2em" }}>
                        <Devices />
                        <br />
                        <h3>Step 2</h3>
                        <h3>Link your content to your Microscriptions.</h3>
                      </Grid>
                      <Grid item>
                        <br />
                        <h2><ArrowForward /></h2>
                      </Grid>
                      <Grid item style={{ padding: "2em" }}>
                        <AttachMoney />
                        <br />
                        <h3>Step 3</h3>
                        <h3>Generate revenue!</h3>
                      </Grid>
                    </Grid>
                    <br /><br />
                    {this.state.loggedIn ?
                      <div>
                        <Paper style={{ width: '75%', padding: '2em', backgroundColor: 'rgb(255,255,255,85%)', margin: 'auto' }}>
                          <h3>Fill out the form below to become a Creator.</h3>
                          <br />
                          <TextField variant="outlined" label="PayPal Email Address" id="creatorRegistrationPayPalEmail" placeholder="youremail@example.com" style={{ width: '300px' }} />
                          <br /><p>This email should be connected to a PayPal account. This is how we will pay out the revenue you generate from your Microscriptions.</p>
                          <br />{this.state.updateToCreatorInvalidEmailError ? <p style={{ color: 'red' }}>Please enter a valid email address.</p> : <div></div>}<br />
                          <TextField variant="outlined" label="Content Name" id="creatorContentName" style={{ width: '300px' }} />
                          <br /><p>This is the name of your business, blog, company, etc.</p>
                          <br /><br />
                          <TextField variant="outlined" label="Content Location" id="creatorContentLocation" placeholder="example.com" style={{ width: '300px' }} />
                          <br /><p>This is where your user's find your content/products. This is typically a website.</p>
                          <br /><br />
                          <TextField variant="outlined" label="Brief Description" id="creatorBriefDescription" multiline rows="4" style={{ width: '300px' }} />
                          <br /><p>Give us a brief description of what kind of content you create or what kind of products you sell. We'd love to get to know a little more about you.</p>
                          <br />{this.state.updateToCreatorInvalidFieldsError ? <p style={{ color: 'red' }}>Please fill out all the fields.</p> : <div></div>}<br />
                          <Button onClick={() => {
                            if (validator.validate(document.getElementById('creatorRegistrationPayPalEmail').value)) {
                              if (document.getElementById('creatorContentName').value != '' && document.getElementById('creatorContentLocation').value != '' && document.getElementById('creatorBriefDescription').value != '') {
                                this.setState({ loading: true });
                                axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/user/updatetocreator?uid=` + this.state.userId + `&token=` + this.state.authToken + `&ppe=` + document.getElementById('creatorRegistrationPayPalEmail').value + `&cn=` + document.getElementById('creatorContentName').value + `&cl=` + document.getElementById('creatorContentLocation').value + `&bd=` + document.getElementById('creatorBriefDescription').value, {})
                                  .then(res => {
                                    this.setState({ loading: false });
                                    if (res.data == 'success') {
                                      this.getUserInformation(this.state.userId);
                                      this.setState({ appCurrentScreen: 'Creator' });
                                    }
                                  })
                              } else {
                                // all fields must be filled out
                                this.setState({ updateToCreatorInvalidFieldsError: true });
                              }
                            } else {
                              // invalid email address
                              this.setState({ updateToCreatorInvalidEmailError: true });
                            }
                          }}
                            style={{
                              background: "linear-gradient(90deg, #E15392, #349CDE)",
                              paddingLeft: '3em',
                              paddingRight: '3em',
                              color: 'white',

                            }}><p style={{ fontFamily: 'Avenir' }}>Become a Creator!</p></Button>
                        </Paper>
                      </div>
                      : <Button variant="outlined" onClick={() => {
                        this.setState({ appCurrentScreen: 'Login' })
                      }} style={{ fontFamily: 'Avenir', color: 'white', margin: 'auto, 0px' }}>
                        <h2>Log in to get started.</h2>
                      </Button>}
                  </div>

                  : this.state.appCurrentScreen == 'AddCredit' ?
                    // IF CURRENTSCREEN == AddCredit
                    <div style={{ width: '80%', marginLeft: '10%' }}>
                      <Button onClick={() => {
                        this.setState({ appCurrentScreen: 'MyAccount' });
                      }}
                        style={{
                          padding: '15px'
                        }} className="BottomPadding"> &lt; Back </Button>
                      <h1 className="BottomPadding"><p className="BasicAvenir">Add Credit</p></h1>
                      <p className="BasicAvenir">Step 1. Choose Amount.</p>

                      <br /><br />


                      <CircularSlider
                        onChange={value => { this.setState({ sliderPaymentAmount: value }); }}
                        label="Amount"
                        progressColorFrom="#E15392"
                        progressColorTo="#349CDE"
                        prependToValue="$"
                        min={1}
                        max={25}
                        className="PaymentSliderStyle"
                      />

                      <br /><br /><br /><br />

                      <Button onClick={() => {
                        this.setState({ appCurrentScreen: 'AddPayment' });
                        this.createPaymentIntent();
                        ReactGA.event({
                          category: "Payment Amount Chosen",
                          action: "User has chosen a payment amount and gone to add payment page.",
                        });
                      }}
                        style={{
                          background: "linear-gradient(90deg, #E15392, #349CDE)",
                          padding: '10px',
                          color: 'white',
                          marginBottom: '50px'
                        }}><p style={{ fontFamily: 'Avenir' }}>Continue to Payment</p></Button>

                    </div>

                    : this.state.appCurrentScreen == 'AddPayment' ?
                      // IF CURRENTSCREEN == 'AddPayment'
                      <div className="largePadding">
                        <Button onClick={() => {
                          this.setState({ appCurrentScreen: 'AddCredit' });
                        }}
                          style={{
                            padding: '15px'
                          }} className="BottomPadding"> &lt; Back </Button>

                        <Container>
                          <Row >
                            <Col sm={12} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                              <h3>Order Summary</h3>
                            </Col>
                          </Row>
                          <Row sm={12}>
                            <Col sm={8} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                              <em>Account Credit</em>
                            </Col>
                            <Col sm={4} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                              ${this.state.sliderPaymentAmount + '.00'}
                            </Col>
                          </Row>
                          <Row sm={12}>
                            <Col sm={8} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                              <em>Processing Fee</em>
                            </Col>
                            <Col sm={4} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                              ${(Number(this.state.sliderPaymentAmount * 0.029 + 0.31).toFixed(2))}
                            </Col>
                          </Row>
                          <Row >
                            <Col sm={8} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                              Total
                                </Col>
                            <Col sm={4} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                              <strong>${(Number(this.state.sliderPaymentAmount * 0.029 + 0.31 + this.state.sliderPaymentAmount).toFixed(2))}</strong>
                            </Col>
                          </Row>


                        </Container>

                        {/* <StripeProvider apiKey="pk_test_XUvbDOvpZQJmDwFJl5ZzvSeb00rzEbdSV0" >
                          <CheckoutForm />
                        </StripeProvider> */}

                        <br /><br />

                        <Grid container direction="column">
                          <Grid item>

                          </Grid>
                        </Grid>

                        <StripeCheckout
                          token={this.onToken}
                          stripeKey="pk_live_50bzcAmuhbHdCPNMbxaYyz4D00PNlV4H7U"
                          amount={(this.state.sliderPaymentAmount * 0.029 + 0.31 + this.state.sliderPaymentAmount).toFixed(2) * 100}
                          name="Microscriptions Inc."
                          description="Account Credit"
                          currency="USD"
                          email="payments@microscriptions.com"
                          panelLabel="Pay"
                        />
                        <p style={{ fontFamilt: 'Avenir' }}>Powered by Stripe</p>

                      </div>

                      : this.state.appCurrentScreen == 'Register' ?
                        // IF CURRENTSCREEN == 'Register'
                        <div style={{ fontFamily: 'Avenir' }}>
                          <Paper style={{ width: '75%', padding: '2em', backgroundColor: 'rgb(255,255,255,85%)', margin: 'auto' }}>
                            <h1>Create Your Account</h1>
                            <h4>Create your account to start subscribing to your digital content.</h4>
                            <TextField
                              id="registrationEmail"
                              className="RegistrationField"
                              label="Email"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {this.state.registrationEmailValid ? <Email style={{ color: 'green' }} /> : this.state.registrationInvalidEmail ? <Email style={{ color: 'red' }} /> : <Email />}
                                  </InputAdornment>
                                ),
                              }}
                              onKeyDown={this.onKeyDownEmailValidatorRegistration}
                            /><br />{this.state.registrationEmailInUse ? <p style={{ color: 'red' }}>This email is already being used.</p> : <div></div>}<br />
                            <TextField
                              id="registrationUsername"
                              className="RegistrationField"
                              label="Username"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircle />
                                  </InputAdornment>
                                ),
                              }}
                            />
                            {this.state.registrationUsernameInUse ? <p style={{ color: 'red' }}>This username is taken.</p> : <div></div>}
                            <br /><br />
                            <TextField
                              id="registrationFirstName"
                              className="RegistrationField"
                              label="First Name"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Person />
                                  </InputAdornment>
                                ),
                              }}
                            /><br /><br />
                            <TextField
                              id="registrationLastName"
                              label="Last Name"
                              className="RegistrationField"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Person />
                                  </InputAdornment>
                                ),
                              }}
                            /><br /><br />
                            <TextField
                              id="registrationPassword"
                              className="RegistrationField"
                              type={this.state.showRegistrationPassword1 ? 'text' : 'password'}
                              label="Password"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Lock />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton onClick={() => this.state.showRegistrationPassword1 ? this.setState({ showRegistrationPassword1: false }) : this.setState({ showRegistrationPassword1: true })}>
                                      {this.state.showRegistrationPassword1 ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <br />{this.state.registrationInvalidPasswords ? <p style={{ color: 'red' }}>Passwords must match and be at least 8 characters.</p> : <div></div>}<br />
                            <TextField
                              id="registrationPasswordAgain"
                              className="RegistrationField"
                              type={this.state.showRegistrationPassword2 ? 'text' : 'password'}
                              label="Repeat Password"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Lock />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton onClick={() => this.state.showRegistrationPassword2 ? this.setState({ showRegistrationPassword2: false }) : this.setState({ showRegistrationPassword2: true })}>
                                      {this.state.showRegistrationPassword2 ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            /><br /><br />

                            <Checkbox
                              checked={this.state.registrationTaCChecked}
                              onChange={this.handleRegistrationCheckbox}
                              value="primary" />
                            I have read and accept the <a href="http://microscriptions.com/TaC.html" target="_blank">Terms and Conditions</a>.

                            <br />{this.state.registrationFieldsIncomplete ? <p style={{ color: 'red' }}>You must fill out all the fields in the form.</p> : <div></div>}<br />

                            {this.state.registrationTaCChecked ?
                              <Button
                                onClick={() => {
                                  // Begin UI Validation
                                  var newPassword = document.getElementById('registrationPassword').value
                                  if(!validator.validate(document.getElementById('registrationEmail').value)) {
                                    this.setState({ registrationInvalidEmail: true });
                                  }
                                  if(document.getElementById('registrationFirstName').value == '' || document.getElementById('registrationLastName').value == '') {
                                    this.setState({ registrationFieldsIncomplete: true });
                                  }
                                  if(document.getElementById('registrationPassword').value == document.getElementById('registrationPasswordAgain').value || newPassword.length < 8) {
                                    this.setState({ registrationInvalidPasswords: true });
                                  }

                                  if (validator.validate(document.getElementById('registrationEmail').value) && document.getElementById('registrationUsername').value != '') {
                                    this.setState({ registrationInvalidEmail: false });
                                    // Check if username is already in use
                                    this.setState({ loading: true });
                                    axios.get('https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/user/checkusername?username=' + document.getElementById('registrationUsername').value + '&email=' + document.getElementById('registrationEmail').value, {})
                                      .then(res => {
                                        this.setState({ loading: false });
                                        console.log(res.data);
                                        if (res.data != 'usedUsername' && res.data != 'usedEmail' && res.data != 'usedUsernameEmail') {
                                          this.setState({ registrationEmailInUse: false, registrationUsernameInUse: false });
                                          if (document.getElementById('registrationPassword').value == document.getElementById('registrationPasswordAgain').value && document.getElementById('registrationPassword').value.length >= 8) {
                                            if (document.getElementById('registrationFirstName').value != '' && document.getElementById('registrationFirstName').value != '') {
                                              this.setState({ loading: true });
                                              axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/insertnewuser?email=` + document.getElementById('registrationEmail').value
                                                + `&mcrscrpusn=` + document.getElementById('registrationUsername').value
                                                + `&mcrscrppx=` + encodeURIComponent(document.getElementById('registrationPassword').value)
                                                + `&firstname=` + document.getElementById('registrationFirstName').value
                                                + `&lastname=` + document.getElementById('registrationLastName').value
                                                , {})
                                                .then(res => {
                                                  this.setState({ loading: false });
                                                  console.log(res);
                                                  console.log(res.data);
                                                  if (res.status == 200) {
                                                    this.setState({ appCurrentScreen: 'Login', registrationInvalidPasswords: false, registrationEmailInUse: false, registrationUsernameInUse: false, registrationFieldsIncomplete: false, registrationInvalidEmail: false });
                                                  }
                                                })
                                            } else {
                                              this.setState({ registrationFieldsIncomplete: true });
                                            }
                                          } else {
                                            this.setState({ registrationInvalidPasswords: true })
                                          }
                                        } else if (res.data == 'usedUsername') {
                                          this.setState({ registrationUsernameInUse: true, registrationEmailInUse: false })
                                        } else if (res.data == 'usedEmail') {
                                          this.setState({ registrationEmailInUse: true, registrationUsernameInUse: false });
                                        } else if (res.data == 'usedUsernameEmail') {
                                          this.setState({ registrationUsernameInUse: true, registrationEmailInUse: true });
                                        }
                                      })
                                  } else {
                                    this.setState({ registrationInvalidEmail: true });
                                    console.log('invalid email');
                                  }
                                }}
                                style={{
                                  background: "linear-gradient(90deg, #E15392, #349CDE)",
                                  paddingLeft: '3em',
                                  paddingRight: '3em',
                                  color: 'white'
                                }}><p style={{ fontFamily: 'Avenir' }}>Register</p></Button>
                              :
                              <Button
                                disabled
                                style={{
                                  background: "linear-gradient(90deg, #E15392, #349CDE)",
                                  paddingLeft: '3em',
                                  paddingRight: '3em',
                                  color: 'white',
                                  opacity: '60%'

                                }}><p style={{ fontFamily: 'Avenir' }}>Register</p></Button>

                            }
                          </Paper>
                        </div>

                        : this.state.appCurrentScreen == 'Contact' ?
                          // IF CURRENTSCREEN == 'Register'
                          <div style={{ fontFamily: 'Avenir', width: '80%', marginLeft: '10%' }}>
                            <h1>Contact Us</h1>

                            <p style={{ fontSize: '20px' }}>We'd love to hear from you. Feel free to reach out to us if you have questions, conerns, or bugs.</p>

                            Use the button at the bottom right of the screen to message us.
                          <br /><br />
                            Or email us at <a href="mailto:contact@microscriptions.com" target="_blank">contact@microscriptions.com</a>.
                        </div>

                          : this.state.appCurrentScreen == 'ForgotPassword' ?
                            // IF CURRENTSCREEN == 'Register'
                            <div style={{ fontFamily: 'Avenir', width: '80%', marginLeft: '10%' }}>
                              <h1>Password Reset</h1>

                              <p style={{ fontSize: '20px' }}>Please enter your email below, and we will email you a link to reset your password.</p>

                              <TextField placeholder="your-email@example.com" label="Email" id="passwordResetEmail" />
                            </div>

                            :
                            (<div></div>)

        }
      </div>
    );
  }

}

export default withCookies(App);