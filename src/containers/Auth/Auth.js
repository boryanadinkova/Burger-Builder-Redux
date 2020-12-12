import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import styles from "./Auth.module.css";
import * as actions from "../../store/actions/auth";
import { checkValidity } from "../../shared/utility"

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Your Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
    isSignUp: true,
  };

  userInputHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      },
    };
    this.setState({ controls: updatedControls });
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp
    );
  };

  switchAuthHandler = () => {
    this.setState((prevState) => {
      return {
        isSignUp: !prevState.isSignUp,
      };
    });
  };

  render() {
    const formElementsArr = [];

    for (let key in this.state.controls) {
      formElementsArr.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = formElementsArr.map((formElement) => (
      <Input
        key={formElement.id}
        change={(event) => this.userInputHandler(event, formElement.id)}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        value={formElement.config.value}
      />
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }

    let error = null;

    if (this.props.error) {
      error = (
        <div style={{ textTransform: "capitalize" }}>
          {this.props.error.split("_").join(" ").toLowerCase()}
        </div>
      );
    }

    let authRedirect = !this.props.isAuthenticated ? null : this.props
        .isBuildInProcess ? (
      <Redirect to="/checkout" />
    ) : (
      <Redirect to="/" />
    );

    return (
      <div className={styles.Auth}>
        <h3>{this.state.isSignUp ? "SIGNUP" : "SIGN-IN"}</h3>
        {authRedirect}
        <form onSubmit={this.submitHandler}>
          {form}
          {error}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button btnType="Danger" click={this.switchAuthHandler}>
          SWITCH TO {this.state.isSignUp ? "SIGN-IN" : "SIGNUP"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    isBuildInProcess: state.burgerBuilder.buildInProcess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
