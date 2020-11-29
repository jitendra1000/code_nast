import React from "react";
import Search from "./components/Search";
import NewsDetails from "./components/NewsDetails";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
class NewsApp extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/news">
              <Search />
            </Route>
            <Route exact path="/news/details">
              <NewsDetails />
            </Route>
            <Route path="/">
              <Search />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default NewsApp;
