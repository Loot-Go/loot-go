"use client";

import { cn } from "@/lib/utils";
import { Annotation, Map } from "mapkit-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface MapsProps {
  token: string;
  className?: string;
  coordinatesArray: {
    lat: number;
    lng: number;
    type: "box1" | "box2" | "box3";
  }[];
  enableUserLocation?: boolean;
  disableBodyScroll?: boolean;
  paddingBottom?: number;
}

const AppleMaps: React.FC<MapsProps> = ({
  token,
  coordinatesArray,
  className,
  enableUserLocation = false,
  disableBodyScroll = false,
  paddingBottom,
}) => {
  const [mounted, setMounted] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{
    lat: number;
    lng: number;
  }>();
  const [accurateLocation, setAccurateLocation] = useState(false);
  const [cookies, setCookie] = useCookies(["user-location"]);

  useLayoutEffect(() => {
    setMounted(true);
    if (!enableUserLocation) return;

    const cachedLocation = cookies["user-location"];
    if (cachedLocation) {
      setUserCoordinates(cachedLocation);
    } else {
      try {
        (async () => {
          const ipResponse = await fetch("https://ipapi.co/json/");
          const ipData = await ipResponse.json();
          const { latitude, longitude } = ipData;
          setUserCoordinates({ lat: latitude, lng: longitude });
          setCookie(
            "user-location",
            JSON.stringify({ lat: latitude, lng: longitude }),
            {
              path: "/",
              maxAge: 60 * 60 * 24, // 24 hours
            },
          );
        })();
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableUserLocation]);

  useEffect(() => {
    if (disableBodyScroll) {
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.touchAction = "auto";
      };
    }
  }, [disableBodyScroll]);

  const updateUserLocation = useCallback(
    (coordinates: { lat: number; lng: number }) => {
      setUserCoordinates(coordinates);
      setAccurateLocation(true);
      setCookie("user-location", JSON.stringify(coordinates), {
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });
    },
    [setCookie],
  );

  return (
    <div
      className={cn(
        `relative h-56 w-full items-center justify-center`,
        className,
      )}
    >
      {mounted && (
        <Map
          token={token}
          paddingBottom={paddingBottom ?? undefined}
          showsCompass={0}
          showsMapTypeControl={false}
          initialRegion={
            userCoordinates
              ? {
                  centerLatitude: userCoordinates.lat,
                  centerLongitude: userCoordinates.lng,
                  latitudeDelta: 0.003,
                  longitudeDelta: 0.003,
                }
              : undefined
          }
          allowWheelToZoom
          showsUserLocation
          showsUserLocationControl
          tracksUserLocation
          onUserLocationChange={(event) => {
            if (event.coordinate) {
              updateUserLocation({
                lat: event.coordinate.latitude,
                lng: event.coordinate.longitude,
              });
            }
          }}
        >
          {coordinatesArray
            ? coordinatesArray.map((coordinates) => (
                <Annotation
                  key={`coordinate-${JSON.stringify(coordinates)}`}
                  latitude={coordinates.lat}
                  longitude={coordinates.lng}
                >
                  <Link href={"/chest"}>
                    <Image
                      height={40}
                      width={40}
                      src={`/${coordinates.type}.png`}
                      alt="box"
                    />
                  </Link>
                </Annotation>
              ))
            : null}

          {userCoordinates && !accurateLocation && (
            <Annotation
              latitude={userCoordinates.lat}
              longitude={userCoordinates.lng}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <div className="h-3.5 w-3.5 rounded-full bg-gray-500"></div>
              </div>
            </Annotation>
          )}
        </Map>
      )}
    </div>
  );
};

export default AppleMaps;
