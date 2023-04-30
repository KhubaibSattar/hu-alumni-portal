import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNumPosts } from "../../actions/posts";
import { getUserById, fetchUserData, fetchUserLikes, fetchUsers } from "../../actions/users";
import { Typography, List, ListItem, ListItemText, CircularProgress } from "@material-ui/core";
import { getTopRecommendedUsers } from "../../recommendationHelpers/helpers";
import { get } from "../../actions/dashboard";
import { useLocation, Link } from 'react-router-dom';

const Recommendations = () => {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  const dispatch = useDispatch();
  const numPosts = useSelector((state) => state.posts.numPosts);
  const allUserData = useSelector((state) => state.user.fetchedUsers);

  const fetchData = async () => {
  if (user) {
    try {
      // Fetch the total number of posts
      dispatch(fetchNumPosts());
      const targetUserData = await dispatch(getUserById(user.result._id));
      // Get top recommended users
      const recommendations = await getTopRecommendedUsers(user.result._id, allUserData);

      // Fetch user objects for each recommended user
      const recommendedUsersData = [];
      for (const recommendation of recommendations) {
        const userData = await dispatch(getUserById(recommendation.userId));
        recommendedUsersData.push(userData);
      }

      setRecommendedUsers(recommendedUsersData);
      console.log(recommendedUsersData);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  } else {
    console.log("User not found");
    setLoading(false);
  }
};


  useEffect(() => {
    const fetchAllUsers = async () => {
      await dispatch(fetchUsers());
    };
    fetchAllUsers();
  }, [dispatch]);

  useEffect(() => {
    
    if (allUserData?.length > 0) {
      fetchData();
    }
  }, [user, numPosts, dispatch, allUserData]);

  return (
    <>
      <Typography variant="h6" align="center">
        People to Follow
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {recommendedUsers.map((recommendedUser, index) => (
            <Link
              key={index}
              to={{
                pathname: `/profile`,
                state: { user: recommendedUser },
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem>
                <ListItemText primary={`${index + 1}. ${recommendedUser.name}`} />
              </ListItem>
            </Link>
          ))}
        </List>
      )}
    </>
  );
};

export default Recommendations;
