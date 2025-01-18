// getRole.ts
import { auth } from '@/lib/firebase'; // Adjust this import based on your firebase config location
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface UserRole {
  role: string;
  error?: string;
}

export const getRole = async (): Promise<UserRole> => {
  try {
    // Get current authenticated user
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      return {
        role: '',
        error: 'No authenticated user found'
      };
    }

    // Query Firestore for user with matching email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', currentUser.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        role: '',
        error: 'User not found in database'
      };
    }

    // Get the first matching document (there should only be one)
    const userData = querySnapshot.docs[0].data();

    return {
      role: userData.role || ''
    };

  } catch (error) {
    console.error('Error getting user role:', error);
    return {
      role: '',
      error: 'Error fetching user role'
    };
  }
};

// Optional: Add role type guard
export const isValidRole = (role: string): boolean => {
  const validRoles = ['admin', 'co-admin', 'floor1', 'floor2', 'floor3', 'floor4'];
  return validRoles.includes(role.toLowerCase());
};