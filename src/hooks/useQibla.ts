import { useState, useEffect, useCallback, useRef } from "react";

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

/** Calculate Qibla bearing from a given position using the great-circle formula */
function calculateQiblaDirection(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LNG - lng);

  const x = Math.sin(Δλ);
  const y = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);

  let bearing = toDeg(Math.atan2(x, y));
  return (bearing + 360) % 360;
}

export interface QiblaState {
  qiblaBearing: number | null;
  compassHeading: number | null;
  qiblaRelative: number | null;
  userLat: number | null;
  userLng: number | null;
  locationError: string | null;
  compassError: string | null;
  compassSupported: boolean;
  loading: boolean;
}

export function useQibla() {
  const [state, setState] = useState<QiblaState>({
    qiblaBearing: null,
    compassHeading: null,
    qiblaRelative: null,
    userLat: null,
    userLng: null,
    locationError: null,
    compassError: null,
    compassSupported: true,
    loading: true,
  });

  const headingRef = useRef<number | null>(null);

  // Request geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, locationError: "geolocation_unsupported", loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const bearing = calculateQiblaDirection(lat, lng);
        setState((s) => ({
          ...s,
          userLat: lat,
          userLng: lng,
          qiblaBearing: bearing,
          loading: false,
        }));
      },
      (err) => {
        let msg = "location_error";
        if (err.code === 1) msg = "location_denied";
        if (err.code === 2) msg = "location_unavailable";
        setState((s) => ({ ...s, locationError: msg, loading: false }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Device orientation (compass)
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    let heading: number | null = null;

    // iOS provides webkitCompassHeading
    if ("webkitCompassHeading" in e && typeof (e as any).webkitCompassHeading === "number") {
      heading = (e as any).webkitCompassHeading;
    } else if (e.alpha !== null) {
      // Android: alpha is the compass heading (but inverted for north)
      heading = (360 - e.alpha) % 360;
    }

    if (heading !== null) {
      headingRef.current = heading;
      setState((s) => {
        const relative = s.qiblaBearing !== null ? (s.qiblaBearing - heading! + 360) % 360 : null;
        return { ...s, compassHeading: heading, qiblaRelative: relative };
      });
    }
  }, []);

  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const startListening = () => {
      window.addEventListener("deviceorientation", handleOrientation, true);
    };

    if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      // iOS 13+ requires explicit permission — we'll request it on user action
      setState((s) => ({ ...s, compassSupported: true }));
    } else if ("DeviceOrientationEvent" in window) {
      startListening();
    } else {
      setState((s) => ({ ...s, compassSupported: false, compassError: "compass_unsupported" }));
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [handleOrientation]);

  const requestCompassPermission = useCallback(async () => {
    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
          return true;
        } else {
          setState((s) => ({ ...s, compassError: "compass_denied" }));
          return false;
        }
      }
      return true;
    } catch {
      setState((s) => ({ ...s, compassError: "compass_error" }));
      return false;
    }
  }, [handleOrientation]);

  return { ...state, requestCompassPermission };
}
