import { createContext, useState } from "react";
import { getProduct } from "./Store";

export const CartContext = createContext({
  items: [],
  getProductQuantity: () => {},
  addOneToCart: () => {},
  removeOneFromCart: () => {},
  deleteFromCart: () => {},
  getTotalCost: () => {},
  ids: [],
  addFavorites: (id) => {},
  removeFavorites: (id) => {},
});

export function CartProvider({ children }) {
  const [cartProduct, setCartProduct] = useState([]);
  const [favoritesId, setFavoritesId] = useState([]);

  function getProductQuantity(id) {
    const quantity = cartProduct.find((product) => product.id === id)?.quantity;
    if (quantity === undefined) {
      return 0;
    }
    return quantity;
  }
  function addFavorites(id) {
    setFavoritesId((curId) => [...curId, id]);
  }

  function removeFavorites(id) {
    setFavoritesId((curId) => curId.filter((favId) => favId !== id));
  }

  function addOneToCart(id) {
    const quantity = getProductQuantity(id);
    if (quantity === 0) {
      setCartProduct((prev) => [...prev, { id: id, quantity: 1 }]);
    } else {
      setCartProduct(
        cartProduct.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    }
  }

  function removeOneFromCart(id) {
    const quantity = getProductQuantity(id);

    if (quantity === 1) {
      deleteFromCart(id);
    } else {
      setCartProduct(
        cartProduct.map((prod) =>
          prod.id === id ? { ...prod, quantity: prod.quantity - 1 } : prod
        )
      );
    }
  }

  function deleteFromCart(id) {
    setCartProduct((cartProduct) =>
      cartProduct.filter((curProd) => curProd.id !== id)
    );
  }

  function getTotalCost() {
    let totalCost = 0;
    cartProduct.map((cart) => {
      const productData = getProduct(cart.id);
      totalCost += productData.price * cart.quantity;
    });

    return totalCost;
  }

  const value = {
    items: cartProduct,
    addOneToCart,
    removeOneFromCart,
    deleteFromCart,
    getTotalCost,
    getProductQuantity,
    addFavorites,
    removeFavorites,
    ids: favoritesId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
