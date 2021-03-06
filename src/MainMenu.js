import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './Header.css';
import squareLogo from './small_SquareLogo.png';

import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'
import { classes } from 'istanbul-lib-coverage';



class MainMenu extends React.Component {

  useStyles = () => makeStyles({
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: this.theme.spacing(50),
    },
    title: {
      flexGrow: 1,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
        openLeft: false
    };
}

  toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({ openLeft: open });
  };

  ListItemLink = (props) => {
    return <ListItem button component="a" {...props} />;
  }

  ChangeAppScreen = (screenName) => {
    this.props.appCurrentScreen(screenName);
    console.log(screenName)
  }

  sideList = side => (
    <div
      id="sideDrawer"
      className="sideMenu"
      role="presentation"
      onClick={this.toggleDrawer(false)}
      onKeyDown={this.toggleDrawer(false)}
    >
      <List>
        <this.ListItemLink onClick={() => this.ChangeAppScreen('Home')}>
          <ListItemText primary="Home"/>
        </this.ListItemLink>
        {this.props.isLoggedIn ? <this.ListItemLink onClick={() => this.ChangeAppScreen('MyAccount')}>
          <ListItemText primary="My Account" />
        </this.ListItemLink> : <div></div> }
        <this.ListItemLink onClick={() => this.ChangeAppScreen('Contact')}>
          <ListItemText primary="Contact" />
        </this.ListItemLink>
        {!this.props.isLoggedIn ? <this.ListItemLink onClick={() => this.ChangeAppScreen('Login')}>
          <ListItemText primary="Log In" />
        </this.ListItemLink> : <this.ListItemLink onClick={() => this.ChangeAppScreen('Login')}>
          <ListItemText primary="Log Out" />
        </this.ListItemLink> }
      </List>
      <Divider />
      <List>
        <this.ListItemLink onClick={() => this.ChangeAppScreen('Creator')}>
          <ListItemText primary="Creator" />
        </this.ListItemLink>
      </List>
    </div>
  );

  render() {
    return (
      <div>
        <Drawer open={this.state.openLeft} onClose={this.toggleDrawer(false)}>
          {this.sideList('left')}
        </Drawer>
        <AppBar position="fixed" className="Toolbar-Style">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="black" onClick={this.toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            {/* <IconButton edge="end" style={{ position: 'relative' }} onClick={console.log('home clicked.')}>
              <img src={squareLogo} className="SquareLogoStyle" />
            </IconButton> */}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
  
}

export default MainMenu;
