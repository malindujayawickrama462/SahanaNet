import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { getCart, removeFromCart, updateCartItem, clearCart, checkoutCart } from '../api/cartApi';
import { useAuth } from '../auth/AuthContext';

export default function CartPage() {
    const nav = useNavigate();
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState({});
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [redeemPoints, setRedeemPoints] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getCart();
            setCart(data.cart);
        } catch (err) {
            setError(err.message);
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (foodItemID) => {
        try {
            setUpdating(prev => ({ ...prev, [foodItemID]: true }));
            await removeFromCart(foodItemID);
            await fetchCart();
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(prev => ({ ...prev, [foodItemID]: false }));
        }
    };

    const handleUpdateQuantity = async (foodItemID, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            setUpdating(prev => ({ ...prev, [foodItemID]: true }));
            await updateCartItem(foodItemID, newQuantity);
            await fetchCart();
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(prev => ({ ...prev, [foodItemID]: false }));
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your cart?')) return;
        try {
            setLoading(true);
            await clearCart();
            setCart(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        if (!cart || cart.items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        try {
            setCheckoutLoading(true);
            setError('');
            const result = await checkoutCart(paymentMethod, redeemPoints);
            setOrderSuccess(result.order);
        } catch (err) {
            setError(err.message);
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10 flex items-center justify-center">
                <div className="max-w-md w-full space-y-6">
                    <Card title="Order Placed! ✅" subtitle="Your order has been submitted">
                        <div className="text-center py-8 space-y-6">
                            <div className="space-y-2">
                                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Order Token</p>
                                <p className="text-5xl font-black text-emerald-400">
                                    {orderSuccess.orderToken || orderSuccess.orderID}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1">
                                <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
                                <p className="text-lg font-bold text-slate-100">{orderSuccess.status}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <p className="text-xs text-slate-400">Total Amount</p>
                                <p className="text-2xl font-bold text-blue-400">Rs. {orderSuccess.totalPrice.toFixed(2)}</p>
                            </div>

                            <button
                                onClick={() => nav('/home')}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-lg transition"
                            >
                                Back to Home
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Shopping Cart</h1>
                        <p className="text-sm text-slate-400 mt-1">Logged in as {user?.email}</p>
                    </div>
                    <button
                        onClick={() => nav('/canteens')}
                        className="text-sm text-slate-300 hover:text-white transition"
                    >
                        ← Back to Canteens
                    </button>
                </div>

                {error && (
                    <Card>
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    </Card>
                )}

                {loading ? (
                    <Card>
                        <div className="py-12 text-center text-slate-400">
                            <p>Loading your cart...</p>
                        </div>
                    </Card>
                ) : !cart || cart.items.length === 0 ? (
                    <Card title="Your Cart is Empty 🛒">
                        <div className="py-12 text-center space-y-4">
                            <p className="text-slate-400">No items in your cart yet.</p>
                            <button
                                onClick={() => nav('/canteens')}
                                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 px-6 rounded-lg transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card title="Items in Cart" subtitle={`${cart.items.length} item(s)`}>
                                <div className="space-y-3">
                                    {cart.items.map(item => (
                                        <div key={item.foodItem} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition">
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-100">{item.name}</p>
                                                <p className="text-sm text-slate-400">Rs. {item.price} per item</p>
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="mt-2 h-20 w-20 rounded object-cover"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <div className="flex items-center border border-slate-600 rounded-lg">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.foodItem, item.quantity - 1)}
                                                        disabled={updating[item.foodItem] || item.quantity <= 1}
                                                        className="px-2 py-1 text-slate-400 hover:text-slate-200 transition disabled:opacity-50"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-4 py-1 text-slate-200 font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.foodItem, item.quantity + 1)}
                                                        disabled={updating[item.foodItem]}
                                                        className="px-2 py-1 text-slate-400 hover:text-slate-200 transition disabled:opacity-50"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="font-bold text-emerald-400">
                                                        Rs. {(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.foodItem)}
                                                    disabled={updating[item.foodItem]}
                                                    className="text-red-400 hover:text-red-300 transition text-lg disabled:opacity-50 ml-2"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Canteen">
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-400">Canteen</p>
                                    <p className="text-lg font-bold text-slate-100">{cart.canteen?.name}</p>
                                    {cart.canteen?.location && (
                                        <p className="text-sm text-slate-400">📍 {cart.canteen.location}</p>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Checkout Sidebar */}
                        <div className="space-y-6">
                            <Card title="Order Summary">
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                        <p className="text-sm text-slate-400 mb-3">Subtotal</p>
                                        <p className="text-2xl font-bold text-slate-100">
                                            Rs. {cart.totalPrice.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Loyalty Points Redemption */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-300">Redeem Loyalty Points</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                value={redeemPoints}
                                                onChange={(e) => setRedeemPoints(Math.max(0, parseInt(e.target.value) || 0))}
                                                placeholder="Points to redeem"
                                                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                                            />
                                            <span className="text-xs text-slate-400 py-2 px-3">
                                                ({Math.min(redeemPoints, cart.totalPrice)} LKR)
                                            </span>
                                        </div>
                                    </div>

                                    {/* Final Total */}
                                    <div className="border-t border-slate-700 pt-3 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Final Total:</span>
                                            <span className="font-bold text-emerald-400 text-lg">
                                                Rs. {Math.max(0, cart.totalPrice - redeemPoints).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-300">Payment Method</label>
                                        <div className="space-y-2">
                                            {['Cash', 'Card', 'Wallet'].map(method => (
                                                <label key={method} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:border-slate-600/50 transition">
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value={method}
                                                        checked={paymentMethod === method}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm font-bold text-slate-200">
                                                        {method === 'Cash' && '💵 Cash'}
                                                        {method === 'Card' && '💳 Card'}
                                                        {method === 'Wallet' && '👛 Wallet'}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={checkoutLoading || !cart.items.length}
                                        className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {checkoutLoading ? 'Processing...' : 'Place Order'}
                                    </button>

                                    {/* Clear Cart Button */}
                                    <button
                                        onClick={handleClearCart}
                                        disabled={checkoutLoading}
                                        className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-lg transition disabled:opacity-50"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </Card>

                            <Card title="ℹ️ Information">
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    All prices are in Sri Lankan Rupees (LKR). 1 loyalty point = 1 LKR discount. Your cart is specific to the selected canteen.
                                </p>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
