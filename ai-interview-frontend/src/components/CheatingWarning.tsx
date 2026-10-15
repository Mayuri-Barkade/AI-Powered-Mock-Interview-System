import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { CheatingEvent } from "@/hooks/useCamera";

interface Props {
  event: CheatingEvent | null;
  onDismiss: () => void;
  totalWarnings: number;
}

export default function CheatingWarning({ event, onDismiss, totalWarnings }: Props) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{   opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className="rounded-2xl border-2 border-destructive bg-destructive/10 p-4 flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-destructive">
                ⚠️ Integrity Warning #{totalWarnings}
              </p>
              <p className="text-sm text-foreground mt-0.5">{event.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                All warnings are recorded and visible to the examiner.
              </p>
            </div>
            <button onClick={onDismiss}>
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}