// src/components/JobMatchResult.tsx

import React, { useState } from 'react';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiTrendingUp, 
  FiAward,
  FiCode,
  FiBriefcase,
  FiBookOpen,
  FiLayers,
  FiHash,
  FiAlertCircle,
  FiStar,
  FiThumbsUp,
  FiChevronDown,
  FiChevronUp,
  FiTarget,
  FiZap,
  FiLock,
  FiUnlock
} from 'react-icons/fi';
import type { JobMatchResponse } from '../types/Resume';
import ScoreGauge from './ScoreGauge';
import SectionScore from './SectionScore';
import BlurredImprovements from './BlurredImprovements';
import { useAuth } from '../context/AuthContext';

interface JobMatchResultProps {
  result: JobMatchResponse;
  onReset?: () => void;
}

const JobMatchResult: React.FC<JobMatchResultProps> = ({ result, onReset }) => {
  const { isAuthenticated } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    strengths: true,
    weaknesses: true,
    suggestions: true,
    recommendedSkills: true,
    missingKeywords: true,
    skillsGap: true
  });

  const {
    atsScore,
    matchScore,
    overallRating,
    summary,
    keywordMatchRate,
    missingKeywords,
    skillsGap,
    experienceMatch,
    educationMatch,
    sectionScores,
    strengths,
    weaknesses,
    suggestions,
    recommendedSkills,
    detailsLocked,
    atsFriendly,
    analysisConfidence,
    analyzedAt
  } = result;

  const sectionIcons = {
    formatting: <FiLayers className="w-4 h-4 sm:w-5 sm:h-5" />,
    technicalSkills: <FiCode className="w-4 h-4 sm:w-5 sm:h-5" />,
    experience: <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5" />,
    projects: <FiStar className="w-4 h-4 sm:w-5 sm:h-5" />,
    education: <FiBookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
    keywords: <FiHash className="w-4 h-4 sm:w-5 sm:h-5" />
  };

  const sectionLabels = {
    formatting: 'Formatting',
    technicalSkills: 'Technical Skills',
    experience: 'Experience',
    projects: 'Projects',
    education: 'Education',
    keywords: 'Keywords'
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionCard = ({ 
    title, 
    icon, 
    color, 
    items, 
    sectionKey,
    isTagList = false 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    color: string; 
    items: string[]; 
    sectionKey: string;
    isTagList?: boolean;
  }) => {
    const isExpanded = expandedSections[sectionKey];
    const hasItems = items && items.length > 0;

    if (!hasItems) return null;

    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-6 border border-gray-100">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between group"
        >
          <h3 className={`text-base sm:text-lg font-semibold ${color} flex items-center gap-2`}>
            {icon}
            <span className="text-left">{title}</span>
            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </h3>
          <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
            {isExpanded ? <FiChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
          </span>
        </button>
        
        {isExpanded && (
          <div className="mt-3 sm:mt-4">
            {isTagList ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {items.map((item, index) => (
                  <span 
                    key={index} 
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <ul className="space-y-1.5 sm:space-y-2">
                {items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                    <span className="text-current mt-1 flex-shrink-0">•</span>
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  const isLocked = detailsLocked || !isAuthenticated;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Job Match Analysis Complete! 🎯
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Here's how your resume matches the job description
        </p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FiAward className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500">ATS Score</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">{atsScore}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FiTarget className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">Match Score</span>
          </div>
          <span className="text-2xl font-bold text-green-600">{matchScore}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FiZap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-500">Keyword Match</span>
          </div>
          <span className="text-2xl font-bold text-yellow-600">{keywordMatchRate}</span>
          <span className="text-xs text-gray-400">%</span>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FiTrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-gray-500">Rating</span>
          </div>
          <span className="text-lg font-bold text-purple-600">{overallRating}</span>
        </div>
      </div>

      {/* Main Score Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-shrink-0">
            <ScoreGauge score={atsScore} size={150} />
          </div>
          <div className="flex-1 text-center md:text-left w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                atsFriendly 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {atsFriendly ? '✅ ATS Friendly' : '⚠️ Needs Improvement'}
              </span>
              <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                {overallRating}
              </span>
              {!isLocked && (
                <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
                  <FiUnlock className="w-3 h-3" />
                  Unlocked
                </span>
              )}
              {isLocked && (
                <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
                  <FiLock className="w-3 h-3" />
                  Locked
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              {summary}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm text-gray-500">
              <span>Confidence: {analysisConfidence}%</span>
              <span className="hidden xs:inline">•</span>
              <span>Analyzed: {new Date(analyzedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Gap Analysis */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiTarget className="w-5 h-5 text-blue-500" />
          Skills Gap Analysis
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">Required Skills</span>
              <span className="text-gray-500">{skillsGap.required.length} skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillsGap.required.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-green-600">Found in Resume</span>
              <span className="text-gray-500">{skillsGap.found.length} skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillsGap.found.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  ✅ {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-red-600">Missing Skills</span>
              <span className="text-gray-500">{skillsGap.missing.length} skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillsGap.missing.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                  ❌ {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experience & Education Match */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiBriefcase className="w-4 h-4 text-blue-500" />
            Experience Match
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">{experienceMatch}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiBookOpen className="w-4 h-4 text-blue-500" />
            Education Match
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">{educationMatch}</p>
        </div>
      </div>

      {/* Section Scores */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiZap className="w-5 h-5 text-blue-500" />
          Section-wise Breakdown
        </h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
          {Object.entries(sectionScores).map(([key, score]) => (
            <SectionScore
              key={key}
              label={sectionLabels[key as keyof typeof sectionLabels] || key}
              score={score}
              icon={sectionIcons[key as keyof typeof sectionIcons] || <FiAward className="w-4 h-4 sm:w-5 sm:h-5" />}
            />
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5 text-orange-500" />
          Missing Keywords
        </h3>
        {missingKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword, idx) => (
              <span key={idx} className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No missing keywords found! Great job! 🎉</p>
        )}
      </div>

      {/* Locked/Unlocked Improvements */}
      {isLocked ? (
        <BlurredImprovements>
          <div className="space-y-4 sm:space-y-6">
            <SectionCard
              title="Strengths"
              icon={<FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
              color="text-green-600"
              items={strengths}
              sectionKey="strengths"
            />
            <SectionCard
              title="Weaknesses"
              icon={<FiXCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
              color="text-red-600"
              items={weaknesses}
              sectionKey="weaknesses"
            />
            <SectionCard
              title="Suggestions"
              icon={<FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
              color="text-blue-600"
              items={suggestions}
              sectionKey="suggestions"
            />
            <SectionCard
              title="Recommended Skills"
              icon={<FiThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />}
              color="text-purple-600"
              items={recommendedSkills}
              sectionKey="recommendedSkills"
              isTagList={true}
            />
          </div>
        </BlurredImprovements>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <SectionCard
            title="Strengths"
            icon={<FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            color="text-green-600"
            items={strengths}
            sectionKey="strengths"
          />
          <SectionCard
            title="Weaknesses"
            icon={<FiXCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            color="text-red-600"
            items={weaknesses}
            sectionKey="weaknesses"
          />
          <SectionCard
            title="Suggestions"
            icon={<FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            color="text-blue-600"
            items={suggestions}
            sectionKey="suggestions"
          />
          <SectionCard
            title="Recommended Skills"
            icon={<FiThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            color="text-purple-600"
            items={recommendedSkills}
            sectionKey="recommendedSkills"
            isTagList={true}
          />
        </div>
      )}

      {/* Reset Button */}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base font-semibold w-full sm:w-auto justify-center"
        >
          <FiTrendingUp className="w-5 h-5" />
          Check Another Resume
        </button>
      </div>
    </div>
  );
};

export default JobMatchResult;