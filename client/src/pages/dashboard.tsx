import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { DataTable } from "@/components/dashboard/data-table";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <main className="ml-64 p-6">
        <TopBar />
        <MetricsGrid />
        <ChartsSection />
        <DataTable />
      </main>
    </div>
  );
}
