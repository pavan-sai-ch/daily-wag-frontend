import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/authService.js';
import './AdminTables.css'; // Reuse the shared table styles

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                alert("Failed to load users.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) return <p>Loading users...</p>;

    return (
        <div className="admin-table-container">
            <h2>User Management</h2>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                </tr>
                </thead>
                <tbody>
                {users.length === 0 ? (
                    <tr><td colSpan="6" className="empty-cell">No users found.</td></tr>
                ) : (
                    users.map(user => (
                        <tr key={user.user_id}>
                            <td>#{user.user_id}</td>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone || '-'}</td>
                            <td>
                                {/* Apply style based on role */}
                                <span className={`type-badge role-${user.role}`}>
                                        {user.role}
                                    </span>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;