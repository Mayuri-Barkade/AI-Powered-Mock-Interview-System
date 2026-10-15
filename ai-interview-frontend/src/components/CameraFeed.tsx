import { useEffect } from "react";
import { useCamera, type VideoScores } from "@/hooks/useCamera";
import type { CheatingEvent } from "@/hooks/useCamera";
import { Camera, CameraOff, AlertTriangle, Eye, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraFeedProps {
  onCheatingDetected?: (event: CheatingEvent) => void;
  warningCount?: number;
  autoStart?: boolean;
  cameraHook?: ReturnType<typeof useCamera>;  // ← accept external hook instance
}

export default function CameraFeed({
  onCheatingDetected,
  warningCount = 0,
  autoStart = false,
  cameraHook,
}: CameraFeedProps) {
  const internalCamera = useCamera();
  const {
    videoRef, canvasRef,
    isOn, modelsLoaded, videoMetrics, error,
    startCamera, stopCamera,
    startAnalysis, stopAnalysis,
  } = cameraHook ?? internalCamera;

  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => startCamera(), 500);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  useEffect(() => {
    if (isOn && modelsLoaded) {
      startAnalysis(onCheatingDetected);
    } else {
      stopAnalysis();
    }
  }, [isOn, modelsLoaded]);

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">

      {/* Video container */}
      <div className="relative bg-black w-full" style={{ height: "220px" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            transform: "scaleX(-1)",
            width:     "100%",
            height:    "100%",
            objectFit: "cover",
            display:   isOn ? "block" : "none",
          }}
        />

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Placeholder when off */}
        {!isOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <CameraOff className="w-10 h-10 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">Camera off</p>
          </div>
        )}

        {/* Warning badge */}
        {warningCount > 0 && (
          <div className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {warningCount}
          </div>
        )}

        {/* Live indicator */}
        {isOn && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 rounded-full px-2 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-white text-xs font-medium">LIVE</span>
          </div>
        )}

        {/* Live metrics overlay at bottom */}
        {isOn && videoMetrics.eyeContact !== "Unknown" && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 rounded-xl px-3 py-1.5">
            <span className="text-white text-xs flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {videoMetrics.eyeContact}
            </span>
            <span className="text-white text-xs flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {videoMetrics.posture}
            </span>
            <span className="text-xs font-bold text-green-400">
              {videoMetrics.confidenceScore}%
            </span>
          </div>
        )}

        {isOn && videoMetrics.eyeContact === "Unknown" && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center bg-black/40 rounded-xl px-3 py-1.5">
            <span className="text-white text-xs">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Controls + live score bars */}
      <div className="p-3 space-y-2">
        <Button
          variant={isOn ? "destructive" : "outline"}
          size="sm"
          className="w-full gap-2"
          onClick={isOn ? stopCamera : startCamera}
        >
          {isOn
            ? <><CameraOff className="w-4 h-4" /> Turn Off Camera</>
            : <><Camera    className="w-4 h-4" /> Turn On Camera</>
          }
        </Button>

        {/* Live score bars — only show when camera is analyzing */}
        {isOn && videoMetrics.eyeContact !== "Unknown" && (
          <div className="space-y-1.5 pt-1">
            {[
              { label: "Eye Contact",  value: videoMetrics.eyeContactScore,  color: "bg-blue-500" },
              { label: "Posture",      value: videoMetrics.postureScore,      color: "bg-green-500" },
              { label: "Confidence",   value: videoMetrics.confidenceScore,   color: "bg-purple-500" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                  <span>{s.label}</span>
                  <span>{s.value}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all duration-500`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-destructive text-center">{error}</p>}
      </div>
    </div>
  );
}