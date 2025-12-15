import { Button } from "./ui/button";
import { GraduationCap, Target, Calendar, TrendingUp, Zap } from "lucide-react";
import { Screen } from "../types";

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto pt-20 pb-12">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StudyFlow
            </h1>
          </div>
          
          <p className="text-2xl text-gray-600 italic max-w-2xl mx-auto">
            Smart Study Planner for Engineering Students
          </p>
          
          <div className="py-8">
            <Button
              onClick={() => onNavigate("input")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-7 text-xl rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Create My Study Plan
            </Button>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed">
              Generate a personalized study schedule based on your exam dates, subject difficulty, and available study hours. Say goodbye to last-minute cramming and build consistent study habits that lead to success.
            </p>
          </div>

        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl text-gray-900 mb-3">Personalized Plans</h3>
            <p className="text-gray-600">
              Get custom study schedules tailored to your exam timeline and subject difficulty levels.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl text-gray-900 mb-3">Smart Scheduling</h3>
            <p className="text-gray-600">
              Visual calendar integration helps you see your study sessions at a glance and stay organized.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-cyan-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-cyan-600" />
            </div>
            <h3 className="text-xl text-gray-900 mb-3">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your study hours, view analytics, and celebrate your achievements along the way.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}