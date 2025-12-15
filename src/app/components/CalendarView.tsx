import { Card } from "./ui/card";
import { format, addDays, parseISO } from "date-fns";
import { BookOpen, Clock, AlertCircle } from "lucide-react";

interface CalendarViewProps {
  startDate: string;
  plan: Array<{
    day: number;
    tasks: Array<{ subject: string; hours: number }>;
  }>;
  examDate?: string;
}

export function CalendarView({ startDate, plan, examDate }: CalendarViewProps) {
  const parseSafeDate = (value?: string) => {
    if (!value) return new Date();
    try {
      return parseISO(value);
    } catch {
      return new Date();
    }
  };

  const start = parseSafeDate(startDate);
  const displayExamDate = examDate
    ? parseSafeDate(examDate)
    : addDays(start, plan.length);

  const getDateForDay = (dayNumber: number) => addDays(start, dayNumber - 1);

  return (
    <>
      {/* Exam Date Info Banner */}
      {startDate && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="text-sm opacity-90">Study Plan Timeline</p>
            <p className="text-lg">
              Starts: <span className="font-semibold">{format(start, "MMM dd, yyyy")}</span> →
              Exam: <span className="font-semibold">{format(displayExamDate, "MMM dd, yyyy")}</span>
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.map((dayPlan) => {
          const date = getDateForDay(dayPlan.day);
          const dayName = format(date, "EEEE");
          const dateStr = format(date, "MMM dd");

          return (
            <Card
              key={dayPlan.day}
              className="p-5 bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                {/* Date Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg p-4 text-center">
                  <div className="text-sm opacity-90">{dayName}</div>
                  <div className="text-2xl">{dateStr}</div>
                  <div className="text-xs opacity-75 mt-1">Day {dayPlan.day}</div>
                </div>

                {/* Tasks */}
                <div className="space-y-2">
                  {dayPlan.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-gray-50 rounded-md border border-blue-100"
                    >
                      <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">
                          {task.subject}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{task.hours}h</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total hours */}
                <div className="pt-2 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-600">
                    Total:{" "}
                    <span className="text-blue-600">
                      {dayPlan.tasks.reduce((sum, task) => sum + task.hours, 0)}h
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}