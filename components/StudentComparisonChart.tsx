'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useInView } from 'react-intersection-observer';
import { Bar } from 'react-chartjs-2';

const StudentComparisonChart = () => {
    const [chartData, setChartData] = useState<ChartData<'bar'>>({
      labels: [],
      datasets: []
    });
    const [chartOptions, setChartOptions] = useState<ChartOptions<'bar'>>({});
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
    useEffect(() => {
      if (inView) {
        const labels = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'];
        const distributionData = [2, 5, 10, 15, 20, 25, 15, 5, 2, 1];
        const studentScore = 78; // Example student score
  
        setChartData({
          labels,
          datasets: [{
            label: 'Score Distribution',
            data: distributionData,
            backgroundColor: 'rgba(0, 0, 128, 0.6)',
            borderColor: 'rgba(0, 0, 128, 1)',
            borderWidth: 1,
          }],
        });
  
        setChartOptions({
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 2000, easing: 'easeOutQuart' },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Number of Students' },
            },
            x: { title: { display: true, text: 'Score Range' } },
          },
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Your Performance Compared to Other Students' },
            tooltip: {
              callbacks: {
                afterBody: (context: any) => {
                  const rangeStart = parseInt(context[0].label.split('-')[0]);
                  const rangeEnd = parseInt(context[0].label.split('-')[1]);
                  if (studentScore >= rangeStart && studentScore <= rangeEnd) {
                    return `Your score: ${studentScore}`;
                  }
                  return '';
                },
              },
            },
          },
        });
      }
    }, [inView]);
  
    return (
      <div ref={ref} className="bg-white p-6 rounded-lg shadow-md h-80">
        <div className="h-full">
          {inView ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">Chart loading...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default StudentComparisonChart;