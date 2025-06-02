// Mock data and helper functions for tests

const mockUsers = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    password_hash: '$2b$10$K8eZXJ9.wKQx8Jz9vKqZEuJvB2K8xJqZJ9wKQx8Jz9vKqZEuJvB2K8',
    created_at: new Date('2024-01-01T10:00:00Z'),
    deleted_at: null
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@example.com',
    password_hash: '$2b$10$K8eZXJ9.wKQx8Jz9vKqZEuJvB2K8xJqZJ9wKQx8Jz9vKqZEuJvB2K8',
    created_at: new Date('2024-01-02T10:00:00Z'),
    deleted_at: null
  }
];

const mockTasks = [
  {
    id: 1,
    title: 'Implementar autenticação',
    description: 'Criar sistema de login e logout',
    assignedTo: 1,
    status: 'pendente',
    created_at: new Date('2024-01-01T10:00:00Z'),
    updated_at: new Date('2024-01-01T10:00:00Z'),
    deleted_at: null
  },
  {
    id: 2,
    title: 'Criar testes unitários',
    description: 'Escrever testes para todos os módulos',
    assignedTo: 2,
    status: 'em_progresso',
    created_at: new Date('2024-01-02T10:00:00Z'),
    updated_at: new Date('2024-01-02T10:00:00Z'),
    deleted_at: null
  }
];

// Helper function to get mock user by email
function getMockUserByEmail(email) {
  return mockUsers.find(user => user.email === email && !user.deleted_at);
}

// Helper function to get mock user by id
function getMockUserById(id) {
  return mockUsers.find(user => user.id === parseInt(id) && !user.deleted_at);
}

// Helper function to get mock task by id
function getMockTaskById(id) {
  return mockTasks.find(task => task.id === parseInt(id) && !task.deleted_at);
}

// Helper function to get mock tasks by assigned user
function getMockTasksByUser(userId) {
  return mockTasks.filter(task => task.assignedTo === parseInt(userId) && !task.deleted_at);
}

// Helper function to create a new mock user
function createMockUser(name, email, passwordHash) {
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    password_hash: passwordHash,
    created_at: new Date(),
    deleted_at: null
  };
  mockUsers.push(newUser);
  return newUser;
}

// Helper function to create a new mock task
function createMockTask(title, description, assignedTo, createdBy) {
  const newTask = {
    id: mockTasks.length + 1,
    title,
    description,
    assignedTo: parseInt(assignedTo),
    status: 'pendente',
    created_by: parseInt(createdBy),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null
  };
  mockTasks.push(newTask);
  return newTask;
}

// Function to reset mock data
function resetMockData() {
  mockUsers.length = 0;
  mockTasks.length = 0;
  mockUsers.push(...[
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      password_hash: '$2b$10$K8eZXJ9.wKQx8Jz9vKqZEuJvB2K8xJqZJ9wKQx8Jz9vKqZEuJvB2K8',
      created_at: new Date('2024-01-01T10:00:00Z'),
      deleted_at: null
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@example.com',
      password_hash: '$2b$10$K8eZXJ9.wKQx8Jz9vKqZEuJvB2K8xJqZJ9wKQx8Jz9vKqZEuJvB2K8',
      created_at: new Date('2024-01-02T10:00:00Z'),
      deleted_at: null
    }
  ]);
  mockTasks.push(...[
    {
      id: 1,
      title: 'Implementar autenticação',
      description: 'Criar sistema de login e logout',
      assignedTo: 1,
      status: 'pendente',
      created_at: new Date('2024-01-01T10:00:00Z'),
      updated_at: new Date('2024-01-01T10:00:00Z'),
      deleted_at: null
    },
    {
      id: 2,
      title: 'Criar testes unitários',
      description: 'Escrever testes para todos os módulos',
      assignedTo: 2,
      status: 'em_progresso',
      created_at: new Date('2024-01-02T10:00:00Z'),
      updated_at: new Date('2024-01-02T10:00:00Z'),
      deleted_at: null
    }
  ]);
}

module.exports = {
  mockUsers,
  mockTasks,
  getMockUserByEmail,
  getMockUserById,
  getMockTaskById,
  getMockTasksByUser,
  createMockUser,
  createMockTask,
  resetMockData
};
