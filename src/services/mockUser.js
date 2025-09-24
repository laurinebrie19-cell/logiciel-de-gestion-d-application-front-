export const mockUsers = [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
  },
  {
    id: 3,
    firstName: "Pierre",
    lastName: "Bernard",
    email: "pierre.bernard@example.com",
    role: "manager",
    status: "inactive",
    createdAt: "2024-01-25",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
  },
];

export const mockStats = {
  totalUsers: 200,
  activeUsers: 150,
  inactiveUsers: 50,
};
