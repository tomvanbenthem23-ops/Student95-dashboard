import { notFound } from 'next/navigation';
import { cityById } from '@/app/lib/seed-data';
import { CmTag } from '@/app/ui/header';

export default async function CityPage({
  params,
}: {
  params: Promise<{ stad: string }>;
}) {
  const { stad } = await params;
  const city = cityById(stad);
  if (!city) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-3.5">
        <h1 className="mb-2 font-display text-[44px] leading-[1.02] text-navy">
          {city.naam}
        </h1>
        <CmTag cityId={city.id} />
      </div>
      <p className="max-w-[800px] text-muted">{city.intro}</p>
      <p className="mt-4 max-w-[800px] text-muted">
        De verenigingenlijst, eventtabel en routeplanning voor deze stad komen
        hier in de volgende bouwfase.
      </p>
    </div>
  );
}
