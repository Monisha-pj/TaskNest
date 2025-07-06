


import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TaskChart from '../components/TaskChart';

const STATUS_COLORS = {
  pending: '#FFD580',
  'in-progress': '#B2CFFF',
  completed: '#A8E6CF'
};

const STATUS_ICONS = {
  pending: <AccessTimeIcon color="warning" />,
  'in-progress': <AutorenewIcon color="primary" />,
  completed: <DoneIcon color="success" />
};

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', status: 'pending' });
  const [editTask, setEditTask] = useState(null);
  const [reminder, setReminder] = useState('');
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('none'); // asc, desc, none

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      alert('Token invalid or expired. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    tasks.forEach(task => {
      if (!task.dueDate || task.status === 'completed') return;
      const due = new Date(task.dueDate);
      if (
        due.toDateString() === today.toDateString() ||
        due.toDateString() === tomorrow.toDateString()
      ) {
        setReminder(`Reminder: Task "${task.title}" is due ${due.toDateString() === today.toDateString() ? 'today' : 'tomorrow'}!`);
      }
    });
  }, [tasks]);

  const handleNewTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', newTask);
      setTasks([res.data, ...tasks]);
      setNewTask({ title: '', description: '', dueDate: '', status: 'pending' });
      setAddFormVisible(false);
    } catch (err) {
      alert('Error adding task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
  };

  const handleEditSave = async () => {
    try {
      const res = await api.put(`/tasks/${editTask._id}`, editTask);
      setTasks(tasks.map(task => (task._id === editTask._id ? res.data : task)));
      setEditTask(null);
    } catch (err) {
      alert('Error editing task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/tasks/${id}`, { status });
      setTasks(tasks.map(task => (task._id === id ? res.data : task)));
    } catch (err) {
      alert('Error updating status');
    }
  };

  // 🧠 Filter and sort tasks
  const filteredSortedTasks = tasks
    .filter(task => statusFilter === 'all' || task.status === statusFilter)
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      } else if (sortOrder === 'desc') {
        return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
      }
      return 0;
    });

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Poppins' }}>
      Task progress
    </Typography>
    <Button
      variant="contained"
      onClick={() => setAddFormVisible(!addFormVisible)}
      sx={{ backgroundColor: '#B299FF', '&:hover': { backgroundColor: '#9F85FF' } }}
    >
      {addFormVisible ? 'Cancel' : '➕ Add New Task'}
    </Button>
  </Box>

      {addFormVisible && (
        <Paper sx={{ backgroundColor: '#FFF7E0', p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2} sx={{ fontWeight: 'bold', fontFamily: 'Poppins' }}>
            Create Task
          </Typography>
          <form onSubmit={handleAddTask}>
            <Box mb={2}>
              <TextField label="Title" name="title" fullWidth required value={newTask.title} onChange={handleNewTaskChange} />
            </Box>
            <Box mb={2}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                required
                multiline
                minRows={4}
                value={newTask.description}
                onChange={handleNewTaskChange}
              />
            </Box>
            <Box mb={2}>
              <TextField
                type="date"
                name="dueDate"
                label="Due Date"
                fullWidth
                value={newTask.dueDate}
                onChange={handleNewTaskChange}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#B299FF' }}>
              Add Task
            </Button>
          </form>
        </Paper>
      )}

      <Box mb={4}>
        {/* <Typography variant="h6" mb={2} sx={{ fontWeight: 'bold', fontFamily: 'Poppins' }}>
          Task Progress
        </Typography> */}
        <TaskChart tasks={tasks} />
      </Box>
<Typography variant="h6" mb={2} sx={{ fontWeight: 'bold', fontFamily: 'Poppins' }}>
        Task List
      </Typography>
      {/* Filter & Sort Controls */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select value={statusFilter} label="Status Filter" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort by Due Date</InputLabel>
          <Select value={sortOrder} label="Sort by Due Date" onChange={(e) => setSortOrder(e.target.value)}>
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Task List */}
      
      {filteredSortedTasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredSortedTasks.map((task) => (
            <Grid item xs={12} md={6} key={task._id}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  borderLeft: `6px solid ${STATUS_COLORS[task.status]}`,
                  position: 'relative',
                  width: 250,height:300
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold" fontFamily="Poppins" sx={{ color: '#333' }}>
                    {task.title}
                  </Typography>
                  <Box>{STATUS_ICONS[task.status]}</Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {task.description}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'No due date'}
                </Typography>

                <FormControl size="small" fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={task.status}
                    label="Status"
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>

                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditClick(task)}
                    sx={{ color: '#673AB7', borderColor: '#B39DDB' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(task._id)}
                    sx={{ color: '#D32F2F', borderColor: '#E57373' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Task Dialog */}
      <Dialog open={!!editTask} onClose={() => setEditTask(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={editTask?.title || ''}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            minRows={3}
            value={editTask?.description || ''}
            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Due Date"
            value={editTask?.dueDate || ''}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTask(null)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" sx={{ backgroundColor: '#9F85FF' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reminder Snackbar */}
      <Snackbar open={!!reminder} autoHideDuration={4000} onClose={() => setReminder('')}>
        <Alert severity="warning" onClose={() => setReminder('')}>
          {reminder}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Dashboard;
