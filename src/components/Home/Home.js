import {
  Box,
  Button,
  CardActionArea,
  Container,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { api } from "../../utils/Api";
import { forumSession } from "../../utils/SessionStorage";
import Pagination from "../Pagination/Pagination";
import SkeletonCategories from "../Skeletons/SkeletonCategories";
import "./Home.css";

const Home = ({ isAdminLoggedIn }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);

  useEffect(() => {
    setLoading(true);
    api
      .getCategories()
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {});
  }, []);

  //Get current categories
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      borderRadius: 10,
    },
    header: {
      padding: theme.spacing(3),
      backgroundColor: "rgb(86, 100, 210)",
      color: "#fff",
      borderRadius: 10,
      textTransform: "uppercase",
    },
    border: {
      borderRight: "2px solid rgba(0, 0, 0, 0.05)",
    },
    bold: {
      fontSize: "1rem",
      fontWeight: 700,
    },
    media: {
      height: 90,
      borderRadius: 10,
    },
    customButton: {
      outline: "none!important",
      textTransform: "none!important",
      borderRadius: theme.spacing(2),
      backgroundColor: "rgb(86, 100, 210)",
      color: "white",
    },
  }));

  const classes = useStyles();

  return (
    <div>
      <div className="forum-image"></div>
      <Container maxWidth="lg" fixed={true} component={Box} p={2}>
        <Paper className={classes.header}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className={classes.bold}>
                Forum
              </Typography>
            </Grid>
            <Hidden smDown>
              <Grid container item xs={6}>
                <Grid
                  container
                  item
                  xs={3}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  component={Box}
                >
                  <Typography variant="h6" className={classes.bold}>
                    Posts
                  </Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={3}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  component={Box}
                >
                  <Typography variant="h6" className={classes.bold}>
                    Comments
                  </Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  component={Box}
                >
                  <Typography variant="h6" className={classes.bold}>
                    Last Comment
                  </Typography>
                </Grid>
              </Grid>
            </Hidden>
          </Grid>
        </Paper>
      </Container>

      <>
        {loading ? (
          <SkeletonCategories />
        ) : (
          <>
            {currentCategories.map((category) => (
              <Container
                maxWidth="lg"
                fixed={true}
                component={Box}
                pb={2}
                key={category.id}
              >
                <Paper className={classes.paper} elevation={10}>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      component={Box}
                      className={classes.border}
                      className="seperate"
                    >
                      <CardActionArea
                        component={Link}
                        color="textPrimary"
                        to="/posts"
                        onClick={() =>
                          forumSession.category.saveId(category.id)
                        }
                        className="link text-decoration-none"
                      >
                        <Typography variant="h6" noWrap={true}>
                          {category.title}
                        </Typography>
                        <Typography variant="body2" noWrap={true}>
                          {category.description}
                        </Typography>
                      </CardActionArea>
                    </Grid>
                    <Hidden smDown>
                      <Grid container item xs={6}>
                        <Grid
                          container
                          item
                          xs={3}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          component={Box}
                          className={classes.border}
                        >
                          <Typography variant="h6">
                            {category.numPosts}
                          </Typography>
                        </Grid>
                        <Grid
                          container
                          item
                          xs={3}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          component={Box}
                          className={classes.border}
                        >
                          <Typography variant="h6">
                            {category.numComments}
                          </Typography>
                        </Grid>
                        <Grid
                          container
                          item
                          xs={6}
                          display="flex"
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                          component={Box}
                        >
                          {category.lastComment ? (
                            <>
                              <Grid item>
                                <Typography
                                  style={{ cursor: "pointer" }}
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  <Tooltip
                                    title={moment(
                                      category?.lastComment?.dateCreated
                                    ).format("MMMM D, YYYY [at] h:mm A")}
                                  >
                                    <Box className={classes.date}>
                                      {moment(
                                        category?.lastComment?.dateCreated
                                      ).fromNow()}
                                    </Box>
                                  </Tooltip>
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography
                                  className="text-capitalize"
                                  variant="h6"
                                >
                                  {category?.lastComment?.username}
                                </Typography>
                              </Grid>
                            </>
                          ) : (
                            <Grid
                              container
                              item
                              xs={8}
                              display="flex"
                              direction="column"
                              justifyContent="center"
                              alignItems="center"
                              component={Box}
                            >
                              <Typography variant="h6" align="center">
                                No Comments
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Hidden>
                  </Grid>
                </Paper>
              </Container>
            ))}
          </>
        )}
      </>

      <Container maxWidth="lg" fixed={true} component={Box} pb={2}>
        <Pagination
          categoriesPerPage={categoriesPerPage}
          totalCategories={categories.length}
          paginate={paginate}
        />
      </Container>
      {isAdminLoggedIn ? (
        <Container maxWidth="lg" fixed={true} component={Box} pb={3}>
          <NavLink to="/dashboard/categories" className="navlink">
            <Button
              className={classes.customButton}
              variant="contained"
              size="large"
              color="primary"
              startIcon={<AddBoxIcon />}
            >
              Add Category
            </Button>
          </NavLink>
        </Container>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
