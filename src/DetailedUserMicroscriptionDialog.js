import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContentText, DialogContent, DialogActions, Button, Modal, TextField } from '@material-ui/core';
import { thisExpression } from '@babel/types';
import './App.css';
import { classes } from 'istanbul-lib-coverage';
import axios from 'axios'
import { SketchPicker, CompactPicker } from 'react-color'

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
        super(props);
        this.state = {
            show: true,
            showUnsubscribeConfirmation: false,
            unsubscribeConfirmed: false,
            showEditMicroscriptionDialog: false,
            showEditMicroscriptionConfirmationDialog: false,
            primaryColor: { r: this.props.microscription.primaryColorRed, g: this.props.microscription.primaryColorGreen, b: this.props.microscription.primaryColorBlue },
            secondaryColor: { r: this.props.microscription.secondaryColorRed, g: this.props.microscription.secondaryColorGreen, b: this.props.microscription.secondaryColorBlue },
            primaryColorRed: this.props.microscription.primaryColorRed,
            primaryColorGreen: this.props.microscription.primaryColorGreen,
            primaryColorBlue: this.props.microscription.primaryColorBlue,
            secondaryColorRed: this.props.microscription.secondaryColorRed,
            secondaryColorGreen: this.props.microscription.secondaryColorGreen,
            secondaryColorBlue: this.props.microscription.secondaryColorBlue,
            showDeleteMicroscriptionConfirmationDialog: false,
        };
    }

    primaryColorChangeHandler = (color, event) => {
        console.log(color.rgb);
        this.setState({ primaryColorRed: color.rgb.r, primaryColorGreen: color.rgb.g, primaryColorBlue: color.rgb.b, primaryColor: color });
    }

    secondaryColorChangeHandler = (color, event) => {
        console.log(color.rgb);
        this.setState({ secondaryColorRed: color.rgb.r, secondaryColorGreen: color.rgb.g, secondaryColorBlue: color.rgb.b, secondaryColor: color });
    }

    handleClose = () => {
        this.setState({ show: false });
        this.props.dialogClosed(false, false);
    }

    handleModalClose = () => {
        this.setState({ showUnsubscribeConfirmation: false })
    }

    handleEditClose = () => {
        this.setState({ showEditMicroscriptionDialog: false })
    }

    handleEditConfirmationClose = () => {
        this.setState({ showEditMicroscriptionConfirmationDialog: false })
    }

    handleDeleteConfirmationClose = () => {
        this.setState({ showDeleteMicroscriptionConfirmationDialog: false })
    }

    handleUnsubscribe = () => {
        console.log("unsubscribe clicked for: " + this.props.microscription.microscriptionId);
        this.setState({ showUnsubscribeConfirmation: true });
    }

    handleUpdateMicroscription = () => {
        this.setState({ showEditMicroscriptionDialog: true })
    }

    handleUpdateConfirmationMicroscription = () => {
        this.setState({ showEditMicroscriptionConfirmationDialog: true })
    }

    handleDeleteConfirmationMicroscription = () => {
        this.setState({ showDeleteMicroscriptionConfirmationDialog: true })
    }



    handleConfirmUnsubscribe = () => {

        const userid = {
            userid: this.props.userId
        }

        const mcrscrpid = {
            mcrscrpid: this.props.microscription.microscriptionId
        }

        console.log("unsubscribe confirmed");
        axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/unsubscribeuser?mcrscrpid=` + this.props.microscription.microscriptionId + `&userid=` + this.props.userId + `&token=` + this.props.authToken, {})
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.status == 200) {
                    this.setState({ show: false });
                    this.props.dialogClosed(false, true);
                }
            })
    }

    handleConfirmEdit = () => {

        // POST REQUEST TO CREATE NEW MICROSCRIPTION
        console.log("edit confirmed");
        axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/updatemicroscription?pcr=` + this.state.primaryColorRed + `&pcg=` + this.state.primaryColorGreen + `&pcb=` + this.state.primaryColorBlue
            + `&scr=` + this.state.secondaryColorRed + `&scg=` + this.state.secondaryColorGreen + `&scb=` + this.state.secondaryColorBlue
            + `&mcrscrpcst=` + document.getElementById('microscriptionCost').value
            + `&mcrscrpnme=` + document.getElementById('microscriptionName').value
            + `&mcrscrpdesc=` + document.getElementById('microscriptionDescription').value
            + `&mcrscrpid=` + this.props.microscription.microscriptionId
            + `&devid=` + this.props.userId + `&token=` + this.props.authToken, {})
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.status == 200) {
                    this.setState({ show: false });
                    this.props.dialogClosed(false, true);
                }
            })
    }

    handleConfirmDelete = () => {

        // POST REQUEST TO CREATE NEW MICROSCRIPTION
        console.log("delete confirmed");
        axios.post(`https://cmjt0injr2.execute-api.us-east-2.amazonaws.com/100/microscription/deletemicroscription?mcrscrpid=` + this.props.microscription.microscriptionId + `&developerid=` + this.props.userId + `&token=` + this.props.authToken, {})
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
                maxWidth={"sm"}
                fullWidth={"sm"}
                className="userMicroscriptionStyle"
                PaperProps={{
                    style: {
                        background:
                            "linear-gradient(90deg, rgba(" + this.props.microscription.primaryColorRed + "," + this.props.microscription.primaryColorGreen + "," + this.props.microscription.primaryColorBlue + ", 1), rgba(" + this.props.microscription.secondaryColorRed + "," + this.props.microscription.secondaryColorGreen + "," + this.props.microscription.secondaryColorBlue + ", 1))",
                        alignItems: "center"
                    }
                }}

            >
                <DialogTitle>{this.props.microscription.microscriptionName}</DialogTitle>
                {this.props.microscription.billingCycle != 0 ? <DialogContentText>${this.props.microscription.microscriptionCost} charged every {this.props.microscription.billingCycle} days</DialogContentText> : <DialogContentText>${this.props.microscription.microscriptionCost} charged once.</DialogContentText>}
                <DialogContentText>{this.props.microscription.microscriptionDescription}</DialogContentText>
                {this.props.isDeveloperModal ?
                    <div>
                        <DialogContent style={{ padding: '20px' }}>
                            <a href={'/microscription?s=' + this.props.microscription.microscriptionId} target="_self" onMouseOver="this.style.opacity='0.5'" style={{ background: 'linear-gradient(90deg, #E15392, #349CDE)', fontFamily: 'Avenir', fontSize: '20px', color: 'white', textDecoration: 'none', padding: '10px', width: '100px', height: '75px', borderRadius: '15px' }}>Microscribe <strong style={{ fontSize: '35px' }} >¢</strong></a>
                        </DialogContent>

                        <DialogContent style={{ padding: '20px' }}>
                            <TextField disabled margin="normal" variant="outlined" style={{ margin: 8, height: '40px' }} label="Embed Button" defaultValue={`<a href='https://www.microscriptions.com/microscription?s=` + this.props.microscription.microscriptionId + `' target='_blank' style="background: linear-gradient(90deg, #E15392, #349CDE); font-family: 'Avenir'; font-size: 20px; color: white; text-decoration: none; padding: 10px; width: 100px; height: 75px; border-radius: 15px">Microscribe <strong style="font-size: 35px" >¢</strong></a>`}/>
                        </DialogContent>

                        Use the below link if you cannot embed a button.

                        <DialogContent style={{ padding: '20px' }}>
                            <TextField disabled margin="normal" variant="outlined" style={{ margin: 8, height: '40px' }} label="Microscription Link" defaultValue={`https://www.microscriptions.com/microscription?s=` + this.props.microscription.microscriptionId}/>
                        </DialogContent>
                    </div>
                    : <div></div>}
                <DialogActions>
                    {!this.props.isDeveloperModal ? <Button onClick={this.handleUnsubscribe}>Unsubscribe</Button> : <Button onClick={this.handleUpdateMicroscription}>Edit</Button>}
                </DialogActions>
                {/* UNSUBSCRIBE FROM MICROSCRIPTION CONFIRMATION */}
                <Dialog open={this.state.showUnsubscribeConfirmation}
                    onClose={this.handleModalClose}
                >
                    <div style={modalStyle} className="ModalUnsubscribeConfirmationStyle">
                        <h3>Unsubscribe?</h3>
                        <p>Are you sure you want to unsubscribe from {this.props.microscription.microscriptionName}?</p>
                        <DialogActions>
                            <Button onClick={this.handleConfirmUnsubscribe}>Yes</Button>
                            <Button onClick={this.handleModalClose}>Cancel</Button>
                        </DialogActions>

                    </div>
                </Dialog>
                {/* EDIT MICROSCRIPTION */}
                <Dialog open={this.state.showEditMicroscriptionDialog}
                    onClose={this.handleEditClose}
                >
                    <div style={modalStyle} className="ModalUnsubscribeConfirmationStyle">

                        <Dialog
                            open={this.state.show}
                            onClose={this.handleClose}
                            maxWidth={"sm"}
                            fullWidth={"sm"}
                            className="userMicroscriptionStyle"
                            PaperProps={{
                                style: {
                                    background: "white",
                                    alignItems: "center"
                                }
                            }}

                        >
                            <DialogTitle>Edit Microscription</DialogTitle>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="microscriptionName"
                                label="Microscription Name"
                                defaultValue={this.props.microscription.microscriptionName}
                                type="text"
                                style={
                                    { padding: '15px' }
                                }
                            />
                            <TextField
                                margin="dense"
                                id="microscriptionDescription"
                                label="Microscription Description"
                                multiline='true'
                                rows='3'
                                defaultValue={this.props.microscription.microscriptionDescription}
                                type="text"
                                style={
                                    { padding: '15px' }
                                }
                            />
                            <TextField
                                margin="dense"
                                id="microscriptionCost"
                                label="Microscription Cost (i.e. 0.01)"
                                defaultValue={this.props.microscription.microscriptionCost}
                                type="number"
                                style={
                                    { padding: '15px' }
                                }
                            />
                            <p>Please contact Microscriptions if you need to adjust billing cycle length.</p>

                            <br />
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
                                <Button
                                    fullWidth
                                    onClick={() => {
                                        console.log('Ask for confimation on new Microscription creation.')
                                        console.log('Microscription Name: ' + document.getElementById('microscriptionName').value);
                                        console.log('Microscription Description: ' + document.getElementById('microscriptionDescription').value);
                                        console.log('Microscription Cost: ' + document.getElementById('microscriptionCost').value);
                                        console.log('Microscription primaryColorRed: ' + this.state.primaryColorRed);
                                        console.log('Microscription primaryColorGreen: ' + this.state.primaryColorGreen);
                                        console.log('Microscription primaryColorBlue: ' + this.state.primaryColorBlue);
                                        console.log('Microscription secondaryColorRed: ' + this.state.secondaryColorRed);
                                        console.log('Microscription secondaryColorGreen: ' + this.state.secondaryColorGreen);
                                        console.log('Microscription secondaryColorBlue: ' + this.state.secondaryColorBlue);
                                        if (document.getElementById('microscriptionCost').value > 0
                                            && this.state.primaryColorRed >= 0 && this.state.primaryColorRed <= 255
                                            && this.state.primaryColorGreen >= 0 && this.state.primaryColorGreen <= 255
                                            && this.state.primaryColorBlue >= 0 && this.state.primaryColorBlue <= 255
                                            && this.state.secondaryColorRed >= 0 && this.state.secondaryColorRed <= 255
                                            && this.state.secondaryColorGreen >= 0 && this.state.secondaryColorGreen <= 255
                                            && this.state.secondaryColorBlue >= 0 && this.state.secondaryColorBlue <= 255
                                            && document.getElementById('microscriptionName').value != ''
                                            && document.getElementById('microscriptionDescription').value != '') {
                                            this.handleUpdateConfirmationMicroscription()
                                        }
                                    }}
                                    style={{
                                        background: "linear-gradient(90deg, #E15392, #349CDE)",
                                        padding: '15px',
                                    }}
                                >Edit Microscription</Button>
                            </DialogActions>
                            <DialogActions>
                                <Button onClick={() => {
                                    console.log('Delete microscription clicked.');
                                    this.handleDeleteConfirmationMicroscription()
                                }}
                                    fullWidth
                                    style={{
                                        padding: '5px',
                                        color: 'red'
                                    }}>
                                    Delete Microscription
                                </Button>
                            </DialogActions>

                        </Dialog>


                    </div>
                </Dialog>
                {/* EDIT MICROSCRIPTION CONFIRMATION */}
                <Dialog open={this.state.showEditMicroscriptionConfirmationDialog}
                    onClose={this.handleEditConfirmationClose}
                >
                    <div style={modalStyle} className="ModalUnsubscribeConfirmationStyle">
                        <h3>Edit Microscription?</h3>
                        <p>Are you sure you want to edit {this.props.microscription.microscriptionName}?</p>
                        <DialogActions>
                            <Button onClick={this.handleConfirmEdit}>Yes</Button>
                            <Button onClick={this.handleEditConfirmationClose}>Cancel</Button>
                        </DialogActions>

                    </div>
                </Dialog>
                {/* DELETE MICROSCRIPTION CONFIRMATION */}
                <Dialog open={this.state.showDeleteMicroscriptionConfirmationDialog}
                    onClose={this.handleDeleteConfirmationClose}
                >
                    <div style={modalStyle} className="ModalUnsubscribeConfirmationStyle">
                        <h3>DELETE Microscription?</h3>
                        <p>This action cannot be undone.</p>
                        <DialogActions>
                            <Button onClick={this.handleConfirmDelete}>Yes</Button>
                            <Button onClick={this.handleDeleteConfirmationClose}>Cancel</Button>
                        </DialogActions>

                    </div>
                </Dialog>
            </Dialog>
        )
    }
}

export default DetailedUserMicroscriptionDialog