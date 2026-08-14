import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function FiltersPanel() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="price-range">Price range</Label>
        <select
          id="price-range"
          className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900"
        >
          <option>Any</option>
          <option>Up to £300k</option>
          <option>£300k - £600k</option>
          <option>£600k - £900k</option>
          <option>£900k+</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="beds">Beds</Label>
        <select
          id="beds"
          className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900"
        >
          <option>Any</option>
          <option>1+</option>
          <option>2+</option>
          <option>3+</option>
          <option>4+</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="property-type">Property type</Label>
        <select
          id="property-type"
          className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm text-gray-900"
        >
          <option>Any</option>
          <option>Apartment</option>
          <option>House</option>
          <option>Townhouse</option>
          <option>New build</option>
        </select>
      </div>
      <div className="flex items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-3">
        <div>
          <Label htmlFor="vr-only">VR listings only</Label>
          <p className="text-xs text-[#6B7280]">Show listings with a 360° tour</p>
        </div>
        <Switch id="vr-only" defaultChecked />
      </div>
    </div>
  );
}
