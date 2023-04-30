import React, {useState, useEffect} from "react";
import {AppBar, Avatar, Button, Toolbar, Typography} from "@material-ui/core";
import logo from "../../images/habib.png";
import useStyles from "./styles";
import {Link, useHistory, useLocation} from "react-router-dom";
import * as actionType from '../../constants/actionTypes';
import { useDispatch } from "react-redux";
import decode from 'jwt-decode';


const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const logout = () => {
        dispatch({type: actionType.LOGOUT});
        setUser(null);
        history.push("/");
        
        
    };
    
    useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken = decode(token);
      
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
          }

        setUser(JSON.parse(localStorage.getItem('profile')));

         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <img className={classes.image} src={logo} alt="habib-logo" height="60" />
                <Typography
                    component={Link}
                    to="/posts"
                    className={`${classes.heading} ${location.pathname === '/posts' ? classes.active : ''}`}
                    variant="h5"
                    align="center"
                >
                    &nbsp; &nbsp; Student Forum
                </Typography>
                <Typography
                    component={Link}
                    to="/posts/alumni"
                    className={`${classes.heading} ${location.pathname === '/posts/alumni' ? classes.active : ''}`}
                    variant="h5"
                    align="center"
                >
                    &nbsp; &nbsp; Alumni Forum
                </Typography>
                <Typography
                    component={Link}
                    to="/dashboard"
                    className={`${classes.heading} ${location.pathname === '/dashboard' ? classes.active : ''}`}
                    variant="h5"
                    align="center"
                >
                    &nbsp; &nbsp;Dashboard
                </Typography>
                <Typography
                    component={Link}
                    to={{ pathname: '/profile', state: {user: user?.result } }}
                    className={`${classes.heading} ${location.pathname === '/profile' ? classes.active : ''}`}
                    variant="h5"
                    align="center"
                >
                    &nbsp; &nbsp;Profile
                </Typography>
                <Typography
                    component={Link}
                    to="/Chat"
                    className={`${classes.heading} ${location.pathname === '/Chat' ? classes.active : ''}`}
                    variant="h5"
                    align="center"
                >
                    &nbsp; &nbsp;Chat
                </Typography>
            </div>
            <Toolbar className={classes.toolbar}>
                    {user?.result? (
                        <div className={classes.profile}>
                            <Avatar className={classes.purple} alt={user.result.name}  src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                            <Typography className={classes.userName} variant="h6">{user.result.name}</Typography>
                            <Button variant="contained" className={classes.logout} onClick={logout} color="gray">Log out</Button>
                        </div>
                        
                    ) :
                    (
                        <Button component={Link} to="/" variant="contained" color="gray">Sign in</Button>
                    )}
                </Toolbar>
        </AppBar>
    );
};

export default Navbar;