import ClientPage from './client-page';

interface CityPageProps {
  params: Promise<{
    name: string;
  }>;
}

// This is a Server Component. It can directly access params.
export default async function CityPage({ params }: CityPageProps) {
  // Decode the city name on the server and pass it as a prop to the client component.
  const resolvedParams = await params;
  const cityName = decodeURIComponent(resolvedParams.name);

  return <ClientPage cityName={cityName} />;
}
