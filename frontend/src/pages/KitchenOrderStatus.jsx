import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KitchenOrderStatus() {
    const nav = useNavigate();
    const [canteen, setCanteen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('summary');

    const [summary, setSummary] = useState({
        inQueue: 0,
        cooking: 0,
        ready: 0,
        delivered: 0
    });

    const [queueOrders, setQueueOrders] = useState([]);
    const [cookingOrders, setCookingOrders] = useState([]);
    const [readyOrders, setReadyOrders] = useState([]);
    const [deliveredOrders, setDeliveredOrders] = useState([]);

    useEffect(() => {
        fetchStaffCanteen();
    }, []);

    useEffect(() => {
        if (canteen) {
            loadAllData(canteen._id);
            // Refresh every 10 seconds
            const interval = setInterval(() => loadAllData(canteen._id), 10000);
            return () => clearInterval(interval);
        }
    }, [canteen]);

    const fetchStaffCanteen = async () => {
        try {
            const res = await fetch("/api/canteen/staff/my-canteen", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}` }
            });
            if (!res.ok) throw new Error("Could not find assigned canteen");
            const data = await res.json();
            setCanteen(data);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const loadAllData = async (canteenId) => {
        try {
            const token = localStorage.getItem("smartqueue_token");
            const headers = { "Authorization": `Bearer ${token}` };

            // Load Summary
            const summaryRes = await fetch(
                `/api/order/status/${canteenId}/summary`,
                { headers }
            );
            const summaryData = await summaryRes.json();
            setSummary(summaryData.summary);

            // Load Queue
            const queueRes = await fetch(
                `/api/order/queue/${canteenId}/fcfs`,
                { headers }
            );
            const queueData = await queueRes.json();
            setQueueOrders(queueData.queue);

            // Load Cooking
            const cookingRes = await fetch(
                `/api/order/status/${canteenId}/cooking`,
                { headers }
            );
            const cookingData = await cookingRes.json();
            setCookingOrders(cookingData.orders);

            // Load Ready
            const readyRes = await fetch(
                `/api/order/status/${canteenId}/ready`,
                { headers }
            );
            const readyData = await readyRes.json();
            setReadyOrders(readyData.orders);

            // Load Delivered
            const deliveredRes = await fetch(
                `/api/order/status/${canteenId}/delivered`,
                { headers }
            );
            const deliveredData = await deliveredRes.json();
            setDeliveredOrders(deliveredData.orders);

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleStartCooking = async (orderId) => {
        try {
            const token = localStorage.getItem("smartqueue_token");
            const res = await fetch(`/api/order/${orderId}/start-cooking`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.ok) {
                if (canteen) loadAllData(canteen._id);
            }
        } catch (err) {
            alert("Error starting cooking: " + err.message);
        }
    };

    const handleMarkReady = async (orderId) => {
        try {
            const token = localStorage.getItem("smartqueue_token");
            const res = await fetch(`/api/order/status`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    orderID: orderId,
                    status: 'Ready'
                })
            });
            if (res.ok) {
                if (canteen) loadAllData(canteen._id);
            }
        } catch (err) {
            alert("Error marking ready: " + err.message);
        }
    };

    const handleMarkDelivered = async (orderId) => {
        try {
            const token = localStorage.getItem("smartqueue_token");
            const res = await fetch(`/api/order/status`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    orderID: orderId,
                    status: 'Completed'
                })
            });
            if (res.ok) {
                if (canteen) loadAllData(canteen._id);
            }
        } catch (err) {
            alert("Error marking delivered: " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center text-slate-400">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                    Loading Order Status Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white">{canteen?.name}</h1>
                        <p className="text-sm text-slate-400 uppercase font-bold tracking-widest mt-1">Order Status & Queue Management</p>
                    </div>
                    <button
                        onClick={() => nav('/kitchen')}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
                    >
                        ← Back to Kitchen
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black text-blue-400">{summary.inQueue}</div>
                        <div className="text-xs uppercase font-bold text-blue-300 mt-2">In Queue (FCFS)</div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black text-orange-400">{summary.cooking}</div>
                        <div className="text-xs uppercase font-bold text-orange-300 mt-2">Now Cooking</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black text-green-400">{summary.ready}</div>
                        <div className="text-xs uppercase font-bold text-green-300 mt-2">Ready for Pickup</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black text-purple-400">{summary.delivered}</div>
                        <div className="text-xs uppercase font-bold text-purple-300 mt-2">Delivered Today</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-800">
                    {[
                        { id: 'summary', label: 'Summary', icon: '📊' },
                        { id: 'queue', label: 'Queue (FCFS)', icon: '⏳', count: summary.inQueue },
                        { id: 'cooking', label: 'Cooking', icon: '🍳', count: summary.cooking },
                        { id: 'ready', label: 'Ready', icon: '✅', count: summary.ready },
                        { id: 'delivered', label: 'Delivered', icon: '📦', count: summary.delivered }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 font-bold border-b-2 transition-all ${
                                activeTab === tab.id
                                    ? 'border-sky-500 text-sky-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            {tab.icon} {tab.label} {tab.count !== undefined && <span className="ml-2 bg-slate-700 px-2 rounded">{tab.count}</span>}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'summary' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-4 text-blue-400">📊 Queue Overview</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Orders in Queue:</span>
                                        <span className="font-bold text-blue-400">{summary.inQueue}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Currently Cooking:</span>
                                        <span className="font-bold text-orange-400">{summary.cooking}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ready for Pickup:</span>
                                        <span className="font-bold text-green-400">{summary.ready}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivered Today:</span>
                                        <span className="font-bold text-purple-400">{summary.delivered}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-4 text-green-400">✨ Quick Stats</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Orders Today:</span>
                                        <span className="font-bold">{summary.inQueue + summary.cooking + summary.ready + summary.delivered}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Completion Rate:</span>
                                        <span className="font-bold text-green-400">
                                            {summary.delivered + summary.ready > 0
                                                ? Math.round((summary.delivered / (summary.inQueue + summary.cooking + summary.ready + summary.delivered)) * 100) + '%'
                                                : '0%'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'queue' && (
                        <div className="space-y-4">
                            {queueOrders.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">No orders in queue</div>
                            ) : (
                                queueOrders.map((order, index) => (
                                    <div
                                        key={order._id}
                                        className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4 flex justify-between items-start"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{order.orderID} - {order.orderToken}</p>
                                                    <p className="text-sm text-slate-400">{order.student?.name || 'Unknown'}</p>
                                                    <div className="text-xs text-slate-500 mt-1">
                                                        {order.items.map((item, i) => (
                                                            <span key={i}>{item.quantity}x {item.name}{i < order.items.length - 1 ? ', ' : ''}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleStartCooking(order._id)}
                                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded transition-all"
                                        >
                                            Start Cooking
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'cooking' && (
                        <div className="space-y-4">
                            {cookingOrders.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">No orders cooking</div>
                            ) : (
                                cookingOrders.map(order => (
                                    <div
                                        key={order._id}
                                        className="bg-orange-500/5 border border-orange-500/30 rounded-lg p-4 flex justify-between items-start"
                                    >
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{order.orderID} - {order.orderToken}</p>
                                            <p className="text-sm text-slate-400">{order.student?.name || 'Unknown'}</p>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {order.items.map((item, i) => (
                                                    <span key={i}>{item.quantity}x {item.name}{i < order.items.length - 1 ? ', ' : ''}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleMarkReady(order._id)}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded transition-all"
                                        >
                                            Mark Ready
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'ready' && (
                        <div className="space-y-4">
                            {readyOrders.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">No orders ready</div>
                            ) : (
                                readyOrders.map(order => (
                                    <div
                                        key={order._id}
                                        className="bg-green-500/5 border border-green-500/30 rounded-lg p-4 flex justify-between items-start"
                                    >
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{order.orderID} - {order.orderToken}</p>
                                            <p className="text-sm text-slate-400">{order.student?.name || 'Unknown'}</p>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {order.items.map((item, i) => (
                                                    <span key={i}>{item.quantity}x {item.name}{i < order.items.length - 1 ? ', ' : ''}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleMarkDelivered(order._id)}
                                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded transition-all"
                                        >
                                            Delivered
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'delivered' && (
                        <div className="space-y-4">
                            {deliveredOrders.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">No orders delivered today</div>
                            ) : (
                                deliveredOrders.map(order => (
                                    <div
                                        key={order._id}
                                        className="bg-purple-500/5 border border-purple-500/30 rounded-lg p-4"
                                    >
                                        <p className="font-bold text-white">{order.orderID} - {order.orderToken}</p>
                                        <p className="text-sm text-slate-400">{order.student?.name || 'Unknown'}</p>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {order.items.map((item, i) => (
                                                <span key={i}>{item.quantity}x {item.name}{i < order.items.length - 1 ? ', ' : ''}</span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-green-400 mt-2">✅ Completed</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
