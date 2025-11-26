import React, { useState, useEffect } from 'react';
import api from '../../api/api.js'; // We'll use raw api calls for simplicity here
import './AdminTables.css'; // Reuse your table styles

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [orderItems, setOrderItems] = useState({}); // Cache for fetched items

    // Fetch all orders
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/orders/all');
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Fetch items for a specific order when "View Items" is clicked
    const handleViewItems = async (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null); // Collapse if already open
            return;
        }

        setExpandedOrderId(orderId);

        if (!orderItems[orderId]) {
            try {
                const response = await api.get(`/orders/${orderId}/items`);
                setOrderItems(prev => ({ ...prev, [orderId]: response.data }));
            } catch (error) {
                console.error("Failed to fetch items:", error);
            }
        }
    };

    // Update Order Status
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            // Optimistically update UI
            setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert("Failed to update status.");
        }
    };

    if (isLoading) return <p>Loading orders...</p>;

    return (
        <div className="admin-table-container">
            <h2>Manage Store Orders</h2>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.length === 0 ? (
                    <tr><td colSpan="7" className="empty-cell">No orders found.</td></tr>
                ) : (
                    orders.map(order => (
                        <React.Fragment key={order.order_id}>
                            <tr>
                                <td>#{order.order_id}</td>
                                <td>{order.first_name} {order.last_name}<br/><small>{order.email}</small></td>
                                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                <td>${order.grand_total}</td>
                                <td><span className="type-badge">{order.delivery_type}</span></td>
                                <td>
                                        <span className={`status-pill ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                </td>
                                <td className="actions-cell">
                                    <button className="action-btn view" onClick={() => handleViewItems(order.order_id)}>
                                        {expandedOrderId === order.order_id ? 'Hide' : 'View'} Items
                                    </button>

                                    {/* Status Controls */}
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>

                            {/* Expandable Row for Order Items */}
                            {expandedOrderId === order.order_id && (
                                <tr className="expanded-row">
                                    <td colSpan="7">
                                        <div className="order-items-detail">
                                            <h4>Items in Order #{order.order_id}</h4>
                                            {orderItems[order.order_id] ? (
                                                <ul>
                                                    {orderItems[order.order_id].map(item => (
                                                        <li key={item.order_item_id}>
                                                            {item.quantity}x <strong>{item.item_name}</strong>
                                                            - ${item.price_at_purchase} each
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>Loading items...</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderManagement;