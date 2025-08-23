import PomodoroTimer from './components/PomodoroTimer';
import DailyProgress from './components/DailyProgress';

const App = () => {
  const user = { name: "John Doe", email: "john@example.com" }; // Example user
  const completedSessions = 3; // Example completed sessions

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <PomodoroTimer />
      <DailyProgress user={user} completedSessions={completedSessions} />
    </div>
  );
};

export default App;
