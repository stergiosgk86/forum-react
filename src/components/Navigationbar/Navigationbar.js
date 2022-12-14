import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Popover,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@material-ui/core";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../Img/circles.png";
import { api } from "../../utils/Api";
import { exportAvatarArray } from "../../utils/AvatarUtils";
import UserService from "../../utils/UserService";
import DarkModeBtn from "../DarkModeBtn/DarkModeBtn";
import AuthenticationService from "../security/AuthenticationService";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Badge } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      width: "100%",
      justifyContent: "end",
    },
  },
  appbar: {
    [theme.breakpoints.down("xs")]: {
      padding: 4,
    },
  },
  navButton: {
    textDecoration: "none !important",
    color: "inherit !important",
    textTransform: "inherit !important",
  },
  menuIcon: {
    outline: "none!important",
  },
  logo: {
    width: "56px",
    height: "56px",
  },
  appbarLeft: {
    display: "flex",
    justifyContent: "start",
  },
  appbarRight: {
    display: "flex",
    justifyContent: "end",
  },
  appbarUsernameGrid: {
    marginRight: "20px",
    display: "flex",
    alignItems: "center",
  },
  appbarUsername: {
    marginLeft: "10px",
    textTransform: "capitalize",
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  drawerListItemUsername: {
    justifyContent: "start",
  },
  list: {
    width: 250,
  },
  paper: {
    borderRadius: theme.spacing(2),
  },
  avatar: {
    cursor: "pointer",
    width: 50,
    height: 50,
  },
  avatarIcon: {
    height: "35%!important",
    width: "35%!important",
    position: "absolute",
    right: "-5%",
    bottom: "0%",
    cursor: "pointer",
  },
  avatarPopover: {
    marginBottom: "10px",
    cursor: "pointer",
    width: "56px",
    height: "56px",
  },
  avatarGrid: {
    display: "flex",
    justifyContent: "center",
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navigationbar = ({
  isUserLoggedIn,
  setIsUserLoggedIn,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  darkMode,
  handleDarkModeChange,
  ...props
}) => {
  const logoutHandler = () => {
    setIsUserLoggedIn(false);
    setIsAdminLoggedIn(false);
    AuthenticationService.logout();
    setMobileMenuAnchorEl(null);
  };
  const classes = useStyles();
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const [anchorEl, setAnchorEl] = useState(null);
  const avatarsArray = exportAvatarArray();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const openMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const closeMobileMenu = () => {
    setMobileMenuAnchorEl(null);
  };

  const username = AuthenticationService.getLoggedInUserName();

  const findAvatarById = (avatarId) => {
    return avatarsArray.find((avatar) => avatar.id == avatarId);
  };

  const handleAvatar = (avatarId) => {
    api
      .saveAvatar(avatarId)
      .then(() => {
        const avatar = findAvatarById(avatarId);
        props.setUser({
          ...props.user,
          avatar: avatar,
        }); // save avatar state

        UserService.saveAvatar(avatar); //save in localstorage
        handleClose(); //close popover
      })
      .catch((err) => {});
  };

  const mobileMenu = (
    <Drawer anchor="left" open={isMobileMenuOpen} onClose={closeMobileMenu}>
      <div className={classes.list}>
        {isUserLoggedIn ? (
          <>
            <List>
              <ListItem className={classes.drawerListItemUsername}>
                <Grid
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                  onClick={handleClick}
                >
                  <Avatar
                    src={props.user?.avatar?.path}
                    alt=""
                    className={classes.avatar}
                  />
                  <AddCircleIcon className={classes.avatarIcon} />
                </Grid>

                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  PaperProps={{
                    style: { width: "300px", borderRadius: "16px" },
                  }}
                >
                  <Paper
                    elevation={3}
                    component={Card}
                    className={classes.paper}
                  >
                    <CardHeader
                      title="Choose your Avatar"
                      titleTypographyProps={{ variant: "body1" }}
                      style={{ textAlign: "center" }}
                    />
                    <Divider />
                    <CardContent>
                      <Grid container>
                        {avatarsArray.map((avatar) => (
                          <Grid
                            item
                            key={avatar.id}
                            xs={4}
                            sm={3}
                            className={classes.avatarGrid}
                          >
                            <Avatar
                              src={avatar.path}
                              alt=""
                              className={classes.avatarPopover}
                              onClick={() => handleAvatar(avatar.id)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Paper>
                </Popover>

                <Typography className={classes.appbarUsername}>
                  {username}
                </Typography>
              </ListItem>
            </List>
            <Divider />
          </>
        ) : (
          ""
        )}
        <List>
          <ListItem
            button
            className={classes.navButton}
            component={NavLink}
            to="/"
            onClick={closeMobileMenu}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          {isUserLoggedIn ? (
            <>
              {isAdminLoggedIn ? (
                <ListItem
                  button
                  className={classes.navButton}
                  component={NavLink}
                  to="/dashboard"
                  onClick={closeMobileMenu}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              ) : (
                ""
              )}

              <ListItem
                button
                className={classes.navButton}
                component={NavLink}
                to="/login"
                onClick={logoutHandler}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                button
                className={classes.navButton}
                component={NavLink}
                to="/login"
                onClick={closeMobileMenu}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem
                button
                className={classes.navButton}
                component={NavLink}
                to="/register"
                onClick={closeMobileMenu}
              >
                <ListItemIcon>
                  <VpnKeyIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </>
          )}
        </List>
        <Grid style={{ display: "flex", justifyContent: "center" }}>
          <DarkModeBtn
            darkMode={darkMode}
            handleDarkModeChange={handleDarkModeChange}
          />
        </Grid>
      </div>
    </Drawer>
  );

  return (
    <>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar color="default" className={classes.appbar}>
          <Toolbar>
            <Box component={NavLink} to="/">
              <img src={logo} alt="logo" className={classes.logo} />
            </Box>
            <Grid container className={classes.sectionDesktop}>
              <Grid item md={6} className={classes.appbarLeft}>
                <Button
                  color="inherit"
                  className={classes.navButton}
                  component={NavLink}
                  to="/"
                >
                  Home
                </Button>
                {isAdminLoggedIn ? (
                  <Button
                    color="inherit"
                    className={classes.navButton}
                    component={NavLink}
                    to="/dashboard"
                  >
                    Dashboard
                  </Button>
                ) : (
                  ""
                )}
                {/* <Button
                  color="inherit"
                  className={classes.navButton}
                  component={NavLink}
                  to="/aboutUs"
                >
                  About us
                </Button> */}
              </Grid>
              <Grid item md={6} className={classes.appbarRight}>
                {isUserLoggedIn ? (
                  <>
                    <Grid item className={classes.appbarUsernameGrid}>
                      <Grid
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                        onClick={handleClick}
                      >
                        <Avatar
                          src={props.user?.avatar?.path}
                          alt=""
                          className={classes.avatar}
                        />
                        <AddCircleIcon className={classes.avatarIcon} />
                      </Grid>

                      <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        PaperProps={{
                          style: { width: "300px", borderRadius: "16px" },
                        }}
                      >
                        <Paper
                          elevation={3}
                          component={Card}
                          className={classes.paper}
                        >
                          <CardHeader
                            title="Choose your Avatar"
                            titleTypographyProps={{ variant: "body1" }}
                            style={{ textAlign: "center" }}
                          />
                          <Divider />
                          <CardContent>
                            <Grid container>
                              {avatarsArray.map((avatar) => (
                                <Grid
                                  item
                                  key={avatar.id}
                                  xs={4}
                                  sm={3}
                                  className={classes.avatarGrid}
                                >
                                  <Avatar
                                    src={avatar.path}
                                    alt=""
                                    className={classes.avatarPopover}
                                    onClick={() => handleAvatar(avatar.id)}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </CardContent>
                        </Paper>
                      </Popover>

                      <Typography className={classes.appbarUsername}>
                        {username}
                      </Typography>
                    </Grid>

                    {/* <Button
                      color="inherit"
                      className={classes.navButton}
                      component={NavLink}
                      to="/profile"
                      >
                      Profile
                    </Button> */}
                    <Button
                      color="inherit"
                      className={classes.navButton}
                      component={NavLink}
                      to="/login"
                      onClick={logoutHandler}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      className={classes.navButton}
                      component={NavLink}
                      to="/login"
                    >
                      Login
                    </Button>
                    <Button
                      color="inherit"
                      className={classes.navButton}
                      component={NavLink}
                      to="/register"
                    >
                      Register
                    </Button>
                  </>
                )}
                <DarkModeBtn
                  darkMode={darkMode}
                  handleDarkModeChange={handleDarkModeChange}
                />
              </Grid>
            </Grid>
            <Grid item className={classes.sectionMobile}>
              <IconButton
                size="medium"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                className={classes.menuIcon}
                onClick={openMobileMenu}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      {mobileMenu}
    </>
  );
};

export default Navigationbar;
