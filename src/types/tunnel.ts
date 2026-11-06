export type TabType = 'overview' | 'traffic' | 'protocol' | 'inspector' | 'nodes' | 'clients' | 'install';

export type Language = 'fa' | 'en';

export interface AuthStatus {
  passwordProtected: boolean;
  isAuthenticated: boolean;
  username: string;
}

export interface ProtocolConfig {
  protocolName: string;
  version: string;
  port: number;
  cipher: 'CHACHA20_POLY1305' | 'AES_256_GCM' | 'XOR_STREAM';
  obfuscationMode: 'TLS_1_3_CAMOUFLAGE' | 'WEBSOCKET_BINARY' | 'RAW_DYNAMIC_PADDING' | 'HTTP2_GRPC_MIMIC';
  decoySni: string;
  fallbackUrl: string;
  psk: string;
  minPaddingBytes: number;
  maxPaddingBytes: number;
  muxMaxStreams: number;
  heartbeatIntervalSec: number;
  antiProbeEnabled: boolean;
}

export interface TunnelNode {
  id: string;
  name: string;
  role: 'BRIDGE' | 'RELAY' | 'EXIT' | 'CLIENT';
  location: string;
  countryCode: string;
  ip: string;
  port: number;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  uptime: string;
  totalRxBytes: number;
  totalTxBytes: number;
  activeStreams: number;
  loadPercent: number;
}

export interface ClientToken {
  id: string;
  name: string;
  tokenKey: string;
  assignedTo: string;
  quotaGb: number;
  usedGb: number;
  maxSpeedMbps: number;
  maxConcurrentDevices: number;
  activeDevices: number;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  allowedProtocols: string[];
  createdAt: string;
}

export interface WirePacket {
  id: string;
  timestamp: string;
  direction: 'INBOUND' | 'OUTBOUND';
  streamId: number;
  command: string;
  wireBytes: number;
  payloadBytes: number;
  paddingBytes: number;
  obfuscation: string;
  rawHexHeader: string;
  targetPreview: string;
  checksum: string;
}

export interface TunnelStats {
  totalPackets: number;
  totalRxBytes: number;
  totalTxBytes: number;
  activeStreams: number;
  handshakesTotal: number;
  probeBlockedCount: number;
  dpiEvasionScore: number;
  avgLatencyMs: number;
  uptimeFormatted: string;
  currentPps: number;
  rxSpeedMbps: number;
  txSpeedMbps: number;
  activeNodesCount: number;
  totalNodesCount: number;
  cipher: string;
  obfuscationMode: string;
}

export interface TrafficTestResult {
  success: boolean;
  tunnelProtocol: {
    name: string;
    profile: string;
    streamId: number;
    cipher: string;
    magicHeader: string;
    requestPaddingBytes: number;
    responsePaddingBytes: number;
    requestHex: string;
    responseHex: string;
    dpiEntropyEstimate: string;
  };
  targetUrl: string;
  httpStatus: number;
  httpStatusText: string;
  headers: Record<string, string>;
  data: any;
  rawPreview: string;
  metrics: {
    totalRoundTripMs: number;
    tunnelOverheadMs: number;
    targetFetchMs: number;
    wireBytesSent: number;
    wireBytesReceived: number;
    payloadBytes: number;
    compressionRatio: string;
  };
}
