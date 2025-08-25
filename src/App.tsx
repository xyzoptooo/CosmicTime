import PomodoroTimer from './components/PomodoroTimer';
import ErrorBoundary from './components/ErrorBoundary'; // Importing ErrorBoundary
import DailyProgress from './components/DailyProgress';
import { ChartContainer } from './components/ui/chart-simple'; // Importing ChartSimple

const App = () => {
  const user = { name: "John Doe", email: "john@example.com" }; // Example user
  const completedSessions = 3; // Example completed sessions

  const chartConfig = {
    sales: { label: "Sales", color: "#8884d8" },
    expenses: { label: "Expenses", color: "#82ca9d" },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <ErrorBoundary>
        <PomodoroTimer />
      </ErrorBoundary>
      <DailyProgress user={user} completedSessions={completedSessions} />
      <ChartContainer config={chartConfig}>
        {/* ChartContainer expects a single ReactElement as children */}
        <span>Chart will be displayed here</span>
      </ChartContainer>
    </div>
  );
};

export default App;
