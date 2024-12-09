"use client";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaLocationArrow as LocationIcon } from "react-icons/fa";
import { ImSpinner2 as SpinnerIcon } from "react-icons/im";
import { toast } from "sonner";

type RenderFunction = (props: { isLocationLoading: boolean }) => ReactNode;

const UserLocation: React.FC<{
  setUserCoordinates?: (location: { lat: number; lng: number }) => void;
  children?: ReactNode | RenderFunction;
  className?: string;
}> = ({ setUserCoordinates, children, className }) => {
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showLocationError, setShowLocationError] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [cookies, setCookie] = useCookies(["location-allowed"]);
  const [, setLocationCookie] = useCookies(["user-location"]);

  useEffect(() => {
    if (cookies["location-allowed"] && cookies["location-allowed"] === true) {
      setIsLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setIsLocationLoading(false);
        },
        () => {
          setCookie("location-allowed", false, {
            path: "/",
            maxAge: 1,
          });

          setIsLocationLoading(false);
          toast.error(
            "Location access denied! Please enable location access and try again.",
          );
        },
      );
    } else {
    }
  }, [cookies, setCookie]);

  useEffect(() => {
    if (currentLocation) {
      setLocationCookie("user-location", JSON.stringify(currentLocation), {
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  useEffect(() => {
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    const isAndroid = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /android/.test(userAgent);
    };
    const isInStandaloneMode = () =>
      ("standalone" in window.navigator && window.navigator.standalone) ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (isIos() && isInStandaloneMode()) {
      setIsIos(true);
    }
    if (isAndroid() && isInStandaloneMode()) {
      setIsAndroid(true);
    }
  }, []);

  useEffect(() => {
    if (currentLocation && setUserCoordinates) {
      setUserCoordinates(currentLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser!");
      return;
    }

    setIsLocationLoading(true);
    let iosLocationTimeout: NodeJS.Timeout | null = null;
    if (isIos || isAndroid) {
      iosLocationTimeout = setTimeout(() => {
        setIsLocationLoading(false);
        setShowLocationError(true);
      }, 6000);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        setIsLocationLoading(false);
        setShowLocationError(false);
        if (iosLocationTimeout) clearTimeout(iosLocationTimeout);
        setCookie("location-allowed", true, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year
        });
      },
      () => {
        setIsLocationLoading(false);
        setShowLocationError(true);
        toast.error(
          "Location access denied! Please enable location access and try again.",
        );
      },
      {
        timeout: 5000,
      },
    );
  }, [setCookie, isIos, isAndroid]);

  const renderContent = () => {
    if (children) {
      return (
        <button className={className} onClick={handleGetLocation}>
          {typeof children === "function"
            ? children({ isLocationLoading })
            : children}
        </button>
      );
    }

    return (
      <button
        className={`absolute bottom-[110px] right-2 z-10 rounded-full bg-white p-3 outline-none focus:outline-none ${
          isLocationLoading ? "animate-spin" : ""
        }`}
        onClick={handleGetLocation}
      >
        {isLocationLoading ? (
          <SpinnerIcon className="h-5 w-5 text-blue-600" />
        ) : (
          <LocationIcon className="h-5 w-5 text-blue-600" />
        )}
      </button>
    );
  };

  return (
    <>
      {renderContent()}
      <Drawer
        open={(isIos || isAndroid) && showLocationError}
        onOpenChange={setShowLocationError}
      >
        <DrawerContent className="flex flex-col items-center justify-center px-5 pb-[env(safe-area-inset-bottom)] text-center">
          <DrawerHeader className="pt-10">
            <div className="mb-10 text-xl font-semibold">
              Facing issues getting your location?
            </div>
          </DrawerHeader>
          <div className="text-md mb-10 px-10">
            {isIos
              ? "Try enabling location access for Safari Websites and try again."
              : "Try enabling location access for Chrome and try again."}
          </div>
          <DrawerFooter>
            {isIos ? (
              <div>
                Go to <b>Settings</b> &gt; <b>Location Services</b> &gt;{" "}
                <b>Safari Websites</b> &gt; <b>Allow Location Access</b>
              </div>
            ) : (
              <div>
                Go to <b>Settings</b> &gt; <b>Apps</b> &gt; <b>Chrome</b> &gt;{" "}
                <b>Permissions</b> &gt; <b>Location</b> &gt; <b>Allow Access</b>
              </div>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UserLocation;
