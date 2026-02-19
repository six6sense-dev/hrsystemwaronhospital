import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Sparkles, 
  Briefcase,
  Wand2,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { Employee } from '../types';
import { generateEmployeeBio, generatePerformanceInsight } from '../services/geminiService';

interface EmployeeProfileProps {
  employee: Employee;
  onBack: () => void;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee, onBack }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PERFORMANCE'>('OVERVIEW');
  const [bio, setBio] = useState<string>(employee.bio || '');
  const [insight, setInsight] = useState<string>('');
  
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const generated = await generateEmployeeBio(employee);
      setBio(generated);
    } catch (error) {
      alert("Failed to generate bio. Check API key.");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleAnalyzePerformance = async () => {
    setIsGeneratingInsight(true);
    try {
      const generated = await generatePerformanceInsight(employee);
      setInsight(generated);
    } catch (error) {
      alert("Failed to analyze performance. Check API key.");
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <button 
        onClick={onBack}
        className="flex items-center text-zinc-500 hover:text-orange-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Daftar
      </button>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-orange-600 to-red-600"></div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end md:items-end -mt-12 gap-6">
          <img 
            src={employee.avatarUrl} 
            alt={employee.firstName} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white object-cover"
          />
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold text-zinc-800">{employee.firstName} {employee.lastName}</h1>
            <p className="text-lg text-zinc-500 font-medium">{employee.role} • {employee.department}</p>
          </div>
          <div className="flex gap-3 mb-2">
            <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium shadow-sm">
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-sm">
              Contact
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <h3 className="font-bold text-zinc-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-500" />
              Contact & Info
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-zinc-600">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600">
                <Phone className="w-4 h-4 text-zinc-400" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Joined {employee.joinDate}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-zinc-100">
               <h4 className="font-semibold text-zinc-700 mb-3">Skills</h4>
               <div className="flex flex-wrap gap-2">
                 {employee.skills.map(skill => (
                   <span key={skill} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-md font-medium">
                     {skill}
                   </span>
                 ))}
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-300" />
              <h3 className="font-bold">Top Performer</h3>
            </div>
            <p className="text-indigo-100 text-sm mb-4">
              Rated {employee.performanceRating}/5 based on recent evaluations.
            </p>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-yellow-300 h-2 rounded-full" 
                style={{ width: `${(employee.performanceRating || 0) / 5 * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Column: Content Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4 border-b border-zinc-200">
             <button 
               className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'OVERVIEW' ? 'text-orange-600' : 'text-zinc-500 hover:text-zinc-700'}`}
               onClick={() => setActiveTab('OVERVIEW')}
             >
               Overview
               {activeTab === 'OVERVIEW' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600"></div>}
             </button>
             <button 
               className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'PERFORMANCE' ? 'text-orange-600' : 'text-zinc-500 hover:text-zinc-700'}`}
               onClick={() => setActiveTab('PERFORMANCE')}
             >
               AI Insights
               {activeTab === 'PERFORMANCE' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600"></div>}
             </button>
          </div>

          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-zinc-800">Professional Bio</h3>
                  <button 
                    onClick={handleGenerateBio}
                    disabled={isGeneratingBio}
                    className="flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                  >
                    {isGeneratingBio ? (
                      <span className="animate-spin">⏳</span> 
                    ) : (
                      <Wand2 className="w-3 h-3" />
                    )}
                    Generate with AI
                  </button>
                </div>
                
                {bio ? (
                  <p className="text-zinc-600 leading-relaxed text-sm whitespace-pre-wrap">{bio}</p>
                ) : (
                   <div className="text-center py-8 text-zinc-400 border-2 border-dashed border-zinc-100 rounded-lg">
                     <p>No bio available yet.</p>
                     <p className="text-xs mt-1">Click "Generate with AI" to create one.</p>
                   </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
                <h3 className="font-bold text-zinc-800 mb-4">Recent Achievements</h3>
                <ul className="space-y-3">
                  {employee.recentAchievements?.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-orange-500"></div>
                      <span className="text-zinc-600 text-sm">{achievement}</span>
                    </li>
                  ))}
                  {!employee.recentAchievements?.length && (
                    <p className="text-zinc-400 text-sm">No recent achievements recorded.</p>
                  )}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'PERFORMANCE' && (
            <div className="space-y-6 animate-fade-in">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 border-t-4 border-t-purple-500">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-purple-50 rounded-lg">
                        <BrainCircuit className="w-6 h-6 text-purple-600" />
                     </div>
                     <div>
                       <h3 className="font-bold text-zinc-800">AI Performance Analysis</h3>
                       <p className="text-xs text-zinc-500">Powered by Gemini</p>
                     </div>
                   </div>
                   
                   <button 
                    onClick={handleAnalyzePerformance}
                    disabled={isGeneratingInsight}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                     {isGeneratingInsight ? 'Analyzing...' : 'Analyze Fit & Growth'}
                     {!isGeneratingInsight && <Sparkles className="w-4 h-4" />}
                  </button>
                 </div>

                 {insight ? (
                   <div className="prose prose-sm max-w-none text-zinc-600 bg-zinc-50 p-4 rounded-lg">
                      <div dangerouslySetInnerHTML={{ __html: insight }} />
                   </div>
                 ) : (
                   <div className="text-center py-12 text-zinc-400 bg-zinc-50 rounded-lg">
                     <TrendingUp className="w-10 h-10 mx-auto mb-3 text-zinc-300" />
                     <p>Generate deep insights about {employee.firstName}'s performance.</p>
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;