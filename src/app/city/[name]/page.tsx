import ClientPage from './client-page';

interface CityPageProps {
  params: {
    name: string;
  };
}

// This is a Server Component. It can directly access params.
export default function CityPage({ params }: CityPageProps) {
  // Decode the city name on the server and pass it as a prop to the client component.
  const cityName = decodeURIComponent(params.name);

  return <ClientPage cityName={cityName} />;
}
