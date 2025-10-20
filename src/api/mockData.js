// This file acts as our in-memory "database" for development.
// In a real app, this data would come from a server.

// NOTE: Passwords are in plain text here ONLY for this mock setup.
// In a real database, they MUST be hashed.

export const mockUsers = [
    // A regular user/customer
    {
        id: 'user001',
        role: 'customer',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
    },
    // An admin user ex
    {
        id: 'admin001',
        role: 'admin',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'admin@thedailywag.com',
        password: 'AdminPassword123!',
    },
    // A doctor user
    {
        id: 'doc001',
        role: 'doctor',
        firstName: 'Dr. Emily',
        lastName: 'Carter',
        email: 'emily.carter@clinic.com',
        password: 'DoctorPassword123!',
    },
];