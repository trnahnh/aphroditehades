import { useState, useRef, useEffect, useCallback } from "react";
import { axiosInstance } from "@/lib/axios";

// =============================================================================
// TYPES
// =============================================================================

interface ChallengeResponse {
  session_id: string;
  challenge: string;
  instruction: string;
  expires_in: number;
}

interface VerifyResponse {
  success: boolean;
  token?: string;
}

interface Point {
  x: number;
  y: number;
  time: number;
}

export type CaptchaStatus =
  | "idle"
  | "ready"
  | "drawing"
  | "verifying"
  | "success"
  | "failed";

export interface KatanaCaptchaProps {
  onVerified: (token: string) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: CaptchaStatus) => void;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 250;
const DEFAULT_STROKE_COLOR = "#a855f7";
const DEFAULT_STROKE_WIDTH = 4;

// =============================================================================
// COMPONENT
// =============================================================================

const KatanaCaptcha: React.FC<KatanaCaptchaProps> = ({
  onVerified,
  onError,
  onStatusChange,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  strokeColor = DEFAULT_STROKE_COLOR,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  className = "",
}) => {
  // Challenge state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [instruction, setInstruction] = useState<string>("");
  const [status, setStatus] = useState<CaptchaStatus>("idle");

  // Drawing state
  const pointsRef = useRef<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ---------------------------------------------------------------------------
  // STATUS HELPER
  // ---------------------------------------------------------------------------

  const updateStatus = useCallback(
    (newStatus: CaptchaStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange]
  );

  // ---------------------------------------------------------------------------
  // CANVAS HELPERS
  // ---------------------------------------------------------------------------

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pointsRef.current = [];
  }, []);

  const getCanvasCoords = useCallback(
    (e: React.MouseEvent | React.TouchEvent): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let clientX: number, clientY: number;

      if ("touches" in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
        time: Date.now(),
      };
    },
    []
  );

  const drawLine = useCallback(
    (from: Point, to: Point) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    },
    [strokeColor, strokeWidth]
  );

  // ---------------------------------------------------------------------------
  // API CALLS
  // ---------------------------------------------------------------------------

  const fetchChallenge = useCallback(async () => {
    updateStatus("idle");
    clearCanvas();

    try {
      const response = await axiosInstance.post<ChallengeResponse>(
        "/api/captcha/create"
      );
      setSessionId(response.data.session_id);
      setInstruction(response.data.instruction);
      updateStatus("ready");
    } catch {
      onError?.("Failed to load challenge");
      updateStatus("failed");
    }
  }, [updateStatus, clearCanvas, onError]);

  const verifyGesture = useCallback(
    async (gesturePoints: Point[]) => {
      if (!sessionId || gesturePoints.length < 2) return;

      updateStatus("verifying");

      const startPoint = gesturePoints[0];
      const endPoint = gesturePoints[gesturePoints.length - 1];
      const durationMs = endPoint.time - startPoint.time;

      try {
        const response = await axiosInstance.post<VerifyResponse>(
          "/api/captcha/verify",
          {
            session_id: sessionId,
            start_x: startPoint.x,
            start_y: startPoint.y,
            end_x: endPoint.x,
            end_y: endPoint.y,
            duration_ms: durationMs,
            point_count: gesturePoints.length,
          }
        );

        if (response.data.success && response.data.token) {
          updateStatus("success");
          onVerified(response.data.token);
        } else {
          updateStatus("failed");
          onError?.("Verification failed");
        }
      } catch {
        updateStatus("failed");
        onError?.("Verification error");
      }
    },
    [sessionId, updateStatus, onVerified, onError]
  );

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (status !== "ready" && status !== "failed") return;

      const point = getCanvasCoords(e);
      if (!point) return;

      clearCanvas();
      setIsDrawing(true);
      updateStatus("drawing");
      pointsRef.current = [point];
    },
    [status, getCanvasCoords, clearCanvas, updateStatus]
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;

      const point = getCanvasCoords(e);
      if (!point) return;

      const lastPoint = pointsRef.current[pointsRef.current.length - 1];
      if (lastPoint) {
        drawLine(lastPoint, point);
      }
      pointsRef.current.push(point);
    },
    [isDrawing, getCanvasCoords, drawLine]
  );

  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    verifyGesture(pointsRef.current);
  }, [isDrawing, verifyGesture]);

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventScroll = (e: TouchEvent) => {
      if (isDrawing) e.preventDefault();
    };

    canvas.addEventListener("touchmove", preventScroll, { passive: false });
    return () => canvas.removeEventListener("touchmove", preventScroll);
  }, [isDrawing]);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  const getInstructionText = () => {
    switch (status) {
      case "idle":
        return "Loading...";
      case "ready":
        return instruction;
      case "drawing":
        return "Keep drawing...";
      case "verifying":
        return "Verifying...";
      case "success":
        return "✓ Verified!";
      case "failed":
        return "Failed - Click to retry";
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Instruction */}
      <div className="text-sm text-muted-foreground text-center">
        {getInstructionText()}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`border rounded-lg bg-muted/30 touch-none
          ${status === "ready" || status === "failed" ? "cursor-crosshair" : "cursor-default"}
          ${status === "success" ? "border-green-500" : ""}
          ${status === "failed" ? "border-red-500" : ""}
        `}
        style={{ maxWidth: "100%", height: "auto" }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {/* Retry button */}
      {status === "failed" && (
        <button
          onClick={fetchChallenge}
          className="text-sm text-primary hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default KatanaCaptcha;