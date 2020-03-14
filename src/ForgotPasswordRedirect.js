import React, { Component } from 'react';
import { DialogContentText, emphasize, DialogActions, Grid, InputAdornment, IconButton } from '@material-ui/core';
import { Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import queryString from 'query-string'
import uuidv4 from 'uuid/v4'
import { Container, Row, Col } from 'react-grid-system';

class ForgotPasswordRedirect extends Component {
    componentDidMount() {
        console.log('redirecting to forgot password page.')
    }

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            showRegistrationPassword1: false,
            showRegistrationPassword2: false,
            showNonMatchingPasswordsError: false,
            showTooShortPasswordError: false,
            showExpiredTimestampError: false,
            showAlreadyCompleteError: false,
        };
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    render() {
        return (
            <Dialog open={this.state.show} onClose={this.handleClose}>
                <div>
                    <Grid container direction="row" justify="center">
                        <Grid item>
                            <h1>Reset your Password</h1>
                        </Grid>
                        <Grid item style={{ alignItems: "center" }}>
                            <TextField
                                id="passwordResetValue"
                                className="RegistrationField"
                                type={this.state.showRegistrationPassword1 ? 'text' : 'password'}
                                label="New Password"
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
                            /><br /><br />
                            <TextField
                                id="passwordResetValueAgain"
                                className="RegistrationField"
                                type={this.state.showRegistrationPassword2 ? 'text' : 'password'}
                                label="Repeat New Password"
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
                            {this.state.showNonMatchingPasswordsError ? <p style={{ color: 'red' }}>Passwords do not match.</p> : <div></div>}
                            {this.state.showTooShortPasswordError ? <p style={{ color: 'red' }}>Password needs to be at least 8 characters long.</p> : <div></div>}
                            <Button
                                style={{
                                    background: "linear-gradient(90deg, #E15392, #349CDE)",
                                    paddingLeft: '3em',
                                    paddingRight: '3em',
                                    color: 'white',
                                    marginBottom: '30px'

                                }}
                                onClick={() => {
                                    if(document.getElementById('passwordResetValue').value == document.getElementById('passwordResetValueAgain').value) {
                                        this.setState({ showNonMatchingPasswordsError: false });
                                        var newPassword = document.getElementById('passwordResetValue').value
                                        if(newPassword.length >= 8) {
                                            this.setState({ showTooShortPasswordError: false });
                                            // Send token and new password to lambda function
                                            const values = queryString.parse(this.props.location.search);
                                            const fpid = values.key
                                            axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/user/updatepassword?fpid=` + fpid + `&x=` + newPassword, {})
                                            .then(res => {
                                                console.log(res);
                                                if(res.data == 'success') {
                                                    this.setState({ show: false, showExpiredTimestampError: false });
                                                    this.props.setAppScreen('Login');
                                                } else if(res.data == 'expired timestamp') {
                                                    this.setState({ showExpiredTimestampError: true })
                                                } else if(res.data == 'fpid already complete') {
                                                    this.setState({ showAlreadyCompleteError: true });
                                                }
                                            })

                                        } else {
                                            this.setState({ showTooShortPasswordError: true });
                                        }
                                    } else {
                                        this.setState({ showNonMatchingPasswordsError: true });
                                    }
                                }}
                                ><p style={{ fontFamily: 'Avenir' }}>Reset Password</p></Button>
                                {this.state.showExpiredTimestampError ? <p style={{ color: 'red', padding: '25px' }}>Click the link again to reset your password. You have a limited amount of time change your password from when you click the 'Forgot my Password' button.</p> : <div></div>}
                                {this.state.showAlreadyCompleteError ? <p style={{ color: 'red', padding: '25px' }}>It looks like you already changed your password. Try clicking the 'Forgot my Password' button if you need to change it again.</p> : <div></div>}
                                {this.state.showExpiredTimestampError || this.state.showAlreadyCompleteError ? <div style={{ padding: '25px' }}><TextField id="forgotPasswordEmail" label="email" type="text" /><br /><br /><Button onClick={() => {
                                    axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/user/forgotmypassword?em=` + document.getElementById('forgotPasswordEmail').value, {})
                                    .then(res => {
                                        if(res.data == 'success'){
                                            this.setState({ show: false });
                                        }
                                    })
                                }}>Forgot my Password</Button></div> : <div></div>}
                        </Grid>
                    </Grid>
                </div>
            </Dialog>
        )
    }
}

export default ForgotPasswordRedirect