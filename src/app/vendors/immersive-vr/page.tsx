import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VendorPage() {
  return (
    <div className="space-y-10 py-12">
      <section className="mx-auto w-full max-w-[1200px] space-y-4 px-5">
        <h1 className="font-heading text-3xl font-semibold text-gray-900">
          Immersive VR vendor support
        </h1>
        <p className="text-sm text-[#6B7280]">
          We partner with approved vendors to capture calm, accurate Immersive VR tours.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="space-y-2">
              <h2 className="font-heading text-lg font-semibold text-gray-900">
                What happens
              </h2>
              <p className="text-sm text-[#6B7280]">
                Your agent schedules a capture session. The vendor scans the
                property with 360° equipment and prepares an Immersive VR-ready tour.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2">
              <h2 className="font-heading text-lg font-semibold text-gray-900">
                Benefits
              </h2>
              <p className="text-sm text-[#6B7280]">
                Faster buyer qualification, fewer unproductive viewings, and a
                calmer decision journey.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2">
              <h2 className="font-heading text-lg font-semibold text-gray-900">
                How to prepare
              </h2>
              <p className="text-sm text-[#6B7280]">
                Tidy key rooms, open blinds for natural light, and remove
                personal items you do not wish to appear.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2">
              <h2 className="font-heading text-lg font-semibold text-gray-900">
                Reassurance and privacy
              </h2>
              <p className="text-sm text-[#6B7280]">
                Tours are reviewed before publication and can be removed or
                updated on request.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5">
        <Card className="bg-[#F9FAFB]">
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-gray-900">
                Ready to capture an Immersive VR tour?
              </h2>
              <p className="text-sm text-[#6B7280]">
                Speak to your agent to arrange a vendor visit.
              </p>
            </div>
            <Button>Speak to your agent</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
