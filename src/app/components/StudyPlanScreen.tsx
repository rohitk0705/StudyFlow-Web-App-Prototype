import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Clock, BookOpen, Calendar, BarChart3 } from "lucide-react";
import { CalendarView } from "./CalendarView";
import { useEffect, useMemo, useRef, useState } from "react";
import { differenceInCalendarDays, format, parseISO, startOfDay } from "date-fns";
import { Screen, StudyPlanInput, SubjectInput } from "../types";

const MAX_PLAN_DAYS = 30;

interface StudyPlanScreenProps {
  onNavigate: (screen: Screen, data?: StudyPlanInput) => void;
  onBack: () => void;
  data?: StudyPlanInput | null;
}

export function StudyPlanScreen({ onNavigate, onBack, data }: StudyPlanScreenProps) {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [timeStatus, setTimeStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [timeDisplay, setTimeDisplay] = useState("Syncing clock...");
  const timeReference = useRef<{ reference: Date | null; updatedAt: number }>({
    reference: null,
    updatedAt: Date.now(),
  });

  const indiaTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    []
  );

  useEffect(() => {
    let active = true;

    const fetchIndiaTime = async () => {
      try {
        const response = await fetch("/api/windows-time");
        if (!response.ok) {
          throw new Error("Failed to sync");
        }
        const payload = await response.json();
        if (!payload?.datetime) {
          throw new Error("Missing datetime");
        }
        if (!active) return;
        timeReference.current = {
          reference: new Date(payload.datetime),
          updatedAt: Date.now(),
        };
        setTimeStatus("ready");
      } catch (error) {
        if (!active) return;
        timeReference.current = {
          reference: null,
          updatedAt: Date.now(),
        };
        setTimeStatus("fallback");
      }
    };

    fetchIndiaTime();
    const refresh = setInterval(fetchIndiaTime, 60_000);

    return () => {
      active = false;
      clearInterval(refresh);
    };
  }, []);

  useEffect(() => {
    const updateDisplay = () => {
      const { reference, updatedAt } = timeReference.current;
      let currentTime: Date;

      if (reference) {
        const elapsed = Date.now() - updatedAt;
        currentTime = new Date(reference.getTime() + elapsed);
      } else {
        currentTime = new Date();
      }

      setTimeDisplay(indiaTimeFormatter.format(currentTime));
    };

    updateDisplay();
    const ticker = setInterval(updateDisplay, 1000);
    return () => clearInterval(ticker);
  }, [indiaTimeFormatter]);
  
  const defaultSubjects: SubjectInput[] = [
    { name: "LIC", difficulty: "Medium" },
    { name: "ADCom", difficulty: "Hard" },
    { name: "MSP", difficulty: "Medium" },
    { name: "Java", difficulty: "Easy" },
  ];

  const userSubjects = Array.isArray(data?.subjects) ? data.subjects : [];
  const sanitizedSubjects = userSubjects
    .map<SubjectInput>((subject) => ({
      name: subject.name.trim(),
      difficulty: subject.difficulty ?? "Medium",
    }))
    .filter((subject) => subject.name.length > 0);

  const subjects = sanitizedSubjects.length ? sanitizedSubjects : defaultSubjects;

  const rawDailyHours = parseFloat(data?.dailyHours || "4");
  const dailyHours = Number.isFinite(rawDailyHours) && rawDailyHours > 0 ? rawDailyHours : 4;

  const roundToTenths = (value: number) => Math.round(value * 10) / 10;

  const distributeHours = (totalHours: number) => {
    let focusHours = roundToTenths(totalHours * 0.5);
    let practiceHours = roundToTenths(totalHours * 0.3);
    let revisionHours = roundToTenths(totalHours * 0.2);

    let totalAssigned = roundToTenths(focusHours + practiceHours + revisionHours);
    let difference = roundToTenths(totalHours - totalAssigned);

    if (Math.abs(difference) >= 0.1) {
      revisionHours = roundToTenths(revisionHours + difference);
      totalAssigned = roundToTenths(focusHours + practiceHours + revisionHours);
      difference = roundToTenths(totalHours - totalAssigned);
    }

    if (revisionHours < 0) {
      practiceHours = roundToTenths(Math.max(0, practiceHours + revisionHours));
      revisionHours = 0;
    }

    if (difference !== 0 && practiceHours > 0 && revisionHours === 0) {
      practiceHours = roundToTenths(practiceHours + difference);
    }

    return {
      focusHours: Math.max(0, focusHours),
      practiceHours: Math.max(0, practiceHours),
      revisionHours: Math.max(0, revisionHours),
    };
  };

  const generatePlan = (days: number) => {
    return Array.from({ length: days }, (_, index) => {
      const primary = subjects[index % subjects.length]?.name || `Focus Block ${index + 1}`;
      const secondary = subjects[(index + 1) % subjects.length]?.name || primary;
      const { focusHours, practiceHours, revisionHours } = distributeHours(dailyHours);

      const tasks = [
        { subject: primary, hours: focusHours },
        { subject: `${secondary} Practice`, hours: practiceHours },
        { subject: "Revision & Mock Review", hours: revisionHours },
      ].filter((task) => task.hours > 0);

      return {
        day: index + 1,
        tasks,
      };
    });
  };

  const parseExamDate = () => {
    if (!data?.examDate) return null;
    try {
      const parsed = parseISO(data.examDate);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  };

  const today = startOfDay(new Date());
  const startDate = format(today, "yyyy-MM-dd");
  const examDateValue = parseExamDate();
  const totalDays = (() => {
    if (!examDateValue) {
      return Math.min(MAX_PLAN_DAYS, 5);
    }

    const daysUntilExam = differenceInCalendarDays(startOfDay(examDateValue), today);
    if (daysUntilExam <= 0) {
      return Math.min(MAX_PLAN_DAYS, 5);
    }

    return Math.min(MAX_PLAN_DAYS, daysUntilExam);
  })();

  const plan = generatePlan(totalDays);
  const examDate = data?.examDate?.trim() ? data.examDate : undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl text-gray-900 mb-3">
            Your Personalized Study Plan
          </h1>
          <p className="text-gray-600">
            Follow this schedule to stay consistent and well-prepared
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm text-right">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
              India Standard Time
            </p>
            <p className="text-xl text-gray-900 mt-1">
              {timeStatus === "loading" ? "Syncing clock..." : timeDisplay}
            </p>
            {timeStatus === "fallback" && (
              <p className="text-xs text-amber-600 mt-1">
                Using device time while sync retries.
              </p>
            )}
          </div>
        </div>

        {/* View Mode Toggle and Analytics Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                viewMode === "calendar"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar View
            </button>
          </div>
          
          <Button
            onClick={() => onNavigate("analytics")}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            View Analytics
          </Button>
        </div>

        {/* Conditional Rendering Based on View Mode */}
        {viewMode === "list" ? (
          <div className="space-y-6 mb-8">
            {plan.map((dayPlan) => (
              <Card
                key={dayPlan.day}
                className="p-6 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20">
                    <div className="bg-blue-600 text-white rounded-lg px-4 py-2 text-center">
                      <div className="text-sm">Day</div>
                      <div className="text-2xl">{dayPlan.day}</div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    {dayPlan.tasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-900">{task.subject}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{task.hours} hrs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mb-8">
            <CalendarView startDate={startDate} plan={plan} examDate={examDate} />
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-900 text-center">
            💡 <span className="italic">Pro Tip:</span> Take 5-10 minute breaks between sessions and stay hydrated for better focus.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => onNavigate("progress")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg rounded-lg"
          >
            Track Progress
          </Button>
        </div>
      </div>
    </div>
  );
}