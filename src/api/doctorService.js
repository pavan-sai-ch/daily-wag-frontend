// A mock list of doctors. In a real app, this would come from the database.
const mockDoctors = [
    { id: 'doc001', name: 'Dr. Emily Carter', specialization: 'General Vet' },
    { id: 'doc002', name: 'Dr. James Smith', specialization: 'Surgery' },
    { id: 'doc003', name: 'Dr. Alice Wong', specialization: 'Dermatology' },
];

/**
 * Simulates fetching a list of all available doctors.
 */
export const getDoctors = async () => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return mockDoctors;
};
