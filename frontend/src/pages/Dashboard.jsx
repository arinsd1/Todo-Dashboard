import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiLogOut,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiX,
  FiSave,
} from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: '',
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, filterStatus, filterPriority]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data.tasks);
      calculateStats(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList) => {
    const stats = {
      total: taskList.length,
      pending: taskList.filter(t => t.status === 'pending').length,
      inProgress: taskList.filter(t => t.status === 'in-progress').length,
      completed: taskList.filter(t => t.status === 'completed').length,
    };
    setStats(stats);
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (searchTerm) {
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...taskForm,
        tags: taskForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }

      fetchTasks();
      resetTaskForm();
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      tags: task.tags.join(', '),
    });
    setShowTaskModal(true);
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      tags: '',
    });
    setEditingTask(null);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { updateProfile } = useAuth();
      await updateProfile(profileForm);
      setShowProfileModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', icon: FiClock, text: 'Pending' },
      'in-progress': { class: 'badge-info', icon: FiAlertCircle, text: 'In Progress' },
      completed: { class: 'badge-success', icon: FiCheckCircle, text: 'Completed' },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`badge ${badge.class} flex items-center gap-1`}>
        <Icon className="text-xs" />
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: { class: 'badge-info', text: 'Low' },
      medium: { class: 'badge-warning', text: 'Medium' },
      high: { class: 'badge-danger', text: 'High' },
    };
    const badge = badges[priority];
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-dark-700/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Primetrade Dashboard</h1>
              <p className="text-dark-400 text-sm mt-1">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-dark-700/50 hover:bg-dark-600/50 rounded-lg transition-all"
              >
                <FiUser />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
              >
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 hover:shadow-primary-500/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-semibold">Total Tasks</p>
                <p className="text-4xl font-bold gradient-text mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-primary-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-yellow-500/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-semibold">Pending</p>
                <p className="text-4xl font-bold text-yellow-400 mt-2">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <FiClock className="text-yellow-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-blue-500/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-semibold">In Progress</p>
                <p className="text-4xl font-bold text-blue-400 mt-2">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FiAlertCircle className="text-blue-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-green-500/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-semibold">Completed</p>
                <p className="text-4xl font-bold text-green-400 mt-2">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-green-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-11 w-full"
              />
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input pl-11 pr-10 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="input pl-11 pr-10 appearance-none cursor-pointer"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button
                onClick={() => {
                  resetTaskForm();
                  setShowTaskModal(true);
                }}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <FiPlus />
                <span className="hidden sm:inline">New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner w-16 h-16"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="card p-12 text-center">
            <FiAlertCircle className="text-6xl text-dark-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark-300 mb-2">No tasks found</h3>
            <p className="text-dark-400 mb-6">Create your first task to get started!</p>
            <button
              onClick={() => {
                resetTaskForm();
                setShowTaskModal(true);
              }}
              className="btn-primary"
            >
              <FiPlus className="inline mr-2" />
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task._id} className="card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-dark-100 mb-2">{task.title}</h3>
                    <p className="text-dark-400 text-sm line-clamp-2">{task.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 rounded-lg transition-all"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>

                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="badge badge-primary text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {task.dueDate && (
                  <div className="text-sm text-dark-400 flex items-center gap-2">
                    <FiClock className="text-xs" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  resetTaskForm();
                }}
                className="p-2 hover:bg-dark-700 rounded-lg transition-all"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-6">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="input"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  required
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="input min-h-[120px] resize-none"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                    className="input"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="label">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Due Date (Optional)</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Tags (comma separated)</label>
                <input
                  type="text"
                  value={taskForm.tags}
                  onChange={(e) => setTaskForm({ ...taskForm, tags: e.target.value })}
                  className="input"
                  placeholder="work, urgent, important"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  <FiSave className="inline mr-2" />
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskModal(false);
                    resetTaskForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">Edit Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-dark-700 rounded-lg transition-all"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-4xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="input min-h-[100px] resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input type="email" value={user?.email} disabled className="input opacity-50 cursor-not-allowed" />
                <p className="text-xs text-dark-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  <FiSave className="inline mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
