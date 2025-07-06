// src/components/TaskChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme, Typography, Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

function TaskChart({ tasks }) {
  const theme = useTheme();

  const statusCount = {
    pending: 0,
    'in-progress': 0,
    completed: 0,
  };

  tasks.forEach(task => {
    statusCount[task.status]++;
  });

  const data = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          statusCount['pending'],
          statusCount['in-progress'],
          statusCount['completed'],
        ],
        backgroundColor: [
          '#FFD587', // soft orange
          '#B2CFFF', // soft blue
          '#A8E6CF', // soft green
        ],
        borderColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          font: {
            family: 'Poppins',
            size: 14,
            weight: 'bold',
          },
          color: theme.palette.text.primary,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 500,
        mx: 'auto',
        mb: 4,
      }}
    >
      <Typography
        variant="h6"
        align="left"
        sx={{
          fontWeight: 'bold',
          fontFamily: 'Poppins',
          mb: 2,
        }}
      >
     
      </Typography>
      <Box sx={{ height: 300 }}>
        <Pie data={data} options={options} />
      </Box>
    </Box>
  );
}

export default TaskChart;

