import React from 'react';
import './PasswordCriteria.css'; // We'll create this for styling

const PasswordCriteria = ({ criteria }) => {
    const criteriaList = [
        { name: 'length', text: 'At least 8 characters long' },
        { name: 'uppercase', text: 'At least one uppercase letter' },
        { name: 'number', text: 'At least one number' },
        { name: 'specialChar', text: 'At least one special character' },
    ];

    return (
        <ul className="password-criteria">
            {criteriaList.map((item) => (
                <li key={item.name} className={criteria[item.name] ? 'valid' : ''}>
                    {criteria[item.name] ? '✓' : '◦'} {item.text}
                </li>
            ))}
        </ul>
    );
};

export default PasswordCriteria;