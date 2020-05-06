export const EXECUTE_COMMAND = 'EXECUTE_COMMAND';

const executeCommandAction = (command, state) => {


    const updatedCart = [...state.cart];
    const updatedItemIndex = updatedCart.findIndex(
      item => item.id === product.id
    );
  
    if (updatedItemIndex < 0) {
      updatedCart.push({ ...product, quantity: 1 });
    } else {
      const updatedItem = {
        ...updatedCart[updatedItemIndex]
      };
      updatedItem.quantity++;
      updatedCart[updatedItemIndex] = updatedItem;
    }
    return { ...state, cart: updatedCart };
  };
  
 
  export const botReducer = (state, action) => {
    switch (action.type) {
      case ADD_PRODUCT:
        return addProductToCart(action.product, state);
      case REMOVE_PRODUCT:
        return removeProductFromCart(action.productId, state);
      default:
        return state;
    }
  };