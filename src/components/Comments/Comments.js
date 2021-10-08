import React, { Component } from "react";
import { api, BASE_URL } from "../../utils/Api";
import { forumSession } from "../../utils/SessionStorage";
import moment from "moment";
import "./Comments.css";
import SendIcon from "@material-ui/icons/Send";
import {
  withStyles,
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Badge,
  Collapse,
  Divider,
} from "@material-ui/core";
import clsx from "clsx";
import AuthenticationService from "../security/AuthenticationService";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ScrollIntoView from "react-scroll-into-view";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import UserService from "../../utils/UserService";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    borderRadius: 10,
  },
  chat: {
    paddingTop: theme.spacing(2),
  },
  avatar: {
    display: "flex",
    alignItems: "center",
  },
  nameBubble: {
    fontSize: "0.9rem",
    fontWeight: 700,
    textTransform: "capitalize",
  },
  commentBubble: {
    borderRadius: 15,
  },
  commentCreated: {
    fontSize: "0.7rem",
    display: "flex",
    justifyContent: "flex-end",
  },
  postTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    padding: theme.spacing(1),
  },
  name: {
    fontSize: "0.9rem",
    fontWeight: 700,
    textTransform: "capitalize",
    paddingBottom: "10px",
  },
  sendBtn: {
    outline: "none!important",
  },
  date: {
    fontSize: "0.7rem",
    fontWeight: 500,
    opacity: 0.6,
  },
  likesComments: {
    padding: theme.spacing(1),
  },
  description: {
    padding: theme.spacing(2),
  },
  textarea: {
    resize: "both",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  collapse: {
    width: "100%",
  },
  cardActionArea: {
    outline: "none!important",
  },
});

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: forumSession.post.getId(),
      comments: [],
      userId: forumSession.user.getId(),
      post: {},
      username: AuthenticationService.getLoggedInUserName(),
      expanded: false,
      avatar: UserService.findAvatarOfLoggedInUser(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.keypress = this.keypress.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }

  componentDidMount() {
    api
      .getPostComments(this.state.postId)
      .then((res) => {
        this.setState((state) => {
          state.post = res.data.post;
          state.comments = res.data.comments;
          state.likes = res.data.likes;
          state.numComments = res.data.numComments;
          return { state };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  submitLike() {
    api
      .submitLike(this.state.postId, this.state.userId)
      .then((res) => {
        if (res.status === 200) {
          this.setState((state) => {
            state.likes = res.data.likes;
            return state;
          });
        }
      })
      .catch((err) => {});
  }

  keypress(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      this.submitComment();
    }
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  submitComment() {
    api
      .saveComment(this.state.postId, {
        text: this.state.text,
        userId: this.state.userId,
      })
      .then((res) => {
        this.setState((state) => {
          state.comments = [...this.state.comments, res.data];
          state.numComments++;
          state.text = "";
          state.expanded = true;
          let element = document.getElementById("input");
          element.scrollIntoView({ behavior: "smooth" });
          return state;
        });
      })
      .catch((err) => {});
  }

  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <Container
          component={Box}
          py={3}
          key={this.state.post.id}
          style={{ maxWidth: "750px" }}
        >
          <Paper className={classes.paper} elevation={10}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              component={Box}
            >
              <Grid container justifyContent="center" component={Box}>
                <Typography variant="inherit" className={classes.postTitle}>
                  {this.state.post.title}
                </Typography>
              </Grid>
              <Divider variant="fullWidth" component="legend" />
              <Grid container py={2} component={Box}>
                <Grid className={classes.avatar}>
                  <Avatar alt="" src="">
                    {this.state.post.username?.charAt(0)}
                  </Avatar>
                </Grid>
                <Grid item component={Box}>
                  <Grid container component={Box} px={2}>
                    <Grid container component={Box} className={classes.name}>
                      {this.state.post.username}
                    </Grid>
                    <Grid container component={Box} className={classes.date}>
                      {moment(this.state.post.dateCreated).format(
                        "MMMM D, YYYY [at] h:mm A"
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                component={Box}
                justifyContent="flex-start"
                className={classes.description}
              >
                <Typography variant="body2">
                  {this.state.post.description}
                </Typography>
              </Grid>
              <CardActionArea className={classes.cardActionArea}>
                <Grid item>
                  {this.state.post.imageUrl ? (
                    <LazyLoadImage
                      alt=""
                      effect="blur"
                      src={`${BASE_URL}/${this.state.post.imageUrl}`}
                      onDoubleClick={() => {
                        this.submitLike();
                        this.state.post.hasLikeByLoggedInUser =
                          !this.state.post.hasLikeByLoggedInUser;
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Grid>
              </CardActionArea>
              <Divider variant="fullWidth" component="legend" />
              <Grid
                container
                component={Box}
                justifyContent="space-between"
                alignItems="center"
                className={classes.likesComments}
              >
                <Button
                  className="likeCommentBtn"
                  onClick={() => {
                    this.submitLike();
                    this.state.post.hasLikeByLoggedInUser =
                      !this.state.post.hasLikeByLoggedInUser;
                  }}
                >
                  <Typography variant="body2">
                    {this.state.likes}
                    {this.state.post.hasLikeByLoggedInUser ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </Typography>
                </Button>
                <Typography variant="body2">
                  {this.state.numComments} Comments
                  {this.state.comments.length ? (
                    <IconButton
                      style={{ outline: "none" }}
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: this.state.expanded,
                      })}
                      onClick={this.handleExpandClick}
                      aria-expanded={this.state.expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    ""
                  )}
                </Typography>
              </Grid>
              <Divider variant="fullWidth" component="legend" />
              <Collapse
                className={classes.collapse}
                in={this.state.expanded}
                timeout="auto"
                unmountOnExit
              >
                {this.state.comments.map((comment) => (
                  <Grid container key={comment.id} className={classes.chat}>
                    <Grid item xs={2} sm={1} className={classes.avatar}>
                      <Avatar alt="" src="">
                        {comment.username.charAt(0)}
                      </Avatar>
                    </Grid>
                    <Grid item xs={10} sm={11}>
                      <Card elevation={2} className={classes.commentBubble}>
                        <CardActionArea className={classes.cardActionArea}>
                          <CardContent>
                            <Typography className={classes.nameBubble}>
                              {comment.username}
                            </Typography>

                            <Typography
                              gutterBottom
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              {comment.text}
                            </Typography>

                            <Typography
                              variant="caption"
                              className={classes.commentCreated}
                            >
                              {moment(comment.dateCreated).format(
                                "dddd, MMMM D, YYYY [at] h:mm A"
                              )}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  </Grid>
                ))}
              </Collapse>

              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                component={Box}
                py={2}
              >
                <Grid item xs={2} sm={1}>
                  <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                  >
                    <Avatar src={this.state.avatar?.path} alt="" />
                  </StyledBadge>
                </Grid>

                <Grid item xs={10} sm={11}>
                  {/* <ScrollIntoView selector="#input"> */}
                  <TextField
                    id="input"
                    multiline
                    variant="standard"
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={this.submitComment}
                            className={classes.sendBtn}
                          >
                            <SendIcon color="primary" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    aria-label="empty textarea"
                    placeholder="Write a comment..."
                    value={this.state.text}
                    onKeyPress={this.keypress}
                    onChange={this.handleChange}
                    name="text"
                  />
                  {/* </ScrollIntoView> */}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </>
    );
  }
}

export default withStyles(styles)(Comments);
