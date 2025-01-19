'use client'

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserData {
  email: string;
  name: string;
  role: string;
  level: number;
  children: string[];
  department: string;
}

interface UsersState {
  [key: string]: UserData;
}

const HorizontalOrgChart: React.FC = () => {
  const [users, setUsers] = useState<UsersState>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const usersData: UsersState = {};
        
        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          usersData[doc.id] = {
            email: userData.email,
            name: userData.Name,
            role: userData.role,
            level: calculateLevel(userData.role),
            children: [],
            department: getDepartmentFromRole(userData.role)
          };
        });

        organizeHierarchy(usersData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const calculateLevel = (role: string): number => {
    const roleHierarchy: { [key: string]: number } = {
      'admin': 1,
      'co-admin': 2,
      'floor1': 3,
      'floor2': 3,
      'floor3': 3,
      'floor4': 3,
    
    };
    return roleHierarchy[role.toLowerCase()] || 4;
  };

  const getDepartmentFromRole = (role: string): string => {
    const roleDepartments: { [key: string]: string } = {
      'admin': 'Executive',
      'co-admin': 'Management',
      'floor1': 'Floor 1',
      'floor2': 'Floor 2',
      'floor3': 'Floor 3',
      'floor4': 'Floor 4',
      'employee': 'Staff'
    };
    return roleDepartments[role.toLowerCase()] || 'General';
  };

  const organizeHierarchy = (usersData: UsersState): void => {
    const assignChildren = () => {
      // Sort users by level to ensure proper hierarchy
      const sortedUsers = Object.entries(usersData)
        .sort(([, a], [, b]) => a.level - b.level);
      
      for (const [userId, user] of sortedUsers) {
        if (user.role.toLowerCase() !== 'admin') {
          const potentialManager = findManager(usersData, user.level, user.role);
          if (potentialManager) {
            usersData[potentialManager].children.push(userId);
          }
        }
      }
    };

    const findManager = (users: UsersState, userLevel: number, userRole: string): string | undefined => {
      // Find manager based on level and department matching
      return Object.keys(users).find(id => {
        const manager = users[id];
        const isCorrectLevel = manager.level === userLevel - 1;
        const hasCapacity = manager.children.length < 4; // Increased capacity
        
        // Match floor managers with their respective employees
        if (userRole.toLowerCase().startsWith('floor')) {
          return isCorrectLevel && manager.role.toLowerCase() === 'co-admin' && hasCapacity;
        }
        
        return isCorrectLevel && hasCapacity;
      });
    };

    assignChildren();
  };

  const handleUserClick = (userId: string): void => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  const UserCard: React.FC<{ userId: string }> = ({ userId }) => {
    const user = users[userId];
    const getLevelColor = (role: string) => {
      const colors: { [key: string]: string } = {
        'admin': 'from-purple-600 to-blue-600',
        'co-admin': 'from-blue-600 to-cyan-600',
        'floor1': 'from-emerald-600 to-teal-600',
        'floor2': 'from-teal-600 to-cyan-600',
        'floor3': 'from-cyan-600 to-blue-600',
        'floor4': 'from-blue-600 to-indigo-600',
        'employee': 'from-indigo-600 to-violet-600'
      };
      return colors[role.toLowerCase()] || 'from-gray-600 to-slate-600';
    };

    return (
      <div 
        className="relative p-4 rounded-lg w-[250px] cursor-pointer bg-gray-900 
          hover:bg-gray-800 shadow-lg transition-all border border-gray-700 hover:border-gray-600"
        onClick={() => handleUserClick(userId)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getLevelColor(user.role)} 
            flex items-center justify-center text-white shadow-inner`}>
            <User size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-100 truncate">{user.name}</div>
            <div className="text-sm text-gray-400 truncate">{user.email}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderBranch = (userId: string): JSX.Element => {
    const user = users[userId];
    
    return (
      <div className="flex flex-col items-center">
        <UserCard userId={userId} />
        {user.children.length > 0 && (
          <>
            <div className="w-px h-16 bg-gray-700" />
            <div className="relative">
              <div className="absolute top-0 left-1/2 w-full h-px bg-gray-700 -translate-x-1/2" />
              <div className="flex gap-16 pt-16">
                {user.children.map((childId) => (
                  <div key={childId} className="flex flex-col items-center">
                    {renderBranch(childId)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-100">
        Loading...
      </div>
    );
  }

  const rootUser = Object.keys(users).find(id => users[id].role.toLowerCase() === 'admin');
  if (!rootUser) {
    return <div className="text-gray-100">No admin user found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-20 ">
      <div className="flex-1">
        <div className="w-full h-full overflow-x-auto overflow-y-auto">
          <div className="min-w-max min-h-full flex items-start justify-center pt-8 pb-16">
            {renderBranch(rootUser)}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        scrollBehavior="inside"
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-3 items-center dark:bg-gray-900 dark:text-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">User Details</h2>
                  {selectedUser && 
                    <p className="text-sm text-gray-400">{users[selectedUser].name}</p>
                  }
                </div>
              </ModalHeader>
              {selectedUser && (
                <ModalBody className="px-6 dark:bg-gray-900">
                  <div className="space-y-6">
                    <div className="grid gap-y-4">
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg dark:bg-gray-800">
                        <span className="font-medium dark:text-gray-300">Name:</span>
                        <span className="col-span-2 dark:text-gray-100">{users[selectedUser].name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg dark:bg-gray-800">
                        <span className="font-medium dark:text-gray-300">Email:</span>
                        <span className="col-span-2 dark:text-gray-100">{users[selectedUser].email}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg dark:bg-gray-800">
                        <span className="font-medium dark:text-gray-300">Role:</span>
                        <span className="col-span-2 dark:text-gray-100">{users[selectedUser].role}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg dark:bg-gray-800">
                        <span className="font-medium dark:text-gray-300">Department:</span>
                        <span className="col-span-2 dark:text-gray-100">{users[selectedUser].department}</span>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              )}
              <ModalFooter className="dark:bg-gray-900">
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                  className="w-full dark:text-gray-100"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default HorizontalOrgChart;