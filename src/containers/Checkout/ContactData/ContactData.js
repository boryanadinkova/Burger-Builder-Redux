import React, { Component } from "react";
import axios from "../../../axios-orders";
import { connect } from "react-redux";
import styles from "./ContactData.module.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as burgerBuilderActions from "../../../store/actions/index";
import { checkValidity } from "../../../shared/utility";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false,
      },
      address: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Str No",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
        },
        valid: false,
        touched: false,
      },
      city: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "City",
        },
        value: "",
        validation: {
          required: true,
          minLength: 3,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        value: "fastest",
        validation: {},
        valid: true,
      },
    },
    formIsValid: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let key in this.state.orderForm) {
      formData[key] = this.state.orderForm[key].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      userDetails: formData,
      userId: this.props.userId
    };
    this.props.onPurchaseBurgerStart(order, this.props.token);
  };

  userInputHandler = (event, inputIdentifier) => {
    // clone OrderFrom
    const clonedOrderForm = {
      ...this.state.orderForm,
    };
    // deep copy OrderForm
    const clonedOrderFormElement = { ...clonedOrderForm[inputIdentifier] };
    // set old input value equal to onChange value
    clonedOrderFormElement.value = event.target.value;
    // check if input is valid - checkValidity will return true/false
    clonedOrderFormElement.valid = checkValidity(
      clonedOrderFormElement.value,
      clonedOrderFormElement.validation
    );
    clonedOrderFormElement.touched = true;
    // merge updated value
    clonedOrderForm[inputIdentifier] = clonedOrderFormElement;

    let formIsValid = true;

    // set valid property for all elements in the form object
    for (let inputIdentifier in clonedOrderForm) {
      formIsValid = clonedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ orderForm: clonedOrderForm, formIsValid: formIsValid });
  };

  render() {
    const formElementsArr = [];

    for (let key in this.state.orderForm) {
      formElementsArr.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArr.map((formElement) => (
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
        ))}
        <Button
          btnType="Success"
          click={this.orderHandler}
          disabled={!this.state.formIsValid}
        >
          ORDER
        </Button>
        {/* <Button btnType="Danger" click={this.props.history.push('/')}>CANCEL</Button> */}
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />;
    }

    return (
      <div className={styles.ContactData}>
        <h4>Contact info</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.localId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPurchaseBurgerStart: (orderData, token) => {
      dispatch(burgerBuilderActions.purchaseBurger(orderData, token));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
