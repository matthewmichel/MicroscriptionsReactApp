import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContentText, DialogContent, DialogActions, Button, Modal, TextField } from '@material-ui/core';
import { thisExpression } from '@babel/types';
import './App.css';
import { classes } from 'istanbul-lib-coverage';
import axios from 'axios'
import { SketchPicker, CompactPicker } from 'react-color'
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import queryString from 'query-string'

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

var modalStyle = {
    top: `0%`,
    left: `0%`,
    transform: `translate(0%, 0%)`,
}

class DetailedUserMicroscriptionDialog extends React.Component {

    constructor(props) {

        const { cookies } = props;

        super(props);
        this.state = {
            redirectUrl: '',
            userId: null,
            show: false,
            authToken: null,
        };
    }

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    componentWillMount() {
        this.setState({ show: this.props.showDialog });

        if (this.props.redirectURL != null) {
            this.state.redirectUrl = this.props.redirectURL;
        } else {
            const values = queryString.parse(this.props.location.search);
            console.log('redirect = ' + values.redirecturl);
            this.setState({ redirectUrl: values.redirecturl });
        }
    }

    componentDidMount() {
        const { cookies } = this.props;

        console.log('id key ' +  cookies.get('mcrscrpur'));
        console.log('ax key ' +  cookies.get('mcrscrpax'));

        if (cookies.get('mcrscrpur') != null && cookies.get('mcrscrpax') != null) {
            //console.log('keys found. ' + cookies.get('mcrscrpur') + ' ' + cookies.get('mcrscrpax'))

            axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/microscriptionvalidation/updatetoken?userid=` + cookies.get('mcrscrpur') + `&token=` + encodeURIComponent(cookies.get('mcrscrpax')))
                .then((res) => {
                    console.log(res);
                    if (res.data == "invalid") {
                        console.log('invalid previous session token')
                    } else if (res.data == null) {
                        console.log("something went wrong...")
                    } else if (res.data != null) {
                        this.handleMcrscrpaxChange(res.data);
                        this.setState({ authToken: res.data.sessionKeyId })
                        console.log('us: ' + cookies.get('mcrscrpur') + ' | ' + 'ax: ' + cookies.get('mcrscrpax'));
                        console.log('redirecting to: ' + this.state.redirectUrl);
                        var fullRedirectUrl = this.state.redirectUrl + (this.state.redirectUrl.includes('?') ? '&mcrscrpax=' + res.data : '?mcrscrpax=' + res.data);
                        window.location.replace(fullRedirectUrl);
                    }
                })
        }
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    checkUserCredentials() {
        const { cookies } = this.props;
        axios.get(`https://uc5za0d1xe.execute-api.us-east-2.amazonaws.com/100/account/checkcredentials?un=` + document.getElementById('usernameTxt2').value + `&px=` + encodeURIComponent(document.getElementById('passwordTxt2').value))
            .then((res) => {
                console.log(res);
                if (res.data == null) {
                    document.getElementById('passwordTxt2').value = ''
                    this.setState({ userId: res.data.userId, authToken: res.data.sessionKeyId })
                } else if (res.data == "invalid") {
                    document.getElementById('passwordTxt2').value = ''
                    this.setState({ showInvalidLoginSnackbar: true });
                } else if (res.data != null) {
                    this.handleMcrscrpurChange(res.data.userId);
                    this.handleMcrscrpaxChange(res.data.sessionKeyId);
                    this.setState({ userId: res.data.userId, authToken: res.data.sessionKeyId })
                    console.log('us: ' + cookies.get('mcrscrpur') + ' | ' + 'ax: ' + cookies.get('mcrscrpax'));
                    console.log('redirecting to: ' + this.state.redirectUrl);
                    var fullRedirectUrl = this.state.redirectUrl + (this.state.redirectUrl.includes('?') ? '&mcrscrpax=' + res.data.sessionKeyId : '?mcrscrpax=' + res.data.sessionKeyId);
                    window.location.replace(fullRedirectUrl);
                }
            })

    }

    onKeyDownHandlerLogin = e => {
        if (e.keyCode === 13) {
            this.checkUserCredentials();
        }
    };

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



    render() {
        return (
            <Dialog
                open={this.state.show}
                onClose={this.handleClose}
                maxWidth={"sm"}
                fullWidth={"sm"}
                className="userMicroscriptionStyle"
                PaperProps={{
                    style: {
                        background: "white",
                        color: 'black',
                        fontFamily: 'Avenir',
                        alignItems: "center"
                    }
                }}

            >
                <DialogTitle>Login</DialogTitle>
                <DialogContentText>Login to access your Microscriptions content.</DialogContentText>
                <TextField onKeyDown={this.onKeyDownHandlerLogin} className="inputTxtField" id="usernameTxt2" label="Username" variant="outlined" /> <br /><br />
                <TextField onKeyDown={this.onKeyDownHandlerLogin} className="inputTxtField" id="passwordTxt2" label="Password" variant="outlined" type="password" onKeyUp={(refName, e) => { console.log(refName + ' | ' + e) }} />
                <DialogActions>
                    <Button onClick={this.checkUserCredentials}>Login</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withCookies(DetailedUserMicroscriptionDialog)