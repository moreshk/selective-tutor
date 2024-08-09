'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useInView } from 'react-intersection-observer';

const StudentProgressChart = () => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      const labels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
      const studentScores = [65, 68, 64, 70, 72, 75, 73, 78, 80, 82, 85, 88];

      setChartData({
        labels,
        datasets: [
          {
            label: 'Your Progress',
            data: studentScores,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: false
          }
        ]
      });

      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 2000, easing: 'easeOutQuart' },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: 'Score' }
          },
          x: { title: { display: true, text: 'Month' } }
        },
        plugins: {
          legend: { position: 'top' as const },
          title: { display: true, text: 'Your Progress Over Time' }
        }
      });
    }
  }, [inView]);

  return (
    <div ref={ref} className="bg-white p-6 rounded-lg shadow-md h-80">
      <div className="h-full">
        {inView ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-center">Chart loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressChart;
