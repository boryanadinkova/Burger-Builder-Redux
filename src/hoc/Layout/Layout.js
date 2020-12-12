import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "./../Aux/Aux";
import SideDrawer from "./../../components/Navigation/SideDrawer/SideDrawer";
import Toolbar from "./../../components/Navigation/Toolbar/Toolbar";
import styles from "./Layout.module.css";

class Layout extends Component {
  state = {
    showSideDrawer: false,
  };
  SideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };
  SideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };
  render() {
    return (
      <Aux>
        <Toolbar
          isAuthenticated={this.props.isAuthenticated}
          toggleSideDrawer={this.SideDrawerToggleHandler}
        />
        <SideDrawer
          isAuthenticated={this.props.isAuthenticated}
          closed={this.SideDrawerClosedHandler}
          open={this.state.showSideDrawer}
        />
        <main className={styles.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
