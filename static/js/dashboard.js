document.addEventListener('DOMContentLoaded', () => {
  // Helper function to get theme colors
  const getChartColors = () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      text: isDark ? '#e2e8f0' : '#1e293b',
      grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      primary: '#6b21a8',
      accent: '#c084fc'
    };
  };

  const colors = getChartColors();
  Chart.defaults.color = colors.text;
  Chart.defaults.font.family = "'Poppins', sans-serif";

  // Common Animation Config
  const commonAnimation = {
    duration: 2000,
    easing: 'easeOutQuart'
  };

  // Re-apply colors when theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        const newColors = getChartColors();
        Chart.defaults.color = newColors.text;
        
        // Update Skills Chart
        if (typeof skillsChart !== 'undefined') {
          skillsChart.options.scales.r.grid.color = newColors.grid;
          skillsChart.options.scales.r.angleLines.color = newColors.grid;
          skillsChart.options.scales.r.pointLabels.color = newColors.text;
          skillsChart.update();
        }

        // Update Impact Chart
        if (typeof impactChart !== 'undefined') {
          impactChart.options.scales.x.grid.color = newColors.grid;
          impactChart.options.scales.y.grid.color = newColors.grid;
          impactChart.options.scales.x.ticks.color = newColors.text;
          impactChart.options.scales.y.ticks.color = newColors.text;
          impactChart.update();
        }

        // Update Competency Chart
        if (typeof competencyChart !== 'undefined') {
          competencyChart.options.scales.y.grid.color = newColors.grid;
          competencyChart.options.scales.x.ticks.color = newColors.text;
          competencyChart.options.scales.y.ticks.color = newColors.text;
          competencyChart.update();
        }
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // 1. Skills Radar Chart
  const ctxSkills = document.getElementById('skillsChart').getContext('2d');
  const skillsChart = new Chart(ctxSkills, {
    type: 'radar',
    data: {
      labels: ['Business Analysis', 'Process Design', 'Data Analytics', 'Stakeholder Management', 'Strategic Architecture', 'Leadership'],
      datasets: [{
        label: 'Proficiency Level',
        data: [95, 90, 85, 95, 90, 98],
        backgroundColor: 'rgba(192, 132, 252, 0.3)',
        borderColor: '#c084fc',
        pointBackgroundColor: '#6b21a8',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6b21a8',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        ...commonAnimation,
        delay: (context) => context.dataIndex * 100 // Staggered delay for each point
      },
      scales: {
        r: {
          angleLines: { color: colors.grid },
          grid: { color: colors.grid },
          pointLabels: { color: colors.text, font: { size: 12, family: "'Poppins', sans-serif" } },
          ticks: { display: false, min: 0, max: 100 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  // 2. Impact Line Chart with Progressive Animation
  const ctxImpact = document.getElementById('impactChart').getContext('2d');
  const impactData = [2, 5, 8, 15, 20, 25, 30];
  const totalDuration = 2000;
  const delayBetweenPoints = totalDuration / impactData.length;
  const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
  
  const impactChart = new Chart(ctxImpact, {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
      datasets: [{
        label: 'Projects Delivered',
        data: impactData,
        borderColor: '#c084fc',
        backgroundColor: 'rgba(192, 132, 252, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6b21a8',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        x: {
          type: 'number',
          easing: 'linear',
          duration: delayBetweenPoints,
          from: NaN, 
          delay(ctx) {
            if (ctx.type !== 'data' || ctx.xStarted) return 0;
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
          }
        },
        y: {
          type: 'number',
          easing: 'linear',
          duration: delayBetweenPoints,
          from: previousY,
          delay(ctx) {
            if (ctx.type !== 'data' || ctx.yStarted) return 0;
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
          }
        }
      },
      scales: {
        x: { 
          grid: { color: colors.grid }, 
          ticks: { color: colors.text } 
        },
        y: { 
          grid: { color: colors.grid }, 
          ticks: { color: colors.text },
          beginAtZero: true
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { family: "'Poppins', sans-serif" },
          bodyFont: { family: "'Poppins', sans-serif" },
          padding: 10,
          cornerRadius: 8
        }
      }
    }
  });

  // 3. Competency Bar Chart
  const ctxCompetency = document.getElementById('competencyChart').getContext('2d');
  const competencyChart = new Chart(ctxCompetency, {
    type: 'bar',
    data: {
      labels: ['Requirements Gathering', 'As-Is/To-Be Modeling', 'SQL & Python', 'Power BI / Tableau', 'UAT Coordination'],
      datasets: [{
        label: 'Skill Depth',
        data: [98, 92, 85, 90, 88],
        backgroundColor: [
          '#6b21a8', '#7e22ce', '#9333ea', '#a855f7', '#c084fc'
        ],
        borderRadius: 6,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        ...commonAnimation,
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default') {
            delay = context.dataIndex * 300 + 500; // Staggered loading with initial delay
          }
          return delay;
        }
      },
      scales: {
        x: { 
          grid: { display: false }, 
          ticks: { color: colors.text } 
        },
        y: { 
          grid: { color: colors.grid }, 
          ticks: { color: colors.text },
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { family: "'Poppins', sans-serif" },
          bodyFont: { family: "'Poppins', sans-serif" },
          padding: 10,
          cornerRadius: 8
        }
      }
    }
  });
});
