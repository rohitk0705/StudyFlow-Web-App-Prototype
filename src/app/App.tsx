import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { InputScreen } from "./components/InputScreen";
import { StudyPlanScreen } from "./components/StudyPlanScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { AnalyticsScreen } from "./components/AnalyticsScreen";
import { Header } from "./components/Header";
import { Screen, StudyPlanInput } from "./types";

const PREVIOUS_SCREEN: Record<Screen, Screen | null> = {
  home: null,
  input: "home",
  plan: "input",
  progress: "plan",
  analytics: "plan",
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [studyData, setStudyData] = useState<StudyPlanInput | null>(null);

  const navigate = (screen: Screen, data?: StudyPlanInput) => {
    if (data) {
      setStudyData(data);
    }
    setCurrentScreen(screen);
  };

  const goBack = () => {
    const target = PREVIOUS_SCREEN[currentScreen];
    if (target) {
      setCurrentScreen(target);
    }
  };

  const shouldShowHeader = currentScreen !== "home";

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={navigate} />;
      case "input":
        return <InputScreen onNavigate={navigate} onBack={goBack} />;
      case "plan":
        return (
          <StudyPlanScreen onNavigate={navigate} onBack={goBack} data={studyData} />
        );
      case "progress":
        return <ProgressScreen onNavigate={navigate} onBack={goBack} />;
      case "analytics":
        return <AnalyticsScreen onBack={goBack} data={studyData} />;
      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="size-full">
      {/* Global Header with Notifications - shown on all screens except home */}
      {shouldShowHeader && <Header />}
      {renderCurrentScreen()}
    </div>
  );
}