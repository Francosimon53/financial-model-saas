import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Revenue from "./pages/Revenue";
import COGS from "./pages/COGS";
import Salaries from "./pages/Salaries";
import OPEX from "./pages/OPEX";
import FixedExpenses from "./pages/FixedExpenses";
import CAPEX from "./pages/CAPEX";
import Funding from "./pages/Funding";
import FinancialStatements from "./pages/FinancialStatements";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import AIAnalysis from "./pages/AIAnalysis";

import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen"
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/pricing" component={Pricing} />

          {/* Dashboard route - redirects to projects */}
          <Route path="/dashboard">
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          </Route>

          {/* Protected routes with dashboard layout */}
          <Route path="/projects">
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          </Route>

          <Route path="/project/:id">
            {(params) => (
              <DashboardLayout>
                <ProjectDetail projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/revenue">
            {(params) => (
              <DashboardLayout>
                <Revenue projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/cogs">
            {(params) => (
              <DashboardLayout>
                <COGS projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/salaries">
            {(params) => (
              <DashboardLayout>
                <Salaries projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/opex">
            {(params) => (
              <DashboardLayout>
                <OPEX projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/fixed-expenses">
            {(params) => (
              <DashboardLayout>
                <FixedExpenses projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/capex">
            {(params) => (
              <DashboardLayout>
                <CAPEX projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/funding">
            {(params) => (
              <DashboardLayout>
                <Funding projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/statements">
            {(params) => (
              <DashboardLayout>
                <FinancialStatements projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/dashboard">
            {(params) => (
              <DashboardLayout>
                <Dashboard projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/project/:id/ai-analysis">
            {(params) => (
              <DashboardLayout>
                <AIAnalysis projectId={parseInt(params.id)} />
              </DashboardLayout>
            )}
          </Route>

          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
