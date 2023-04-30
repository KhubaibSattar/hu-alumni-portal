import React from "react";
import {Container} from "@material-ui/core";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar/Navbar"
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import Profile from "./components/Profile/Profile";
import AlumniForum from "./components/AlumniForum/AlumniForum";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat/Chat";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import BreakDown from "./components/Graphs/indexbreakdownchart";
import barchart from "./components/Graphs/indexbarchart";
// import barChart_students_working from "./components/Graphs/indexbarchart(students working)";
import Piechart from "./components/Charts/piechart";
import Bar from "./components/Charts/bar";
import StudentList from "./components/Charts/custom";
const App = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    //const mode = useSelector((state) => state.global.mode);
    const theme = createTheme(themeSettings("light"));
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Container maxwidth="false" disableGutters="true">
                    <Navbar/>
                    <Switch>
                        <Route path="/posts" exact component={Home}/>
                        <Route path="/posts/alumni" exact component={AlumniForum}/>
                        <Route path="/breakdown" exact component={BreakDown}/>
                        <Route path="/barchart" exact component={barchart}/>
                        <Route path="/profile" exact component={Profile}/>
                        <Route path="/dashboard" exact component={Dashboard}/>
                        <Route path="/piechart" exact component={Piechart}/>
                        <Route path="/bar" exact component={Bar}/>
                        <Route path="/custom" exact component={StudentList}/>
                        {/* <Route path="/barchart(studentsworking)" exact component={barChart_students_working}/> */}
                        <Route path="/Chat" exact component={Chat}/>
                        <Route path="/" exact component={() => (!user ? <Auth /> : <Redirect to="/posts" />)} />
                    </Switch>
                </Container>
            </ThemeProvider>
        </BrowserRouter>
        
    );
}

export default App;