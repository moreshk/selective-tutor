'use client';
import StudentProgressChart from '../components/StudentProgressChart';
import StudentComparisonChart from '@/components/StudentComparisonChart';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Target, BarChart, Star } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import TopicsCovered from '../components/TopicsCovered';

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
      <TopicsCovered />

      <ParallaxSection bgClass="bg-gradient-to-r from-indigo-100 to-purple-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6">Why Choose Us?</h2>
          <ul className="text-lg mb-8">
            <li className="mb-2">✓ Personalized learning experience</li>
            <li className="mb-2">
              ✓ Focus on Selective School, SEAL, Scholarship programs
            </li>
            <li className="mb-2">✓ Regular progress tracking and reporting</li>
            <li>✓ Affordable compared to traditional tutoring</li>
          </ul>
          <CallToAction />
        </div>
      </ParallaxSection>

      <ParallaxSection bgClass="bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4 text-center">
            Comprehensive Performance Analytics
          </h2>
          <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
            We provide detailed drilldown reports of your student's performance in specific areas over time, 
            along with insights into how your child is tracking compared to their peers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StudentProgressChart />
            <StudentComparisonChart />
          </div>
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