import React, { Component } from 'react';
import { DialogContentText, emphasize, DialogActions, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import queryString from 'query-string'
import uuidv4 from 'uuid/v4'
import { Container, Row, Col } from 'react-grid-system';

class NewUserMicroscriptionDialog extends Component {
    componentDidMount() {
        console.log('did mount');

    }

    componentWillMount() {

        var microscriptionId = null;
        if (this.props.microscriptionId != null) {
            microscriptionId = this.props.microscriptionId;
        } else {
            const values = queryString.parse(this.props.location.search);
            console.log('s = ' + values.s);
            microscriptionId = values.s
        }

        axios.get(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/getmicroscriptionbyid?mcrscrpid=` + microscriptionId)
            .then((res) => {
                if (res.data == null) {
                    console.log('invalid mcrscrpid')
                } else if (res.data != null) {
                    //console.log(res.data);
                    this.setState({ microscription: res.data, show: true })
                }
            })

        const values = queryString.parse(this.props.location.search);
        console.log('redirect = ' + values.u);
        this.setState({ redirectUrl: values.u });
        if(values.donation == 'true') {
            console.log('donation enabled');
            this.setState({ donation: true });
        }

    }

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            microscription: null,
            isLoggedIn: this.props.isLoggedIn,
            redirectUrl: '',
            donation: false,
        };
    }

    handleClose = () => {
        this.setState({ show: false });
        console.log('logged in: ' + this.props.isLoggedIn)
    }

    handleConfirmSubscribe = () => {
        // POST REQUEST TO CREATE NEW USERMICROSCRIPTION
        this.props.loadingCallback(true);
        this.setState({ show: false });
        console.log("unsubscribe confirmed");
        axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/insertnewusermicroscription?newuuid=` + uuidv4() + `&mcrscrpid=` + this.state.microscription.microscriptionId
            + `&userid=` + this.props.userId + `&token=` + this.props.authToken, {})
            .then(res => {
                console.log("res: " + JSON.stringify(res));
                console.log(res.data);
                if (res.data == "success" && this.state.redirectUrl == '') {
                    this.setState({ show: false });
                    this.props.onCompletion(true);
                } else if (res.data == "success" && this.state.redirectUrl != '') {
                    console.log('redirecting to: ' + this.state.redirectUrl);
                    var fullRedirectUrl = this.state.redirectUrl + (this.state.redirectUrl.includes('?') ? '&mcrscrpax=' + this.props.authToken : '?mcrscrpax=' + this.props.authToken);
                    if(this.state.donation) {
                        fullRedirectUrl = fullRedirectUrl + '&donation=true'
                    }
                    window.location.replace(fullRedirectUrl);
                } else if (res.data == "alreadySubscribed" && this.state.redirectUrl != '') {
                    console.log('redirecting to: ' + this.state.redirectUrl);
                    var fullRedirectUrl = this.state.redirectUrl + (this.state.redirectUrl.includes('?') ? '&mcrscrpax=' + this.props.authToken : '?mcrscrpax=' + this.props.authToken);
                    if(this.state.donation) {
                        fullRedirectUrl = fullRedirectUrl + '&donation=true'
                    }
                    window.location.replace(fullRedirectUrl);
                }
                this.props.loadingCallback(false);
            })
    }

    ChangeAppScreen = (screenName) => {
        this.props.setAppScreen(screenName);
        this.props.setAddNewMicroscriptionId(this.state.microscription.microscriptionId);
        this.props.setShowNewUserMicroscriptionDialogAfterLogin(true);
        console.log(screenName)
        this.setState({ show: false })
    }

    render() {

        var modalStyle = {
            top: `0%`,
            left: `0%`,
            transform: `translate(0%, 0%)`,
            textAlign: 'center',
        }

        console.log(this.state.microscription);

        if (this.state.show && this.props.isLoggedIn) {

            console.log(typeof this.state.microscription.microscriptionCost);
            console.log('Number value: ' + Number(this.state.microscriptionCost));

            return (
                <Dialog open={this.state.show}
                    onClose={this.handleDeleteConfirmationClose}
                >
                    <div style={modalStyle} className="ModalUnsubscribeConfirmationStyle">
                        <h3>Microscribe to '{this.state.microscription.microscriptionName}'</h3>
                        <Container>
                            <Row sm={12}>
                                <Col sm={8} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                                    <em>{this.state.microscription.microscriptionName}</em>
                                </Col>
                                <Col sm={4} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                                    ${(Number(this.state.microscription.microscriptionCost)).toFixed(2)}
                                </Col>
                            </Row>
                            <Row >
                                <Col sm={8} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                                    Total
                                </Col>
                                <Col sm={4} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                                    <strong>${(Number(this.state.microscription.microscriptionCost)).toFixed(2)}</strong>
                                </Col>
                            </Row>
                            <Row >
                                <Col sm={12} style={{ padding: '5px', borderStyle: 'solid', borderWidth: '1px' }}>
                                    Charged every <strong>{this.state.microscription.billingCycle} days</strong>
                                </Col>
                            </Row>

                        </Container>


                        {/* MOBILE APP LINK
                        <p>- OR -</p>
                        <p><a href={"mcrsb://beta?productId=" + this.state.microscription.microscriptionId}>Open in the app</a></p> 
                        */}

                        <DialogActions>
                            <Button variant="contained"
                                style={{
                                    background: "linear-gradient(90deg, #E15392, #349CDE)",
                                    padding: '15px',
                                    color: 'white'
                                }} onClick={this.handleConfirmSubscribe}>Subscribe</Button>
                            <a href="/" target="_self" style={{ textDecoration: 'none' }}>
                                <Button variant="contained"
                                    style={{
                                        padding: '15px',
                                        color: 'black'
                                    }} onClick={this.handleClose}>Cancel</Button>
                            </a>
                        </DialogActions>
                    </div>
                </Dialog>
            )
        } else if (this.state.show && !this.props.isLoggedIn) {
            return (
                <Dialog open={this.state.show}
                    onClose={this.handleDeleteConfirmationClose}
                >
                    <div style={modalStyle} className="ModalUnsubscribeConfirmationStyle">
                        <h3>Please log in.</h3>
                        <p>Please log in to subscribe to '{this.state.microscription.microscriptionName}'</p>
                        <p>- OR -</p>
                        <p><a href={"mcrsb://beta?productId=" + this.state.microscription.microscriptionId}>Open in the app</a></p>
                        <DialogActions style={{ justifyItems: 'center' }}>
                            <Button onClick={() => this.ChangeAppScreen('Login')}>Log In</Button>
                            <Button onClick={this.handleClose}>Cancel</Button>
                        </DialogActions>

                    </div>
                </Dialog>
            )
        } else {
            return (
                <div></div>
            )
        }

    }
}

export default NewUserMicroscriptionDialog