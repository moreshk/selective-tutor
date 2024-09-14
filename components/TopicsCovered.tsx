import React from 'react';
import { BookOpen, Calculator, Brain, Sigma, PenTool, PieChart } from 'lucide-react';

const topics = [
  {
    title: 'Written Expression',
    description: 'Creative writing techniques, developing structure & content.',
    icon: PenTool,
  },
  {
    title: 'Numerical/Quantitative Reasoning',
    description: 'Problem-solving techniques to solve questions efficiently.',
    icon: Calculator,
  },
  {
    title: 'Verbal Reasoning',
    description: 'Enrich vocabulary, examine word relationships, and solve complex problems.',
    icon: BookOpen,
  },
  {
    title: 'Comprehension',
    description: 'Develop inferential reading skills and deduce answers from the text.',
    icon: Brain,
  },
  {
    title: 'Mathematics',
    description: 'Develop fundamental mathematical skills and apply them to complex problems.',
    icon: Sigma,
  },
  {
    title: 'Data Interpretation/Abstract Reasoning',
    description: 'Analyze and interpret various forms of data, including graphs, charts and spatial reasoning.',
    icon: PieChart,
  },
];

const TopicsCovered: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Topics Covered</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic, index) => (
           <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <topic.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
              <p className="text-gray-600">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicsCovered;