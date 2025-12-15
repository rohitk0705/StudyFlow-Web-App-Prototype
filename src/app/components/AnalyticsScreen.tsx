import { Card } from "./ui/card";
import { ArrowLeft, TrendingUp, PieChart, BarChart3, Clock } from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Difficulty, StudyPlanInput, SubjectInput } from "../types";

type SubjectTimeSlice = {
  name: string;
  hours: number;
  difficulty: Difficulty;
};

interface AnalyticsScreenProps {
  onBack: () => void;
  data?: StudyPlanInput | null;
}

export function AnalyticsScreen({ onBack, data }: AnalyticsScreenProps) {
  // Calculate subject-wise time distribution
  const subjects: SubjectInput[] = data?.subjects?.length
    ? data.subjects
    : [
        { name: "LIC", difficulty: "Medium" },
        { name: "ADCom", difficulty: "Hard" },
        { name: "MSP", difficulty: "Medium" },
        { name: "Java", difficulty: "Easy" },
      ];

  const dailyHours = parseFloat(data?.dailyHours || "4");

  // Create analytics data
  const subjectTimeData: SubjectTimeSlice[] = subjects.map((subject) => {
    let hours = 0;
    if (subject.difficulty === "Hard") hours = dailyHours * 0.35;
    else if (subject.difficulty === "Medium") hours = dailyHours * 0.25;
    else hours = dailyHours * 0.15;

    return {
      name: subject.name,
      hours: parseFloat(hours.toFixed(1)),
      difficulty: subject.difficulty,
    };
  });

  // Add revision time
  const totalSubjectHours = subjectTimeData.reduce(
    (sum, item) => sum + item.hours,
    0
  );
  const revisionData = {
    name: "Revision",
    hours: parseFloat(Math.max(dailyHours - totalSubjectHours, 0).toFixed(1)),
    difficulty: "Medium",
  };
  const fullTimeData: SubjectTimeSlice[] = [...subjectTimeData, revisionData];

  // Pie chart colors
  const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

  // Daily breakdown data
  const dailyBreakdown = [
    { day: "Mon", hours: dailyHours, completed: dailyHours * 0.8 },
    { day: "Tue", hours: dailyHours, completed: dailyHours * 0.9 },
    { day: "Wed", hours: dailyHours, completed: dailyHours * 0.7 },
    { day: "Thu", hours: dailyHours, completed: dailyHours * 1.0 },
    { day: "Fri", hours: dailyHours, completed: dailyHours * 0.85 },
    { day: "Sat", hours: dailyHours * 1.5, completed: dailyHours * 1.2 },
    { day: "Sun", hours: dailyHours * 1.5, completed: dailyHours * 1.4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl text-gray-900 mb-3">Study Analytics</h1>
          <p className="text-gray-600">
            Insights into your study time distribution and patterns
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Daily Study Hours</p>
                <p className="text-3xl">{dailyHours}h</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Subjects</p>
                <p className="text-3xl">{subjects.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <PieChart className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-cyan-100 text-sm mb-1">Weekly Hours</p>
                <p className="text-3xl">{(dailyHours * 7).toFixed(0)}h</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Time Distribution Pie Chart */}
          <Card className="p-6 bg-white shadow-md border border-gray-200">
            <h3 className="text-xl text-gray-900 mb-6">
              Subject Time Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={fullTimeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="hours"
                >
                  {fullTimeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>

            <div className="mt-6 space-y-2">
              {fullTimeData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-900">{item.name}</span>
                  </div>
                  <span className="text-gray-600">{item.hours} hrs</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Study Pattern Bar Chart */}
          <Card className="p-6 bg-white shadow-md border border-gray-200">
            <h3 className="text-xl text-gray-900 mb-6">Weekly Study Pattern</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="hours" fill="#3b82f6" name="Planned Hours" />
                <Bar
                  dataKey="completed"
                  fill="#10b981"
                  name="Completed Hours"
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Track your planned vs. completed study hours throughout the week
            </p>
          </Card>
        </div>

        {/* Difficulty Distribution */}
        <Card className="p-6 bg-white shadow-md border border-gray-200">
          <h3 className="text-xl text-gray-900 mb-6">
            Subject Difficulty Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Easy", "Medium", "Hard"].map((difficulty) => {
              const count = subjects.filter(
                (s) => s.difficulty === (difficulty as Difficulty)
              ).length;
              const percentage = subjects.length
                ? (count / subjects.length) * 100
                : 0;

              return (
                <div key={difficulty} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{difficulty}</span>
                    <span className="text-gray-900">{count} subjects</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        difficulty === "Easy"
                          ? "bg-green-500"
                          : difficulty === "Medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {percentage.toFixed(0)}% of total
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
