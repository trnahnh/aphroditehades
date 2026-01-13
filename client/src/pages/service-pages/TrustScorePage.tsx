import { useState, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTrustScore } from "@/hooks/use-trust-score";
import { toast } from "sonner";

// =============================================================================
// TYPES
// =============================================================================

interface Signal {
  name: string;
  score: number;
  reason: string;
}

interface TrustResult {
  score: number;
  signals: Signal[];
  recommendation: "allow" | "captcha" | "block";
  fingerprint_id: string;
}

// =============================================================================
// HELPERS
// =============================================================================

const SIGNAL_LABELS: Record<string, { icon: string; label: string }> = {
  fingerprint: { icon: "🖥️", label: "Device" },
  ip_reputation: { icon: "🌐", label: "IP Reputation" },
  email_pattern: { icon: "📧", label: "Email Pattern" },
  browser_signals: { icon: "🔍", label: "Browser" },
};

function getScoreColor(score: number): string {
  if (score >= 0.7) return "text-green-500";
  if (score >= 0.4) return "text-yellow-500";
  return "text-red-500";
}

function getRecommendationBadge(rec: string): ReactNode {
  switch (rec) {
    case "allow":
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">✓ Allow</Badge>;
    case "captcha":
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">⚔️ Require CAPTCHA</Badge>;
    case "block":
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">✕ Block</Badge>;
    default:
      return null;
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function TrustScorePage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<TrustResult | null>(null);
  const { checkTrust, isLoading, fingerprint } = useTrustScore();

  const handleCheck = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    const trustResult = await checkTrust(email);
    if (trustResult) {
      setResult(trustResult);
      toast.success("Trust score calculated");
    } else {
      toast.error("Failed to calculate trust score");
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">🛡️ Trial Abuse Prevention</h1>
        <p className="text-muted-foreground mt-2">
          Detect and prevent users from creating multiple trial accounts using device fingerprinting and trust scoring.
        </p>
      </div>

      {/* Check Card */}
      <Card>
        <CardHeader>
          <CardTitle>Check Trust Score</CardTitle>
          <CardDescription>
            Enter an email to calculate the trust score based on device fingerprint and behavioral signals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
            <Button onClick={handleCheck} disabled={isLoading}>
              {isLoading ? "Checking..." : "Check"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Trust Analysis</CardTitle>
              {getRecommendationBadge(result.recommendation)}
            </div>
            <CardDescription>Fingerprint ID: {result.fingerprint_id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center py-4">
              <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                {Math.round(result.score * 100)}%
              </div>
              <div className="text-muted-foreground mt-1">Trust Score</div>
            </div>

            {/* Signal Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium">Signal Breakdown</h4>
              {result.signals.map((signal) => (
                <div
                  key={signal.name}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {SIGNAL_LABELS[signal.name]?.icon || "📊"}
                    </span>
                    <div>
                      <div className="font-medium">
                        {SIGNAL_LABELS[signal.name]?.label || signal.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{signal.reason}</div>
                    </div>
                  </div>
                  <div className={`font-mono font-bold ${getScoreColor(signal.score)}`}>
                    {Math.round(signal.score * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fingerprint Debug Card */}
      {fingerprint && (
        <Card>
          <CardHeader>
            <CardTitle>🔬 Your Device Fingerprint</CardTitle>
            <CardDescription>
              Collected signals from your browser (for demo purposes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Screen</div>
                <div className="font-mono">{fingerprint.screen_resolution}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Timezone</div>
                <div className="font-mono">{fingerprint.timezone}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Language</div>
                <div className="font-mono">{fingerprint.language}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Platform</div>
                <div className="font-mono">{fingerprint.platform}</div>
              </div>
              <div>
                <div className="text-muted-foreground">CPU Cores</div>
                <div className="font-mono">{fingerprint.hardware_concurrency}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Color Depth</div>
                <div className="font-mono">{fingerprint.color_depth}-bit</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Docs Card */}
      <Card>
        <CardHeader>
          <CardTitle>📖 API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">POST /api/trust/score</h4>
            <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "fingerprint": {
    "canvas_hash": "abc123...",
    "webgl_hash": "def456...",
    "audio_hash": "ghi789...",
    "screen_resolution": "1920x1080",
    "timezone": "America/New_York",
    "language": "en-US",
    "platform": "Win32",
    "user_agent": "Mozilla/5.0...",
    "color_depth": 24,
    "hardware_concurrency": 8
  },
  "email": "user@example.com"
}`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Response</h4>
            <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "score": 0.85,
  "signals": [
    { "name": "fingerprint", "score": 1.0, "reason": "New device" },
    { "name": "ip_reputation", "score": 0.9, "reason": "Known IP" },
    { "name": "email_pattern", "score": 0.7, "reason": "Unique email" },
    { "name": "browser_signals", "score": 0.8, "reason": "Normal browser" }
  ],
  "recommendation": "allow",
  "fingerprint_id": "a1b2c3d4e5f6"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}