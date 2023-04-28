const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Problems Difficulty',
      data: values,
      backgroundColor: 'rgba(0, 202, 72, 0.5)',
      borderColor: 'rgba(9, 104, 10, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    
  }
});