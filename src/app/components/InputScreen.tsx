import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { ArrowLeft, Plus, X, Calendar, BookOpen, Clock, Sparkles } from "lucide-react";
import { Difficulty, Screen, StudyPlanInput, SubjectInput } from "../types";

interface InputScreenProps {
  onNavigate: (screen: Screen, data?: StudyPlanInput) => void;
  onBack: () => void;
}

export function InputScreen({ onNavigate, onBack }: InputScreenProps) {
  const [examDate, setExamDate] = useState("");
  const [subjects, setSubjects] = useState<SubjectInput[]>([
    { name: "LIC", difficulty: "Medium" },
    { name: "ADCom", difficulty: "Hard" },
    { name: "MSP", difficulty: "Medium" },
    { name: "Java", difficulty: "Easy" },
  ]);
  const [newSubject, setNewSubject] = useState("");
  const [dailyHours, setDailyHours] = useState("4");
  const [examDateError, setExamDateError] = useState<string | null>(null);

  const parseDateString = (value: string) => {
    if (!value) {
      return null;
    }
    const [yearStr, monthStr, dayStr] = value.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return null;
    }
    const parsed = new Date(year, month - 1, day);
    parsed.setHours(0, 0, 0, 0);
    return parsed;
  };

  const validateExamDate = (value: string) => {
    if (!value) {
      setExamDateError(null);
      return false;
    }

    const parsedDate = parseDateString(value);
    if (!parsedDate) {
      setExamDateError("Enter a valid exam date.");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate <= today) {
      setExamDateError("Exam date must be in the future.");
      return false;
    }

    setExamDateError(null);
    return true;
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, { name: newSubject.trim(), difficulty: "Medium" }]);
      setNewSubject("");
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateDifficulty = (index: number, difficulty: Difficulty) => {
    const updated = [...subjects];
    updated[index].difficulty = difficulty;
    setSubjects(updated);
  };

  const handleGenerate = () => {
    if (!examDate || !validateExamDate(examDate)) {
      return;
    }
    onNavigate("plan", { examDate, subjects, dailyHours });
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl text-gray-900 mb-3">Enter Study Details</h1>
          <p className="text-lg text-gray-600">
            Provide your exam information to generate a personalized study plan
          </p>
        </div>

        <Card className="p-8 bg-white shadow-xl border-2 border-gray-100 rounded-2xl">
          <div className="space-y-8">
            {/* Exam Date */}
            <div className="space-y-3">
              <Label htmlFor="exam-date" className="text-gray-900 flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                Exam Date
              </Label>
              <Input
                id="exam-date"
                type="date"
                value={examDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setExamDate(value);
                  validateExamDate(value);
                }}
                className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg p-3 rounded-lg"
              />
              {examDateError && (
                <p className="text-sm text-red-600">{examDateError}</p>
              )}
            </div>

            {/* Subject List */}
            <div className="space-y-3">
              <Label className="text-gray-900 flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Subjects
              </Label>
              <div className="space-y-3">
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <p className="text-gray-900 text-lg">{subject.name}</p>
                    </div>
                    <select
                      value={subject.difficulty}
                      onChange={(e) => updateDifficulty(index, e.target.value as Difficulty)}
                      className={`border-2 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${getDifficultyColor(
                        subject.difficulty
                      )}`}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                    <button
                      onClick={() => removeSubject(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add new subject..."
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSubject()}
                    className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg p-3 rounded-lg"
                  />
                  <Button
                    onClick={addSubject}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Daily Study Hours */}
            <div className="space-y-3">
              <Label htmlFor="daily-hours" className="text-gray-900 flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                Daily Study Hours
              </Label>
              <Input
                id="daily-hours"
                type="number"
                min="1"
                max="12"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg p-3 rounded-lg"
              />
              <p className="text-sm text-gray-500 flex items-center gap-2">
                💡 How many hours per day can you dedicate to studying?
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={!examDate || subjects.length === 0 || Boolean(examDateError)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-7 text-xl rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Study Plan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}