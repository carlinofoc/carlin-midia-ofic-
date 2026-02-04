
import { LiteConfig } from '../types';

/**
 * Carlin Lite Engine v5.5 - Hierarchical Architecture with Auto-Control
 */

const DEFAULT_LITE_CONFIG: LiteConfig = {
  maxDataUsageMB: 10,
  maxRamUsageGB: 2,
  cpuLimitPercent: 40,
  reduceImageQuality: true,
  disableAutoPlayVideos: true,
  aggressiveCache: true
};

/**
 * 1. NetworkMonitor
 * Responsible for connectivity health and data metering.
 */
class NetworkMonitor {
  private usedDataMB = 0;
  private drops = 0;

  public getQuality() {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return {
      rtt: conn?.rtt || 0,
      downlink: conn?.downlink || 0,
      effectiveType: conn?.effectiveType || 'unknown',
      saveData: conn?.saveData || false
    };
  }

  public isConnectionWeak(): boolean {
    const q = this.getQuality();
    return q.rtt > 250 || q.effectiveType.includes('2g') || q.saveData || !navigator.onLine;
  }

  public registerDrop() {
    this.drops++;
  }

  public getRecentDrops() {
    return this.drops;
  }

  public canLoad(sizeMB: number, limit: number, isLite: boolean): boolean {
    if (!isLite) return true;
    return (this.usedDataMB + sizeMB) <= limit;
  }

  public registerUsage(sizeMB: number) {
    this.usedDataMB += sizeMB;
    window.dispatchEvent(new CustomEvent('carlin-data-usage-updated', { detail: this.usedDataMB }));
  }

  public resetUsage() {
    this.usedDataMB = 0;
    this.drops = 0;
    window.dispatchEvent(new CustomEvent('carlin-data-usage-updated', { detail: 0 }));
  }

  public getUsedDataMB(): number {
    return this.usedDataMB;
  }
}

/**
 * 2. MemoryManager
 * Responsible for heap monitoring and RAM allocation.
 */
class MemoryManager {
  public getHeapLimit(): number {
    const performanceMemory = (window.performance as any)?.memory;
    return performanceMemory 
      ? Math.floor(performanceMemory.jsHeapSizeLimit / 1024 / 1024) 
      : 2048;
  }

  public getUsedHeap(): number {
    const performanceMemory = (window.performance as any)?.memory;
    return performanceMemory ? Math.floor(performanceMemory.usedJSHeapSize / 1024 / 1024) : 0;
  }

  public getFreeRAM(): number {
    return this.getHeapLimit() - this.getUsedHeap();
  }

  public getAllocatedMB(configLimitGB: number): number {
    const systemMax = this.getHeapLimit();
    const configMax = configLimitGB * 1024;
    return Math.min(configMax, systemMax);
  }
}

/**
 * 3. CpuManager
 * Responsible for FPS throttling and thermal/pressure simulation.
 */
class CpuManager {
  private lastFrameTime = performance.now();
  private cpuLoad = 0;

  constructor() {
    this.monitorCpu();
  }

  private monitorCpu() {
    const tick = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      // If frame takes > 20ms, we assume 100% of 60fps budget used or background pressure
      const instantLoad = Math.min(100, (delta / 16.6) * 100);
      this.cpuLoad = this.cpuLoad * 0.9 + instantLoad * 0.1; // Smooth average
      this.lastFrameTime = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  public getCpuUsage(): number {
    return Math.round(this.cpuLoad);
  }

  public getFrameDelay(isLite: boolean): number {
    return isLite ? 32 : 16;
  }

  public getSystemPressure(isLite: boolean, cpuLimit: number): 'normal' | 'optimized' | 'high' {
    if (!isLite) return 'normal';
    return cpuLimit > 60 ? 'high' : 'optimized';
  }
}

/**
 * 4. CacheManager
 * Implements LRU logic for local data persistence.
 */
class CacheManager {
  private cache = new Map<string, { data: any, size: number }>();
  private currentSizeMB = 0;

  public get(key: string): any {
    const item = this.cache.get(key);
    if (item) {
      this.cache.delete(key);
      this.cache.set(key, item);
      return item.data;
    }
    return null;
  }

  public set(key: string, data: any, sizeMB: number, maxLimitMB: number) {
    if (this.cache.has(key)) {
      const oldItem = this.cache.get(key)!;
      this.currentSizeMB -= oldItem.size;
      this.cache.delete(key);
    }

    this.cache.set(key, { data, size: sizeMB });
    this.currentSizeMB += sizeMB;
    this.prune(maxLimitMB);
    
    window.dispatchEvent(new CustomEvent('carlin-memory-updated', { detail: { 
      used: this.currentSizeMB, 
      max: maxLimitMB 
    }}));
  }

  private prune(maxLimitMB: number) {
    const keys = this.cache.keys();
    while (this.currentSizeMB > maxLimitMB && this.cache.size > 0) {
      const oldestKey = keys.next().value;
      if (oldestKey) {
        const item = this.cache.get(oldestKey)!;
        this.currentSizeMB -= item.size;
        this.cache.delete(oldestKey);
      }
    }
  }

