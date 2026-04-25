import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../api/cartApi';

export default function CartMini() {
    const nav = useNavigate();
    const [itemCount, setItemCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCartCount();
        // Refresh cart count every 5 seconds
        const interval = setInterval(fetchCartCount, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchCartCount = async () => {
        try {
            const data = await getCart();
            if (data.cart && data.cart.items) {
                const count = data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
                setItemCount(count);
            }
        } catch (err) {
            setItemCount(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={() => nav('/cart')}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition group"
            title="View Cart"
        >
            <span className="text-xl group-hover:scale-110 transition">🛒</span>
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    );
}
