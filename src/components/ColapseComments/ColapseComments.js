import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { api } from "../../utils/Api";
import { handleAvararOfPostAndComments } from "../../utils/AvatarUtils";
import { forumSession } from "../../utils/SessionStorage";

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

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    borderRadius: 10,
  },
  avatar: {
    display: "flex",
    alignItems: "center",
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
  date: {
    fontSize: "0.7rem",
    fontWeight: 500,
    opacity: 0.6,
  },
  likeCommentBtn: {
    padding: theme.spacing(1),
  },
  boxbtn: {
    alignItems: "center",
    display: "flex",
    fontWeight: 500,
  },
  description: {
    padding: theme.spacing(2),
  },
  cardActionArea: {
    outline: "none!important",
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
    cursor: "pointer",
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
  viewMoreCommentsGrid: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const ColapseComments = ({ posts, post, setPosts, user }) => {
  const [commentsPageable, setCommentsPageable] = useState({});
  const [text, setText] = useState("");
  const [pageable, setPageable] = useState({ size: 3, page: 0 });

  const textFieldRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    api.getPostCommentsPageable(post.id, pageable).then((res) => {
      setCommentsPageable(res.data);
    });
  }, []);

  const viewMoreComments = () => {
    const newPageable = { ...pageable, size: pageable.size + 5 };
    api.getPostCommentsPageable(post.id, newPageable).then((res) => {
      setCommentsPageable(res.data);
      setPageable(newPageable);
    });
  };

  const submitComment = () => {
    api
      .saveComment(post.id, {
        text: text,
        userId: forumSession.user.getId(),
      })
      .then((res) => {
        const comments = [res.data, ...commentsPageable.content];
        setCommentsPageable({
          ...commentsPageable,
          content: comments,
        });
        setText("");
        const newPosts = posts.map((p) => {
          if (p.id === post.id) {
            p.numComments++;
          }
          return p;
        });
        setPosts(newPosts);
      })
      .catch((err) => {});
  };

  const scrollToTextField = () => {
    textFieldRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const keypress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      submitComment();
    }
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <>
      <Divider variant="fullWidth" component="legend" />
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
            <Avatar src={user?.avatar?.path} alt="" />
          </StyledBadge>
        </Grid>

        <Grid item xs={10} sm={11}>
          <TextField
            ref={textFieldRef}
            multiline
            variant="standard"
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={submitComment}
                    className={classes.sendBtn}
                  >
                    <SendIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            aria-label="empty textarea"
            placeholder="Write a comment..."
            value={text}
            onKeyPress={keypress}
            onChange={handleChange}
            name="text"
          />
        </Grid>
      </Grid>

      {commentsPageable?.content ? (
        <Grid className={classes.collapse}>
          {commentsPageable?.content?.map((comment) => (
            <Grid container key={comment.id} className={classes.chat}>
              <Grid item xs={2} sm={1} className={classes.avatar}>
                <Avatar
                  alt=""
                  src={handleAvararOfPostAndComments(user, comment)}
                />
              </Grid>
              <Grid item xs={10} sm={11}>
                <Card elevation={2} className={classes.commentBubble}>
                  <Box className={classes.cardActionArea}>
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
                        <Tooltip
                          title={moment(comment.dateCreated).format(
                            "MMMM D, YYYY [at] h:mm A"
                          )}
                        >
                          <Box className={classes.date}>
                            {moment(comment.dateCreated).fromNow()}
                          </Box>
                        </Tooltip>
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          ))}
          <Grid style={{ paddingTop: "10px" }}>
            {pageable.size < commentsPageable?.totalElements ? (
              <Grid className={classes.viewMoreCommentsGrid}>
                <Button
                  className="likeCommentBtn"
                  onClick={() => viewMoreComments()}
                >
                  View more comments
                </Button>
                <Typography>
                  {pageable.size} of {commentsPageable.totalElements}
                </Typography>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
          <Grid>
            {pageable.size > 3 ? (
              <Button className="likeCommentBtn" onClick={scrollToTextField}>
                Write a comment...
              </Button>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </>
  );
};

export default ColapseComments;
