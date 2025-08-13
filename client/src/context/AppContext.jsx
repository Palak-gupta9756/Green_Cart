import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { dummyProducts } from "../assets/assets";
import { toast } from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth')
      if (data.success) {
        setIsSeller(true)
      } else {
        setIsSeller(false)
      }
    } catch (error) {
      setIsSeller(false)
    }
  }

  // fetch user auth status
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('api/user/is-auth');
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems)
      }
    } catch (error) {
      setUser(null)
    }
  }



  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list')
      if (data.success) {
        setProducts(data.products)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success('Added to Cart')
  }
  // update cart tem quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success('Cart updated')
  }
  //Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success('Removed from Cart')
    setCartItems(cartData);
  }
  {/* Get cart item count */ }
  const getCartCount = () => {
    let totalCount = 0;
    for (let item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items]
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  }

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, [])

  useEffect(() => {
  console.log("Cart update effect triggered");
  console.log("User in context:", user);
  console.log("Cart items in context:", cartItems);

  const updateCart = async () => {
    try {
      const payload = {
        userId: user?._id,
        cartItems
      };
      console.log("Sending payload to backend:", payload);

      const { data } = await axios.post('/api/cart/update', payload);
      console.log("Backend response:", data);

      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Cart update error:", error);
    }
  };

  if (user && user._id) {
    updateCart();
  }
}, [cartItems, user]);


  const value = { user, setUser, isSeller, setIsSeller, navigate, showUserLogin, setShowUserLogin, products, currency, addToCart, removeFromCart, updateCartItem, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems };

  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>
}

export const useAppContext = () => {
  return useContext(AppContext);
}