  public getStatus() {
    return {
      used: this.currentSizeMB,
      items: this.cache.size
    };
  }
}

/**
 * 5. LiteAutoController
 * Decides automatic behaviors based on hardware/network triggers.
 */
class LiteAutoController {
  private autoActive = false;
  private reason = '';

  public runAutoDiagnosis(
    network: NetworkMonitor, 
    memory: MemoryManager, 
    cpu: CpuManager,
    config: LiteConfig,
    onAdjust: (newConfig: Partial<LiteConfig>, enableLite: boolean) => void
  ) {
    const net = network.getQuality();
    const ramFree = memory.getFreeRAM();
    const cpuLoad = cpu.getCpuUsage();
    const drops = network.getRecentDrops();

    let shouldEnableLite = false;
    let adjustments: Partial<LiteConfig> = {};
    let currentReason = '';

    // Network Logic
    if (net.rtt > 250 || drops >= 2) {
      shouldEnableLite = true;
      adjustments.reduceImageQuality = true;
      adjustments.disableAutoPlayVideos = true;
      currentReason = 'Network Latency Critical';
    }

    // RAM Logic
    if (ramFree < 1536) { // 1.5GB
      shouldEnableLite = true;
      adjustments.maxRamUsageGB = 1;
      adjustments.aggressiveCache = true;
      currentReason = ramFree < 500 ? 'Low Memory Panic' : 'Memory Optimized';
    }

    // CPU Logic
    if (cpuLoad > 75) {
      shouldEnableLite = true;
      adjustments.cpuLimitPercent = 60;
      currentReason = 'High CPU Pressure';
    }

    // Recovery Logic
    if (net.rtt < 100 && ramFree > 3072 && cpuLoad < 40 && !shouldEnableLite) {
      this.autoActive = false;
      this.reason = 'System Stable';
      onAdjust(DEFAULT_LITE_CONFIG, false);
      return;
    }

    if (shouldEnableLite) {
      this.autoActive = true;
      this.reason = currentReason;
      onAdjust(adjustments, true);
    }
  }

  public getStatus() {
    return { active: this.autoActive, reason: this.reason };
  }
}

/**
 * LiteManager (Root)
 * Main Orchestrator of the Lite Engine.
 */
class LiteManager {
  private config: LiteConfig;
  private enabled: boolean;

  // Sub-Managers
  public network = new NetworkMonitor();
  public memory = new MemoryManager();
  public cpu = new CpuManager();
  public cache = new CacheManager();
  public auto = new LiteAutoController();

  constructor() {
    const savedConfig = localStorage.getItem('carlin_lite_config');
    const savedEnabled = localStorage.getItem('carlin_lite_mode');
    this.config = savedConfig ? JSON.parse(savedConfig) : DEFAULT_LITE_CONFIG;
    this.enabled = savedEnabled === 'true';

    // Start Auto-Controller loop
    setInterval(() => {
      this.auto.runAutoDiagnosis(
        this.network, 
        this.memory, 
        this.cpu, 
        this.config, 
        (adj, enable) => {
          this.config = { ...this.config, ...adj };
          if (enable && !this.enabled) {
            console.log(`[LiteManager] Auto-Enabled: ${this.auto.getStatus().reason}`);
            this.setEnabled(true);
            window.dispatchEvent(new CustomEvent('carlin-lite-auto-triggered'));
          }
        }
      );
    }, 5000);
  }

  public getConfig(): LiteConfig { return { ...this.config }; }

  public setConfig(newConfig: LiteConfig) {
    this.config = { ...newConfig };
    localStorage.setItem('carlin_lite_config', JSON.stringify(this.config));
    window.dispatchEvent(new CustomEvent('carlin-lite-config-changed'));
  }

  public isLiteEnabled(): boolean { return this.enabled; }
  public setEnabled(value: boolean) {
    this.enabled = value;
    localStorage.setItem('carlin_lite_mode', value.toString());
    window.dispatchEvent(new CustomEvent('carlin-lite-mode-changed', { detail: value }));
  }

  // Facade Methods
  public getFrameDelay(): number { return this.cpu.getFrameDelay(this.enabled); }
  public isConnectionWeak(): boolean { return this.network.isConnectionWeak(); }
  
  public getOptimizedImageUrl(url: string): string {
    const forceOpt = this.auto.getStatus().active || this.enabled || this.isConnectionWeak();
    if (!forceOpt || !this.config.reduceImageQuality) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=480&h=480&q=60`;
  }

  public getMemoryStatus() {
    const cacheStatus = this.cache.getStatus();
    const max = this.memory.getAllocatedMB(this.config.maxRamUsageGB);
    return { ...cacheStatus, max };
  }
}

export const liteModeManager = new LiteManager();

// Compatibility exports for existing code
export const networkLimiter = liteModeManager.network;
export const memoryCacheManager = {
  get: (key: string) => liteModeManager.cache.get(key),
  set: (key: string, data: any, sizeMB: number = 0.5) => 
    liteModeManager.cache.set(key, data, sizeMB, liteModeManager.getMemoryStatus().max),
  recalculateLimit: () => {},
  getStatus: () => liteModeManager.getMemoryStatus()
};
