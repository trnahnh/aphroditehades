import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import KatanaCaptcha from "@/components/KatanaCaptcha";
import type { CaptchaStatus } from "@/components/KatanaCaptcha";

// =============================================================================
// COMPONENT
// =============================================================================

const CaptchaPage = () => {
  const [status, setStatus] = useState<CaptchaStatus>("idle");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleVerified = (token: string) => {
    setVerificationToken(token);
    toast.success("CAPTCHA verified successfully!");
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  const handleReset = () => {
    setCaptchaKey((prev) => prev + 1);
    setVerificationToken(null);
  };

  // ---------------------------------------------------------------------------
  // STATUS BADGE
  // ---------------------------------------------------------------------------

  const getStatusBadge = () => {
    const badges: Record<CaptchaStatus, ReactNode> = {
      idle: <Badge variant="secondary">Loading...</Badge>,
      ready: <Badge className="bg-blue-500">Ready</Badge>,
      drawing: <Badge className="bg-yellow-500">Drawing...</Badge>,
      verifying: <Badge variant="secondary">Verifying...</Badge>,
      success: <Badge className="bg-green-500">Verified!</Badge>,
      failed: <Badge className="bg-red-500">Failed</Badge>,
    };
    return badges[status];
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* CAPTCHA Demo Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Katana Slash CAPTCHA</CardTitle>
              <CardDescription>
                Draw the gesture pattern to verify you're human.
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* CAPTCHA Component */}
          <div className="flex justify-center">
            <KatanaCaptcha
              key={captchaKey}
              onVerified={handleVerified}
              onError={handleError}
              onStatusChange={setStatus}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleReset}>
              New Challenge
            </Button>
          </div>

          {/* Success Token Display */}
          {status === "success" && verificationToken && (
            <div className="p-4 border rounded-lg bg-green-500/10 space-y-2">
              <p className="text-sm font-medium text-green-600">
                Verification Token (valid for 5 minutes):
              </p>
              <code className="text-xs break-all block p-2 bg-muted rounded">
                {verificationToken}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Documentation Card */}
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>
            Integrate Katana CAPTCHA into your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Endpoint 1 */}
          <div className="space-y-2">
            <h4 className="font-medium">1. Create Challenge</h4>
            <code className="text-sm block p-3 bg-muted rounded">
              POST /api/captcha/create
            </code>
            <pre className="text-xs p-3 bg-muted rounded overflow-x-auto">
{`// Response
{
  "session_id": "a1b2c3...",
  "challenge": "slash_down_left",
  "instruction": "Slash from top-right to bottom-left",
  "expires_in": 120
}`}
            </pre>
          </div>

          {/* Endpoint 2 */}
          <div className="space-y-2">
            <h4 className="font-medium">2. Verify Gesture</h4>
            <code className="text-sm block p-3 bg-muted rounded">
              POST /api/captcha/verify
            </code>
            <pre className="text-xs p-3 bg-muted rounded overflow-x-auto">
{`// Request
{
  "session_id": "a1b2c3...",
  "start_x": 350,
  "start_y": 50,
  "end_x": 50,
  "end_y": 250,
  "duration_ms": 450,
  "point_count": 28
}

// Response
{
  "success": true,
  "token": "eyJhbGc..."
}`}
            </pre>
          </div>

          {/* React Usage */}
          <div className="space-y-2">
            <h4 className="font-medium">3. React Component Usage</h4>
            <pre className="text-xs p-3 bg-muted rounded overflow-x-auto">
{`import KatanaCaptcha from "@/components/KatanaCaptcha";

<KatanaCaptcha
  onVerified={(token) => {
    // Submit token with your form
    console.log("Verified:", token);
  }}
  onError={(error) => console.error(error)}
  onStatusChange={(status) => console.log(status)}
  width={400}
  height={250}
  strokeColor="#a855f7"
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaptchaPage;