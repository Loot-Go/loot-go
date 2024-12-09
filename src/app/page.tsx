import AppleMaps from "@/components/app/apple-maps";
import { getMapsToken } from "@/lib/globalActions";

export default async function Home() {
  const appleMapsToken = await getMapsToken();

  return (
    <div className="relative -mb-16 flex flex-1">
      <div className="absolute inset-0">
        <AppleMaps
          token={appleMapsToken}
          className="h-full w-full flex-1 bg-gray-300"
          coordinatesArray={[
            {
              lat: 13.721714,
              lng: 100.590783,
              type: "box1",
            },
            {
              lat: 13.720587,
              lng: 100.589821,
              type: "box2",
            },
            {
              lat: 13.720803,
              lng: 100.59085,
              type: "box3",
            },
            {
              lat: 13.721297,
              lng: 100.589829,
              type: "box2",
            },
          ]}
          paddingBottom={70}
          enableUserLocation
        />
      </div>
    </div>
  );
}
