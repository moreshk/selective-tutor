'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Target, BarChart } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement,
  ChartData,
  ChartOptions
} from 'chart.js';
import { useInView } from 'react-intersection-observer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ParallaxSection = ({
  children,
  bgClass
}: {
  children: React.ReactNode;
  bgClass: string;
}) => (
  <div
    className={`min-h-screen flex items-center justify-center bg-fixed bg-center bg-no-repeat bg-cover ${bgClass}`}
  >
    {children}
  </div>
);

const CallToAction = () => (
  <Link
    href="/signup"
    className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300"
  >
    Get Started
    <ArrowRight className="ml-2 h-5 w-5" />
  </Link>
);

const ProcessStep = ({
  icon: Icon,
  title,
  description
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="text-center">
    <Icon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const StudentProgressChart = () => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const studentScores = [65, 68, 64, 70, 72, 75, 73, 78, 80, 82, 85, 88];

      setChartData({
        labels,
        datasets: [{
          label: 'Your Progress',
          data: studentScores,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false,
        }],
      });

      setChartOptions({
        responsive: true,
        animation: { duration: 2000, easing: 'easeOutQuart' },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: 'Score' },
          },
          x: { title: { display: true, text: 'Month' } },
        },
        plugins: {
          legend: { position: 'top' as const },
          title: { display: true, text: 'Your Progress Over Time' },
        },
      });
    }
  }, [inView]);

  return (
    <div ref={ref} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="h-64">
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
    <div ref={ref} className="bg-white p-6 rounded-lg shadow-md">
      <div className="h-64">
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


const HomePage = () => {
  return (
    <div className="bg-gray-50 text-gray-900">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        .animate-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>

      <ParallaxSection bgClass="bg-gradient-to-r from-blue-100 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fadeInUp">
            Personalized AI Tutoring for Selective Exams
          </h1>
          <p className="text-xl mb-8 animate-fadeInUp animate-delay-200">
            Achieve higher aptitude without the high costs
          </p>
          <div className="animate-fadeInUp animate-delay-400">
            <CallToAction />
          </div>
        </div>
      </ParallaxSection>

      <ParallaxSection bgClass="bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessStep
              icon={BookOpen}
              title="Benchmark Test"
              description="We start with a comprehensive assessment to understand your child's current level."
            />
            <ProcessStep
              icon={Target}
              title="Tailored Program"
              description="Based on the results, we create a personalized learning plan focusing on areas that need improvement."
            />
            <ProcessStep
              icon={BarChart}
              title="Regular Adjustments"
              description="We continuously adapt the program based on your child's progress and performance."
            />
          </div>
        </div>
      </ParallaxSection>

      <ParallaxSection bgClass="bg-gradient-to-r from-indigo-100 to-purple-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6">Why Choose Us?</h2>
          <ul className="text-lg mb-8">
            <li className="mb-2">✓ Personalized learning experience</li>
            <li className="mb-2">
              ✓ Focus on Selective Schools, Melbourne High, and SEAL programs
            </li>
            <li className="mb-2">✓ Regular progress tracking and reporting</li>
            <li>✓ Affordable compared to traditional tutoring</li>
          </ul>
          <CallToAction />
        </div>
      </ParallaxSection>

      <ParallaxSection bgClass="bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Student Progress Tracker
          </h2>
          <StudentProgressChart />
          <StudentComparisonChart />
        </div>
      </ParallaxSection>

      <ParallaxSection bgClass="bg-gradient-to-r from-blue-100 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to Excel?</h2>
          <p className="text-xl mb-8">
            Join our AI-powered tutoring platform and give your child the best
            chance at success.
          </p>
          <CallToAction />
        </div>
      </ParallaxSection>
    </div>
  );
};

export default HomePage;