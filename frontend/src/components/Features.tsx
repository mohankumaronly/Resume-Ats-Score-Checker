import React from 'react';
import { 
  FiCpu, 
  FiBarChart2, 
  FiShield, 
  FiZap, 
  FiTrendingUp, 
  FiAward 
} from 'react-icons/fi';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <FiCpu className="w-8 h-8" />,
    title: 'AI-Powered Analysis',
    description: 'Our advanced AI analyzes your resume against thousands of ATS systems to give you the most accurate score.'
  },
  {
    icon: <FiBarChart2 className="w-8 h-8" />,
    title: 'Detailed Breakdown',
    description: 'Get section-wise scores for formatting, technical skills, experience, projects, and more.'
  },
  {
    icon: <FiTrendingUp className="w-8 h-8" />,
    title: 'Actionable Improvements',
    description: 'Receive specific, actionable suggestions to improve your resume and increase your ATS score.'
  },
  {
    icon: <FiShield className="w-8 h-8" />,
    title: 'ATS Friendly Check',
    description: 'Instantly know if your resume is ATS-friendly with our compatibility checker.'
  },
  {
    icon: <FiZap className="w-8 h-8" />,
    title: 'Real-time Analysis',
    description: 'Get instant feedback on your resume. No waiting, no delays.'
  },
  {
    icon: <FiAward className="w-8 h-8" />,
    title: 'Expert Recommendations',
    description: 'Receive expert-level recommendations to make your resume stand out.'
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose Our Resume Analyzer?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Get a comprehensive analysis of your resume with actionable insights to help you land your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;