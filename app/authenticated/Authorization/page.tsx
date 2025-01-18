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
      'manager': 'Management',
      'team_lead': 'Team Lead',
      'employee': 'Staff'
    };
    return roleDepartments[role.toLowerCase()] || 'General';
  };

  const organizeHierarchy = (usersData: UsersState): void => {
    const assignChildren = () => {
      Object.keys(usersData).forEach((userId) => {
        const user = usersData[userId];
        if (user.role.toLowerCase() !== 'admin') {
          const potentialManager = findManager(usersData, user.level);
          if (potentialManager) {
            usersData[potentialManager].children.push(userId);
          }
        }
      });
    };

    const findManager = (users: UsersState, userLevel: number): string | undefined => {
      return Object.keys(users).find(id => 
        users[id].level === userLevel - 1 && 
        users[id].children.length < 3
      );
    };

    assignChildren();
  };

  const handleUserClick = (userId: string): void => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  const UserCard: React.FC<{ userId: string }> = ({ userId }) => {
    const user = users[userId];

    return (
      <div 
        className="relative p-4 rounded-lg w-[250px] cursor-pointer bg-white dark:bg-gray-800
          hover:bg-blue-50 dark:hover:bg-blue-900/50 shadow-lg transition-all border border-gray-200 dark:border-gray-700"
        onClick={() => handleUserClick(userId)}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-inner">
            <User size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{user.name}</div>
            <div className="text-sm text-gray-500 truncate">{user.email}</div>
            <div className="text-xs text-gray-400">{user.role}</div>
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
            <div className="w-px h-16 bg-gray-300 dark:bg-gray-600" />
            <div className="relative">
              <div className="absolute top-0 left-1/2 w-full h-px bg-gray-300 dark:bg-gray-600 -translate-x-1/2" />
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const rootUser = Object.keys(users).find(id => users[id].role.toLowerCase() === 'admin');
  if (!rootUser) {
    return <div>No admin user found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-20">
      <div className="flex-1 p-8">
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
              <ModalHeader className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">User Details</h2>
                  {selectedUser && 
                    <p className="text-sm text-gray-500">{users[selectedUser].name}</p>
                  }
                </div>
              </ModalHeader>
              {selectedUser && (
                <ModalBody className="px-6">
                  <div className="space-y-6">
                    <div className="grid gap-y-4">
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <span className="font-medium">Name:</span>
                        <span className="col-span-2">{users[selectedUser].name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <span className="font-medium">Email:</span>
                        <span className="col-span-2">{users[selectedUser].email}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <span className="font-medium">Role:</span>
                        <span className="col-span-2">{users[selectedUser].role}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <span className="font-medium">Department:</span>
                        <span className="col-span-2">{users[selectedUser].department}</span>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              )}
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                  className="w-full"
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