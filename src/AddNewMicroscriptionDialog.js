import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContentText, DialogContent, DialogActions, Button, Modal, Paper } from '@material-ui/core';
import { thisExpression } from '@babel/types';
import './App.css';
import { classes } from 'istanbul-lib-coverage';
import axios from 'axios'
import { TextField } from '@material-ui/core';
import { SketchPicker, CompactPicker } from 'react-color'
import uuidv4 from 'uuid/v4'

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

class AddNewMicroscriptionDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            showNewMicroscriptionConfirmation: false,
            newMicroscriptionConfirmed: false,
            primaryColor: '#E15392',
            secondaryColor: '#349CDE',
            primaryColorRed: 225,
            primaryColorGreen: 83,
            primaryColorBlue: 146,
            secondaryColorRed: 52,
            secondaryColorGreen: 156,
            secondaryColorBlue: 222,
        };
    }

    handleClose = () => {
        this.setState({ show: false });
        this.props.dialogClosed(false, false);
    }

    handleModalClose = () => {
        this.setState({ showNewMicroscriptionConfirmation: false })
    }

    handleAddMicroscription = () => {
        this.setState({ showNewMicroscriptionConfirmation: true });
    }

    primaryColorChangeHandler = (color, event) => {
        console.log(color.rgb);
        this.setState({ primaryColorRed: color.rgb.r, primaryColorGreen: color.rgb.g, primaryColorBlue: color.rgb.b, primaryColor: color });
    }

    secondaryColorChangeHandler = (color, event) => {
        console.log(color.rgb);
        this.setState({ secondaryColorRed: color.rgb.r, secondaryColorGreen: color.rgb.g, secondaryColorBlue: color.rgb.b, secondaryColor: color });
    }



    handleConfirmMicroscription = () => {

        const userid = {
            userid: this.props.userId
        }

        // POST REQUEST TO CREATE NEW MICROSCRIPTION
        console.log("unsubscribe confirmed");
        axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/insertnewmicroscription?mcrscrpid=` + uuidv4() + `&developerid=` + this.props.userId
            + `&pcr=` + this.state.primaryColorRed + `&pcg=` + this.state.primaryColorGreen + `&pcb=` + this.state.primaryColorBlue
            + `&scr=` + this.state.secondaryColorRed + `&scg=` + this.state.secondaryColorGreen + `&scb=` + this.state.secondaryColorBlue
            + `&mcrscrpcst=` + document.getElementById('microscriptionCost').value
            + `&mcrscrpnme=` + document.getElementById('microscriptionName').value
            + `&mcrscrpdesc=` + document.getElementById('microscriptionDescription').value
            + `&bcl=` + document.getElementById('microscriptionBillingCycle').value + `&token=` + this.props.authToken, {})
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.status == 200) {
                    this.setState({ show: false });
                    this.props.dialogClosed(false, true);
                }
            })
    }

    render() {



        return (
            <Dialog
                open={this.state.show}
                onClose={this.handleClose}
                maxWidth={"lg"}
                fullWidth={"xl"}
                PaperProps={{
                    style: {
                        background: "white",
                        alignItems: "center",
                        fontFamily: 'Avenir'
                    }
                }}

            >
                <DialogTitle>Add New Microscription</DialogTitle>
                <Paper style={{ backgroundColor: '#CCCCCC', padding: '15px', color: 'black', textAlign: 'center', margin: '15px' }}>
                    Create a new Microscription here! Make sure to fill out every field when creating your Microscription. Your Microscription cost must be $0.02-$0.10.
                        <br />
                    <p style={{ color: 'red' }}>Reminder: A $0.01 fee applies everytime someone subscribes to your Microscription or pays to renew your Microscription.</p>

                    <p style={{ color: 'black' }}>Example: Someone subscribes to your $0.05 Microscription. You would earn $0.04.</p>

                </Paper>
                <TextField
                    autoFocus
                    margin="dense"
                    id="microscriptionName"
                    label="Microscription Name"
                    type="text"
                    style={{
                        padding: '15px',
                        width: '75%'
                    }}
                    fullWidth={true}
                />
                <TextField
                    margin="dense"
                    id="microscriptionDescription"
                    label="Microscription Description"
                    type="text"
                    style={{
                        padding: '15px',
                        width: '75%'
                    }}
                    fullWidth={true}
                />
                <TextField
                    margin="dense"
                    id="microscriptionCost"
                    label="Microscription Cost"
                    placeholder="0.05"
                    type="number"
                    style={{
                        padding: '15px',
                        width: '75%'
                    }}
                    fullWidth={true}
                />
                <TextField
                    margin="dense"
                    id="microscriptionBillingCycle"
                    label="Microscription Billing Cycle (in days)"
                    type="number"
                    placeholder="30"
                    style={{
                        padding: '15px',
                        width: '75%'
                    }}
                    fullWidth={true}
                />

                <br />
                Primary Color:
                <CompactPicker
                    color={this.state.primaryColor}
                    onChange={this.primaryColorChangeHandler}
                />

                <br />
                <br />
                Secondary Color:
                <CompactPicker
                    color={this.state.secondaryColor}
                    onChange={this.secondaryColorChangeHandler}
                />
                <br />
                <br />

                <DialogActions>
                    <Button onClick={() => {
                        console.log('Ask for confimation on new Microscription creation.')
                        console.log('Microscription Name: ' + document.getElementById('microscriptionName').value);
                        console.log('Microscription Description: ' + document.getElementById('microscriptionDescription').value);
                        console.log('Microscription Cost: ' + document.getElementById('microscriptionCost').value);
                        console.log('Microscription Billing Cycle Length: ' + document.getElementById('microscriptionBillingCycle').value);
                        console.log('Microscription primaryColorRed: ' + this.state.primaryColorRed);
                        console.log('Microscription primaryColorGreen: ' + this.state.primaryColorGreen);
                        console.log('Microscription primaryColorBlue: ' + this.state.primaryColorBlue);
                        console.log('Microscription secondaryColorRed: ' + this.state.secondaryColorRed);
                        console.log('Microscription secondaryColorGreen: ' + this.state.secondaryColorGreen);
                        console.log('Microscription secondaryColorBlue: ' + this.state.secondaryColorBlue);
                        if (document.getElementById('microscriptionCost').value > 0 && document.getElementById('microscriptionBillingCycle').value > 0
                            && this.state.primaryColorRed >= 0 && this.state.primaryColorRed <= 255
                            && this.state.primaryColorGreen >= 0 && this.state.primaryColorGreen <= 255
                            && this.state.primaryColorBlue >= 0 && this.state.primaryColorBlue <= 255
                            && this.state.secondaryColorRed >= 0 && this.state.secondaryColorRed <= 255
                            && this.state.secondaryColorGreen >= 0 && this.state.secondaryColorGreen <= 255
                            && this.state.secondaryColorBlue >= 0 && this.state.secondaryColorBlue <= 255
                            && document.getElementById('microscriptionName').value != ''
                            && document.getElementById('microscriptionDescription').value != '') {
                            this.handleAddMicroscription()
                        }
                    }}
                        style={{
                            background: "linear-gradient(90deg, #E15392, #349CDE)",
                            padding: '15px',
                            color: 'white',
                        }}
                    >Add Microscription</Button>
                </DialogActions>





                { /* MODAL TO CONFIRM NEW MICROSCRIPTION */}
                <Dialog open={this.state.showNewMicroscriptionConfirmation}
                    onClose={this.handleModalClose}
                >
                    <div style={modalStyle} className="ModalUnsubscribeConfirmationStyle">
                        <h3>Create Microscription?</h3>
                        <p>Would you like to officially create your new Microscription?</p>
                        <DialogActions>
                            <Button onClick={this.handleConfirmMicroscription}>Yes</Button>
                            <Button onClick={this.handleModalClose}>Cancel</Button>
                        </DialogActions>

                    </div>
                </Dialog>
            </Dialog>
        )
    }
}

export default AddNewMicroscriptionDialog