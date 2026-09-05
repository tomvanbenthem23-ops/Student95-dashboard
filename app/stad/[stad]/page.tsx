import { notFound } from 'next/navigation';
import { cityById } from '@/app/lib/seed-data';
import { CityPageClient } from '@/app/ui/city/city-page-client';

export default async function CityPage({
  params,
}: {
  params: Promise<{ stad: string }>;
}) {
  const { stad } = await params;
  const city = cityById(stad);
  if (!city) notFound();

  return <CityPageClient city={city} />;
}
