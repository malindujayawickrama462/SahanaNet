import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkoutCart
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authenticate.js";

const cartRouter = express.Router();

// All cart routes require authentication
cartRouter.get("/", authenticate, getCart);
cartRouter.post("/add", authenticate, addToCart);
cartRouter.put("/update", authenticate, updateCartItem);
cartRouter.delete("/remove", authenticate, removeFromCart);
cartRouter.delete("/clear", authenticate, clearCart);
cartRouter.post("/checkout", authenticate, checkoutCart);

export default cartRouter;
