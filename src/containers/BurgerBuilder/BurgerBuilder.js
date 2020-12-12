import React, { Component } from "react";
import axios from "../../axios-orders";
import { connect } from "react-redux";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "./../../components/UI/Modal/Modal";
import OrderSummary from "./../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

class BurgerBuilder extends Component {
  state = {
    purchaseMode: false,
  };

  componentDidMount() {
    this.props.onLoadIngredients();
  }

  updatePurchaseState = () => {
    let itemsCount = Object.keys(this.props.ingredients).reduce(
      (sum, el) => sum + this.props.ingredients[el],
      0
    );

    return itemsCount > 0;
  };

  showOrderSummary = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchaseMode: true });
    }
    this.props.onSetRedirectPath("/checkout");
    this.props.history.push("/auth");
  };

  hideModalHandler = () => {
    this.setState({ purchaseMode: false });
  };

  continuePurchaseHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };

  render() {
    const disabledBtn = {
      ...this.props.ingredients,
    };
    for (let key in disabledBtn) {
      disabledBtn[key] = disabledBtn[key] <= 0;
    }

    let showOrderSummary = null;
    let burger = this.props.error ? (
      <p>Cannot load ingredients</p>
    ) : (
      <Spinner />
    );

    if (this.props.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ingredients} />
          <BuildControls
            isAuthenticated={this.props.isAuthenticated}
            addIngredient={this.props.onAddIngredient}
            removeIngredient={this.props.onRemoveIngredient}
            disabled={disabledBtn}
            totalPrice={this.props.price}
            purchasable={this.updatePurchaseState()}
            showModal={this.showOrderSummary}
          />
        </Aux>
      );

      showOrderSummary = (
        <OrderSummary
          ingredients={this.props.ingredients}
          close={this.hideModalHandler}
          continue={this.continuePurchaseHandler}
          totalPrice={this.props.price}
        />
      );
    }

    return (
      <Aux>
        <Modal show={this.state.purchaseMode} close={this.hideModalHandler}>
          {showOrderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddIngredient: (ingredientName) =>
      dispatch(actions.addIngredient(ingredientName)),
    onRemoveIngredient: (ingredientName) =>
      dispatch(actions.removeIngredient(ingredientName)),
    onLoadIngredients: () => dispatch(actions.loadIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetRedirectPath: (path) => dispatch(actions.redirectPathOnAuth(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
