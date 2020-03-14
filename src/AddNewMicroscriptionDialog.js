import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContentText, DialogContent, DialogActions, Button, Modal, Paper, Slider, Select, MenuItem, FormControl, InputLabel, Grid, Input, Typography } from '@material-ui/core';
import { thisExpression } from '@babel/types';
import './App.css';
import { classes } from 'istanbul-lib-coverage';
import axios from 'axios'
import { TextField } from '@material-ui/core';
import { SketchPicker, CompactPicker } from 'react-color'
import uuidv4 from 'uuid/v4'
import CircularSlider from '@fseehawer/react-circular-slider';

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
            newMicroscriptionCost: 0.00,
            primaryColor: '#E15392',
            secondaryColor: '#349CDE',
            primaryColorRed: 225,
            primaryColorGreen: 83,
            primaryColorBlue: 146,
            secondaryColorRed: 52,
            secondaryColorGreen: 156,
            secondaryColorBlue: 222,
            showInvalidAmountError: false,
            showInvalidNameError: false,
            showInvalidDescriptionError: false,
            newMicroscriptionName: '',
            newMicroscriptionDescription: '',
            newMicroscriptionBillingCycle: 30
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

    handleSliderCostChange = (event, newValue) => {
        // if (typeof newValue === 'string' && newValue <= 0.50 && newValue >= 0.01) {
        //     this.setState({ newMicroscriptionCost: Number(newValue) });
        // }
        this.setState({ newMicroscriptionCost: Number(newValue) });
        console.log(this.state.newMicroscriptionCost)
    }

    handleCostTextChange = event => {
        this.setState({ newMicroscriptionCost: event.target.value === '' ? 0 : Number(event.target.value) })
        console.log(this.state.newMicroscriptionCost)
    }

    handleBlur = () => {
        if (this.state.newMicroscriptionCost < 0.02) {
            this.setState({ newMicroscriptionCost: 0.02 });
            console.log(this.state.newMicroscriptionCost)
        } else if (this.state.newMicrscriptionCost > 0.5) {
            this.setState({ newMicroscriptionCost: 0.5 });
            console.log(this.state.newMicroscriptionCost)
        }
    };

    handleBillingCycleChange = event => {
        console.log(event.target.value);
        this.setState({ newMicroscriptionBillingCycle: event.target.value });
    }



    handleConfirmMicroscription = () => {

        const userid = {
            userid: this.props.userId
        }

        // if (Number(document.getElementById('microscriptionCost').value) >= 0.02 && Number(document.getElementById('microscriptionCost').value <= 0.5)) {
        //     console.log(Number(document.getElementById('microscriptionCost').value));
        //     this.setState({ newMicroscriptionCost: Number(document.getElementById('microscriptionCost').value) })
        // } else {
        //     this.setState({ showInvalidAmountError: true });
        // }

        this.setState({ newMicroscriptionName: document.getElementById('microscriptionName').value, newMicroscriptionDescription: document.getElementById('microscriptionDescription').value });

        // if (typeof document.getElementById('microscriptionBillingCycle').value === 'number' && (document.getElementById('microscriptionBillingNumber').value < 0.02 || document.getElementById('microscriptionCost').value > 0.5)) {
        //     this.setState({ newMicroscriptionCost: document.getElementById('microscriptionCost').value })
        // } else {
        //     this.setState({ showInvalidAmountError: true });
        // }

        // POST REQUEST TO CREATE NEW MICROSCRIPTION
        console.log("microscription details");
        console.log(document.getElementById('microscriptionName').value)
        console.log(document.getElementById('microscriptionDescription').value)
        console.log(document.getElementById('newCostSlider').value)
        console.log(document.getElementById('microscriptionBillingCycle').value)
        console.log('Ask for confimation on new Microscription creation.')
        console.log('Microscription Name: ' + this.state.newMicroscriptionName);
        console.log('Microscription Description: ' + this.state.newMicroscriptionDescription);
        console.log('Microscription Cost: ' + this.state.newMicroscriptionCost);
        console.log('Microscription Billing Cycle Length: ' + this.state.newMicroscriptionBillingCycle);
        console.log('Microscription primaryColorRed: ' + this.state.primaryColorRed);
        console.log('Microscription primaryColorGreen: ' + this.state.primaryColorGreen);
        console.log('Microscription primaryColorBlue: ' + this.state.primaryColorBlue);
        console.log('Microscription secondaryColorRed: ' + this.state.secondaryColorRed);
        console.log('Microscription secondaryColorGreen: ' + this.state.secondaryColorGreen);
        console.log('Microscription secondaryColorBlue: ' + this.state.secondaryColorBlue);
        axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/insertnewmicroscription?mcrscrpid=` + uuidv4() + `&developerid=` + this.props.userId
            + `&pcr=` + this.state.primaryColorRed + `&pcg=` + this.state.primaryColorGreen + `&pcb=` + this.state.primaryColorBlue
            + `&scr=` + this.state.secondaryColorRed + `&scg=` + this.state.secondaryColorGreen + `&scb=` + this.state.secondaryColorBlue
            + `&mcrscrpcst=` + this.state.newMicroscriptionCost
            + `&mcrscrpnme=` + this.state.newMicroscriptionName
            + `&mcrscrpdesc=` + this.state.newMicroscriptionDescription
            + `&bcl=` + this.state.newMicroscriptionBillingCycle + `&token=` + this.props.authToken, {})
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
                    Create a new Microscription here! Make sure to fill out every field when creating your Microscription. Your Microscription cost must be $0.02-$0.50.
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
                {this.state.showInvalidNameError ? <p style={{ color: 'red' }}>Please enter a name for your Microscription.</p> : <div></div>}
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
                {this.state.showInvalidDescriptionError ? <p style={{ color: 'red' }}>Please enter a description for your Microscription.</p> : <div></div>}
                {/* <TextField
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
                /> */}

                <br /><br />
                <Typography discreteBottom>
                    Microscription Cost
                        </Typography>
                <Grid container spacing={2} alignItems="center" style={{ width: '75%' }}>
                    <Grid item xs>
                        <Slider
                            id="newCostSlider"
                            value={typeof this.state.newMicroscriptionCost === 'number' ? this.state.newMicroscriptionCost : 0}
                            onChange={this.handleSliderCostChange}
                            aria-labelledby="input-slider"
                            min={0.02}
                            max={0.50}
                            step={0.01}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            value={this.state.newMicroscriptionCost}
                            margin="dense"
                            onChange={this.handleCostTextChange}
                            onBlur={this.onBlur}
                            inputProps={{
                                step: 0.01,
                                min: 0.02,
                                max: 0.50,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
                <br /><br />
                {this.state.showInvalidAmountError ? <p style={{ color: 'red' }}>Please enter a number between 0.02 and 0.50.</p> : <div></div>}
                <FormControl varient="filled" style={{
                    padding: '15px',
                    width: '75%'
                }}>
                    <InputLabel id="demo-simple-select-label">Billed</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="microscriptionBillingCycle"
                        value={this.state.newMicroscriptionBillingCycle}
                        onChange={this.handleBillingCycleChange}
                    >
                        <MenuItem value={0}>One Time</MenuItem>
                        <MenuItem value={1}>Daily</MenuItem>
                        <MenuItem value={7}>Weekly</MenuItem>
                        <MenuItem value={14}>Bi-Weekly</MenuItem>
                        <MenuItem value={30}>Monthly</MenuItem>
                        <MenuItem value={182}>Semi-Annually</MenuItem>
                        <MenuItem value={365}>Annually</MenuItem>
                    </Select>
                </FormControl>
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
                        console.log('Microscription Name: ' + this.state.newMicroscriptionName);
                        console.log('Microscription Description: ' + this.state.newMicroscriptionDescription);
                        console.log('Microscription Cost: ' + this.state.newMicroscriptionCost);
                        console.log('Microscription Billing Cycle Length: ' + this.state.newMicroscriptionBillingCycle);
                        console.log('Microscription primaryColorRed: ' + this.state.primaryColorRed);
                        console.log('Microscription primaryColorGreen: ' + this.state.primaryColorGreen);
                        console.log('Microscription primaryColorBlue: ' + this.state.primaryColorBlue);
                        console.log('Microscription secondaryColorRed: ' + this.state.secondaryColorRed);
                        console.log('Microscription secondaryColorGreen: ' + this.state.secondaryColorGreen);
                        console.log('Microscription secondaryColorBlue: ' + this.state.secondaryColorBlue);

                        if (document.getElementById('microscriptionName').value == '') {
                            this.setState({ showInvalidNameError: true });
                        } else if (document.getElementById('microscriptionName').value != '') {
                            this.setState({ newMicroscriptionName: document.getElementById('microscriptionName').value });
                            console.log('valid name')
                        }
                        if (document.getElementById('microscriptionDescription').value == '') {
                            this.setState({ showInvalidDescriptionError: true });
                        } else if (document.getElementById('microscriptionDescription').value) {
                            this.setState({ newMicroscriptionDescription: document.getElementById('microscriptionDescription').value });
                            console.log('valid description')
                        }
                        if (this.state.newMicroscriptionCost < 0.02 || this.state.newMicroscriptionCost > 0.5) {
                            this.setState({ showInvalidAmountError: true })
                        } else if (this.state.newMicroscriptionCost >= 0.02 && this.state.newMicroscriptionCost <= 0.5) {
                            console.log('valid cost')
                        }

                        console.log('before post')
                        if (document.getElementById('microscriptionName').value != '' && document.getElementById('microscriptionDescription').value != '' && (this.state.newMicroscriptionCost > 0.02 && this.state.newMicroscriptionCost < 0.5)) {
                            console.log('posting')
                            this.handleAddMicroscription();

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