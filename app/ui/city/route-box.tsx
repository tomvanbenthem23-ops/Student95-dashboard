import { Editable } from '@/app/ui/editable';

export function RouteBox({ cid, fallback }: { cid: string; fallback: string }) {
  return (
    <div className="mb-2.5 rounded-m border border-[#cdd6f7] bg-[#e8ecfb] p-5">
      <h3 className="mb-2 text-[15px] text-blue-dark">Routeplanning (overdag, op afspraak)</h3>
      <p className="text-[13.5px] text-[#1c2b73]">
        <Editable storeKey={`txt_route_${cid}`} fallback={fallback} multiline />
      </p>
    </div>
  );
}
