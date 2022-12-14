import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import {
  Avatar,
  makeStyles,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  TextField,
} from "@material-ui/core";
import LoginIcon from "@mui/icons-material/Login";
import AuthenticationService from "../security/AuthenticationService";
import { api } from "../../utils/Api";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useForm } from "react-hook-form";
import { successToast } from "../Toastify/Toastify";
import UserService from "../../utils/UserService";

const useStyles = makeStyles((theme) => ({
  textfield: {
    ["& fieldset"]: {
      borderRadius: `16px`,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = ({ setIsUserLoggedIn, setIsAdminLoggedIn, ...props }) => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const { register, handleSubmit } = useForm({});

  const history = useHistory();
  const classes = useStyles();

  const loginClicked = (values) => {
    api
      .login(values.username, values.password)
      .then((res) => {
        const loggedInUser = AuthenticationService.successfulLogin(
          res.data.username,
          res.data.roles,
          res.data.avatarId
        );

        setIsUserLoggedIn(true);
        setIsAdminLoggedIn(UserService.isAdmin());

        props.setUser(loggedInUser);

        successToast("Congratulations! You have been successfully logged in");
        if (UserService.isAdmin()) {
          history.push("/dashboard");
        } else {
          history.push("/");
        }
      })
      .catch((error) => {});
  };

  const keypress = (e) => {
    if (e.key === "Enter") {
    }
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LoginIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <div className={classes.form}>
          <form onSubmit={handleSubmit(loginClicked)}>
            <TextField
              autoFocus
              fullWidth
              autoComplete="off"
              label="Username"
              placeholder="Enter Username"
              name="username"
              type="text"
              variant="outlined"
              margin="normal"
              className={classes.textfield}
              {...register("username")}
              onKeyPress={keypress}
            />

            <TextField
              fullWidth
              autoComplete="off"
              label="Password"
              placeholder="Enter Password"
              name="password"
              type={values.showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              className={classes.textfield}
              {...register("password")}
              onKeyPress={keypress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? (
                        <Visibility color="primary" />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <NavLink to="#" variant="body2">
                  <Typography variant="button">Forgot password?</Typography>
                </NavLink>
              </Grid>
              <Grid item>
                <Typography variant="caption">
                  Don't have an account?
                </Typography>
                <NavLink to="/register">
                  <Typography variant="button">Sign Up</Typography>
                </NavLink>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
      <Box mt={8}></Box>
    </Container>
  );
};
export default Login;
