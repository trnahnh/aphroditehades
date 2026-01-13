// =============================================================================
// TYPES
// =============================================================================

export interface FingerprintData {
    canvas_hash: string;
    webgl_hash: string;
    audio_hash: string;
    screen_resolution: string;
    timezone: string;
    language: string;
    platform: string;
    user_agent: string;
    color_depth: number;
    hardware_concurrency: number;
  }
  
  // =============================================================================
  // FINGERPRINT COLLECTORS
  // =============================================================================
  
  async function getCanvasFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";
  
      canvas.width = 200;
      canvas.height = 50;
  
      // Draw text with specific styling
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
  
      ctx.fillStyle = "#069";
      ctx.fillText("KatanaID 🗡️", 2, 15);
  
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("fingerprint", 4, 30);
  
      // Add some shapes
      ctx.beginPath();
      ctx.arc(50, 25, 10, 0, Math.PI * 2);
      ctx.stroke();
  
      return await hashString(canvas.toDataURL());
    } catch {
      return "";
    }
  }
  
  async function getWebGLFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return "";
  
      const webgl = gl as WebGLRenderingContext;
      const debugInfo = webgl.getExtension("WEBGL_debug_renderer_info");
  
      const data = [
        webgl.getParameter(webgl.VERSION),
        webgl.getParameter(webgl.SHADING_LANGUAGE_VERSION),
        webgl.getParameter(webgl.VENDOR),
        debugInfo ? webgl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "",
        debugInfo ? webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "",
      ].join("|");
  
      return await hashString(data);
    } catch {
      return "";
    }
  }
  
  async function getAudioFingerprint(): Promise<string> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gain = audioContext.createGain();
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
  
      gain.gain.value = 0; // Mute
      oscillator.type = "triangle";
      oscillator.frequency.value = 10000;
  
      oscillator.connect(analyser);
      analyser.connect(processor);
      processor.connect(gain);
      gain.connect(audioContext.destination);
  
      oscillator.start(0);
  
      const dataArray = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(dataArray);
  
      oscillator.stop();
      audioContext.close();
  
      const sum = dataArray.reduce((a, b) => a + b, 0);
      return await hashString(sum.toString());
    } catch {
      return "";
    }
  }
  
  // =============================================================================
  // MAIN COLLECTOR
  // =============================================================================
  
  export async function collectFingerprint(): Promise<FingerprintData> {
    const [canvasHash, webglHash, audioHash] = await Promise.all([
      getCanvasFingerprint(),
      getWebGLFingerprint(),
      getAudioFingerprint(),
    ]);
  
    return {
      canvas_hash: canvasHash,
      webgl_hash: webglHash,
      audio_hash: audioHash,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      user_agent: navigator.userAgent,
      color_depth: window.screen.colorDepth,
      hardware_concurrency: navigator.hardwareConcurrency || 0,
    };
  }
  
  // =============================================================================
  // HELPERS
  // =============================================================================
  
  async function hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }