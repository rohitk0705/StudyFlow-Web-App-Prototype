import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { ArrowLeft, Trophy, Flame, Star, CheckCircle2 } from "lucide-react";
import { Screen } from "../types";

interface ProgressScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export function ProgressScreen({ onBack, onNavigate }: ProgressScreenProps) {
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({
    lic1: false,
    msp1: false,
    adcom1: false,
    java1: false,
    revision1: false,
    lic2: false,
    msp2: false,
    adcom2: false,
    java2: false,
    revision2: false,
  });

  const subjects = [
    { id: "lic1", name: "LIC - Day 1", description: "Linear Integrated Circuits" },
    { id: "msp1", name: "MSP - Day 1", description: "Microcontroller & Signal Processing" },
    { id: "adcom1", name: "ADCom - Day 2", description: "Analog & Digital Communication" },
    { id: "java1", name: "Java - Day 2", description: "Object Oriented Programming" },
    { id: "revision1", name: "Revision - Day 1", description: "Review key concepts" },
    { id: "lic2", name: "LIC - Day 3", description: "Advanced topics" },
    { id: "msp2", name: "MSP - Day 3", description: "Practice problems" },
    { id: "adcom2", name: "ADCom - Day 4", description: "Deep dive" },
    { id: "java2", name: "Java - Day 4", description: "Coding practice" },
    { id: "revision2", name: "Revision - Day 5", description: "Comprehensive review" },
  ];

  const toggleTask = (taskId: string) => {
    setCompletedTasks({
      ...completedTasks,
      [taskId]: !completedTasks[taskId],
    });
  };

  const totalTasks = subjects.length;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercentage = (completedCount / totalTasks) * 100;
  const streak = 5; // Mock streak data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl text-gray-900 mb-3">Progress Tracker</h1>
          <p className="text-lg text-gray-600">
            Mark your completed sessions and track your journey
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Completed</p>
                <p className="text-4xl">{completedCount}/{totalTasks}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Study Streak</p>
                <p className="text-4xl">{streak} days</p>
              </div>
              <Flame className="w-10 h-10 opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Performance</p>
                <p className="text-4xl">{Math.round(progressPercentage)}%</p>
              </div>
              <Star className="w-10 h-10 opacity-80" />
            </div>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="p-8 bg-white shadow-xl border-2 border-gray-100 rounded-2xl mb-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl text-gray-900 mb-1">Overall Progress</h3>
                <p className="text-gray-600">
                  {completedCount} of {totalTasks} tasks completed
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-4">
                <Trophy className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-4" />
              <p className="text-sm text-gray-600 text-right">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          </div>
        </Card>

        {/* Subject Checklist */}
        <Card className="p-8 bg-white shadow-xl border-2 border-gray-100 rounded-2xl mb-8">
          <h3 className="text-2xl text-gray-900 mb-6">Study Sessions</h3>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all ${
                  completedTasks[subject.id]
                    ? "bg-green-50 border-green-300 opacity-75"
                    : "bg-gradient-to-r from-white to-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <Checkbox
                  id={subject.id}
                  checked={completedTasks[subject.id]}
                  onCheckedChange={() => toggleTask(subject.id)}
                  className="mt-1"
                />
                <label
                  htmlFor={subject.id}
                  className="flex-1 cursor-pointer space-y-1"
                >
                  <div
                    className={`text-gray-900 text-lg ${
                      completedTasks[subject.id] ? "line-through" : ""
                    }`}
                  >
                    {subject.name}
                  </div>
                  <div className="text-sm text-gray-500">{subject.description}</div>
                </label>
                {completedTasks[subject.id] && (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-10 text-center mb-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
            <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
          </div>
          <p className="text-3xl text-white mb-3">
            Consistency builds results.
          </p>
          <p className="text-lg text-blue-100">
            Every session completed brings you closer to your goals. Keep going! 🚀
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => onNavigate("home")}
            variant="outline"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-6 text-lg rounded-xl"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}