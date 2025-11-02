import DashboardClient from '@/components/dashboard-client';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Cities</h1>
      <DashboardClient />
    </div>
  );
}
