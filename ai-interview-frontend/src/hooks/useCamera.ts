import { useRef, useState, useEffect, useCallback } from "react";

export interface VideoMetrics {
  eyeContact:      "Good" | "Poor" | "Unknown";
  posture:         "Good" | "Sit up" | "Unknown";
  eyeContactScore: number;
  postureScore:    number;
  confidenceScore: number;
}

export interface CheatingEvent {
  type:      "no_face" | "multiple_faces" | "tab_switch" | "fullscreen_exit";
  message:   string;
  timestamp: string;
}

export interface VideoScores {
  eyeContactScore: number;
  postureScore:    number;
  confidenceScore: number;
}

const API_URL = "http://127.0.0.1:8000/api/ai_feedback/analyze-frame/";

export function useCamera() {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const intervalRef = useRef<any>(null);

  const eyeContactScores = useRef<number[]>([]);
  const postureScores    = useRef<number[]>([]);
  const confidenceScores = useRef<number[]>([]);

  const [isOn,         setIsOn]         = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [videoMetrics, setVideoMetrics] = useState<VideoMetrics>({
    eyeContact: "Unknown", posture: "Unknown",
    eyeContactScore: 0, postureScore: 0, confidenceScore: 0,
  });
  const [error,        setError]        = useState("");
  const [warnings,     setWarnings]     = useState<CheatingEvent[]>([]);
  const [warningCount, setWarningCount] = useState(0);

  const addWarning = useCallback((event: CheatingEvent) => {
    setWarnings((prev) => [...prev, event]);
    setWarningCount((prev) => prev + 1);
  }, []);

  const captureFrame = useCallback((): string | null => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width  = video.videoWidth  || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    return canvas.toDataURL("image/jpeg", 0.6);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
        };
      }

      // Reset score arrays for fresh session
      eyeContactScores.current = [];
      postureScores.current    = [];
      confidenceScores.current = [];

      setIsOn(true);
      setModelsLoaded(true);
      setError("");
    } catch (err) {
      setError("Camera access denied. Please allow camera permission.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsOn(false);
  }, []);

  const startAnalysis = useCallback((onCheatingDetected?: (event: CheatingEvent) => void) => {
    if (!videoRef.current) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      const frame = captureFrame();
      if (!frame) return;

      try {
        const res  = await fetch(API_URL, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ frame }),
        });
        const data = await res.json();

        if (data.warning === "no_face") {
          const event: CheatingEvent = {
            type:      "no_face",
            message:   "No face detected — please stay in front of the camera",
            timestamp: new Date().toISOString(),
          };
          addWarning(event);
          onCheatingDetected?.(event);
        } else if (data.warning === "multiple_faces") {
          const event: CheatingEvent = {
            type:      "multiple_faces",
            message:   "Multiple faces detected — only candidate should be visible",
            timestamp: new Date().toISOString(),
          };
          addWarning(event);
          onCheatingDetected?.(event);
        }

        // Accumulate scores every frame
        if (typeof data.eyeContactScore === "number") eyeContactScores.current.push(data.eyeContactScore);
        if (typeof data.postureScore    === "number") postureScores.current.push(data.postureScore);
        if (typeof data.confidenceScore === "number") confidenceScores.current.push(data.confidenceScore);

        setVideoMetrics({
          eyeContact:      data.eyeContact      ?? "Unknown",
          posture:         data.posture         ?? "Unknown",
          eyeContactScore: data.eyeContactScore ?? 0,
          postureScore:    data.postureScore    ?? 0,
          confidenceScore: data.confidenceScore ?? 0,
        });

      } catch (err) {
        console.error("Frame analysis error:", err);
      }
    }, 3000);
  }, [captureFrame, addWarning]);

  const stopAnalysis = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // Call this at end of interview to get final averaged scores
  const getFinalVideoScores = useCallback((): VideoScores => {
    const avg = (arr: number[]) =>
      arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    return {
      eyeContactScore:  avg(eyeContactScores.current),
      postureScore:     avg(postureScores.current),
      confidenceScore:  avg(confidenceScores.current),
    };
  }, []);

  useEffect(() => {
    return () => { stopCamera(); stopAnalysis(); };
  }, [stopCamera, stopAnalysis]);

  return {
    videoRef, canvasRef,
    isOn, modelsLoaded, videoMetrics, error,
    warnings, warningCount,
    startCamera, stopCamera,
    startAnalysis, stopAnalysis,
    getFinalVideoScores,
  };
}