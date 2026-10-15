import { useEffect, useCallback } from "react";
import { CheatingEvent } from "./useCamera";

interface UseAntiCheatOptions {
  onCheatingDetected: (event: CheatingEvent) => void;
  enabled: boolean;
}

export function useAntiCheat({ onCheatingDetected, enabled }: UseAntiCheatOptions) {

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && enabled) {
      onCheatingDetected({
        type:      "tab_switch",
        message:   "Tab switch detected — do not leave the interview tab",
        timestamp: new Date().toISOString(),
      });
    }
  }, [enabled, onCheatingDetected]);

  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement && enabled) {
      onCheatingDetected({
        type:      "fullscreen_exit",
        message:   "Fullscreen exited — please stay in fullscreen mode",
        timestamp: new Date().toISOString(),
      });
    }
  }, [enabled, onCheatingDetected]);

  const handleCopy          = useCallback((e: ClipboardEvent) => { if (enabled) e.preventDefault(); }, [enabled]);
  const handleContextMenu   = useCallback((e: MouseEvent)     => { if (enabled) e.preventDefault(); }, [enabled]);

  const enterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy",             handleCopy        as any);
    document.addEventListener("contextmenu",      handleContextMenu as any);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy",             handleCopy        as any);
      document.removeEventListener("contextmenu",      handleContextMenu as any);
    };
  }, [enabled, handleVisibilityChange, handleFullscreenChange, handleCopy, handleContextMenu]);

  return { enterFullscreen, exitFullscreen };
}