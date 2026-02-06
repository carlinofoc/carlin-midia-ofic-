
import { LiteConfig, LiteMode } from '../types';

/**
 * Carlin Lite Engine v5.9.9 - Ternary Mode Hierarchy & Tiered Rule Enforcement
 */

const DEFAULT_LITE_CONFIG: LiteConfig = {
  maxDataUsageMB: 15,
  maxRamUsageGB: 4,
  cpuLimitPercent: 80,
  reduceImageQuality: false,
  disableAutoPlayVideos: false,
  aggressiveCache: false
};

/**
 * 1. NetworkMonitor
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
      saveData: conn?.saveData || false,
      type: conn?.type || 'unknown'
    };
  }

  public isUnmetered(): boolean {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!conn) return true;
    if (conn.saveData === true) return false;
    if (conn.type) return ['wifi', 'ethernet', 'fiber'].includes(conn.type);
    return conn.effectiveType === '4g' && conn.rtt < 100;
  }

  public isConnectionWeak(): boolean {
    const q = this.getQuality();
    return q.rtt > 250 || q.effectiveType.includes('2g') || q.saveData || !navigator.onLine;
  }

  public registerDrop() { this.drops++; }
  public getRecentDrops() { return this.drops; }

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

  public getUsedDataMB(): number { return this.usedDataMB; }
}

/**
 * 2. MemoryManager
 */
class MemoryManager {
  public getTotalRamGB(): number {
    return (navigator as any).deviceMemory || 4; 
  }

  public getAndroidVersion(): number {
    const ua = navigator.userAgent;
    const match = ua.match(/Android\s([0-9\.]+)/);
    return match ? parseFloat(match[1]) : 13; 
  }

  public isLowEndDevice(): boolean {
    const ram = this.getTotalRamGB();
    const cores = navigator.hardwareConcurrency || 8;
    return ram <= 4 || cores <= 4;
  }

  public getHeapLimit(): number {
    const performanceMemory = (window.performance as any)?.memory;
    return performanceMemory ? Math.floor(performanceMemory.jsHeapSizeLimit / 1024 / 1024) : 2048;
  }

  public getUsedHeap(): number {
    const performanceMemory = (window.performance as any)?.memory;
    return performanceMemory ? Math.floor(performanceMemory.usedJSHeapSize / 1024 / 1024) : 0;
  }

  public getFreeRAM(): number { return this.getHeapLimit() - this.getUsedHeap(); }

  public getAllocatedMB(configLimitGB: number): number {
    const systemMax = this.getHeapLimit();
    const configMax = configLimitGB * 1024;
    return Math.min(configMax, systemMax);
  }
}

/**
 * 3. CpuManager
 */
class CpuManager {
  private lastFrameTime = performance.now();
  private cpuLoad = 0;

  constructor() { this.monitorCpu(); }

  private monitorCpu() {
    const tick = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      const instantLoad = Math.min(100, (delta / 16.6) * 100);
      this.cpuLoad = this.cpuLoad * 0.9 + instantLoad * 0.1;
      this.lastFrameTime = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  public getCpuUsage(): number { return Math.round(this.cpuLoad); }
  public getFrameDelay(mode: LiteMode): number { 
    if (mode === LiteMode.LITE_AVANCADO) return 64; 
    if (mode === LiteMode.LITE_ANTIGO) return 32;   
    return 16;                                      
  }
}

/**
 * 4. CacheManager
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
    this.broadcastUpdate(maxLimitMB);
  }

  public clear() {
    this.cache.clear();
    this.currentSizeMB = 0;
    this.broadcastUpdate(0);
  }

  private broadcastUpdate(max: number) {
    window.dispatchEvent(new CustomEvent('carlin-memory-updated', { detail: { used: this.currentSizeMB, max: max }}));
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

  public getStatus() { return { used: this.currentSizeMB, items: this.cache.size }; }
}

/**
 * 5. LiteAutoController
 */
class LiteAutoController {
  private autoActive = false;
  private reason = '';

  public runAutoDiagnosis(
    network: NetworkMonitor, 
    memory: MemoryManager, 
    cpu: CpuManager,
    config: LiteConfig,
    onAdjust: (newConfig: Partial<LiteConfig>, enableLiteMode: LiteMode) => void
  ) {
    const net = network.getQuality();
    const ramFree = memory.getFreeRAM();
    const cpuLoad = cpu.getCpuUsage();
    const isLowEnd = memory.isLowEndDevice();

    let targetMode = LiteMode.NORMAL;
    let adjustments: Partial<LiteConfig> = {};
    let currentReason = '';

    if (isLowEnd || ramFree < 500) { 
      targetMode = LiteMode.LITE_AVANCADO; 
      currentReason = 'Device Hardware Critical'; 
    } else if (net.rtt > 250 || ramFree < 1536 || cpuLoad > 75) {
      targetMode = LiteMode.LITE_ANTIGO;
      currentReason = 'System Resources Throttled';
    }

    if (targetMode !== LiteMode.NORMAL) {
      this.autoActive = true;
      this.reason = currentReason;
      onAdjust(adjustments, targetMode);
    } else {
      this.autoActive = false;
      this.reason = 'System Stable';
    }
  }

  public getStatus() { return { active: this.autoActive, reason: this.reason }; }
}

/**
 * LiteManager (Root)
 * Replicates Kotlin: object LiteModeManager
 */
class LiteManager {
  private config: LiteConfig;
  private mode: LiteMode = LiteMode.NORMAL;
  
  public userSelectedLiteAvancado: boolean = false;
  private autoDiagnosticHandle: any = null;

  public network = new NetworkMonitor();
  public memory = new MemoryManager();
  public cpu = new CpuManager();
  public cache = new CacheManager();
  public auto = new LiteAutoController();

  constructor() {
    const savedConfig = localStorage.getItem('carlin_lite_config');
    this.config = savedConfig ? JSON.parse(savedConfig) : DEFAULT_LITE_CONFIG;
    this.init();
    this.startBackgroundLoops();
  }

  private startBackgroundLoops() {
    if (this.autoDiagnosticHandle) clearInterval(this.autoDiagnosticHandle);
    
    // Auto-diagnosis is disabled in Ancient mode to save CPU
    if (this.mode === LiteMode.LITE_ANTIGO) return;

    const interval = this.shouldRunBackgroundTask ? 5000 : 15000;

    this.autoDiagnosticHandle = setInterval(() => {
      if (this.userSelectedLiteAvancado) return;

      this.auto.runAutoDiagnosis(
        this.network, 
        this.memory, 
        this.cpu, 
        this.config, 
        (adj, newMode) => {
          this.config = { ...this.config, ...adj };
          if (newMode !== this.mode) {
            this.setMode(newMode, false);
            window.dispatchEvent(new CustomEvent('carlin-lite-auto-triggered'));
          }
        }
      );
    }, interval);
  }

  /**
   * Replicates logic: disableBackground()
   */
  public get shouldRunBackgroundTask(): boolean {
    return this.mode === LiteMode.NORMAL;
  }

  public detectLiteMode(): LiteMode {
    const ramGB = this.memory.getTotalRamGB();
    const androidVer = this.memory.getAndroidVersion();
    if (androidVer <= 9 || ramGB <= 2) {
      return LiteMode.LITE_ANTIGO;
    }
    return LiteMode.NORMAL;
  }

  public getCurrentMode(): LiteMode {
    const autoMode = this.detectLiteMode();
    return this.userSelectedLiteAvancado ? LiteMode.LITE_AVANCADO : autoMode;
  }

  public init() {
    const savedMode = localStorage.getItem('carlin_lite_mode_enum') as LiteMode;
    const savedUserSelected = localStorage.getItem('carlin_user_selected_avancado') === 'true';
    this.userSelectedLiteAvancado = savedUserSelected;

    if (savedMode && Object.values(LiteMode).includes(savedMode)) {
      this.mode = savedMode;
    } else {
      this.mode = this.getCurrentMode();
      localStorage.setItem('carlin_lite_mode_enum', this.mode);
    }
    
    this.applyLiteRules(this.mode);
  }

  public get isLiteEnabled(): boolean {
    return this.mode !== LiteMode.NORMAL;
  }

  public getLiteMode(): LiteMode {
    return this.mode;
  }

  public setMode(value: LiteMode, isManual: boolean = true) {
    this.mode = value;
    
    if (isManual) {
      this.userSelectedLiteAvancado = value === LiteMode.LITE_AVANCADO;
      localStorage.setItem('carlin_user_selected_avancado', this.userSelectedLiteAvancado.toString());
    }

    localStorage.setItem('carlin_lite_mode_enum', value);
    this.applyLiteRules(value);
    window.dispatchEvent(new CustomEvent('carlin-lite-mode-changed', { detail: value }));
    this.startBackgroundLoops();
  }

  /**
   * Replicates Kotlin: fun applyModeRules(mode: LiteMode)
   */
  public async applyLiteRules(mode: LiteMode = this.mode) {
    let newConfig: LiteConfig = { ...this.config };

    switch (mode) {
      case LiteMode.LITE_ANTIGO:
        // disableAnimations() handled via CSS class in App.tsx tied to mode
        newConfig.maxDataUsageMB = 5;       // limitNetwork(5)
        newConfig.reduceImageQuality = true; // limitImages(4) mapping
        newConfig.disableAutoPlayVideos = true;
        newConfig.aggressiveCache = true;
        // disableBackground() handled via shouldRunBackgroundTask getter
        break;

      case LiteMode.LITE_AVANCADO:
        newConfig.disableAutoPlayVideos = true; // disableAutoPlay()
        // reduceNotifications() handled in NotificationSystem.tsx
        newConfig.maxDataUsageMB = 10;          // limitNetwork(10)
        newConfig.reduceImageQuality = true;    // limitImages(8) mapping
        newConfig.aggressiveCache = true;
        break;

      case LiteMode.NORMAL:
      default:
        // fullExperience()
        newConfig = { ...DEFAULT_LITE_CONFIG };
        break;
    }

    this.setConfig(newConfig);
    if (mode !== LiteMode.NORMAL) await this.clearCache();
    
    console.log(`[Carlin Engine] mode_rules_applied: ${mode}`);
    window.dispatchEvent(new CustomEvent('carlin-lite-rules-applied'));
  }

  public getLiteImageConfig() {
    return {
      // mapping: Antigo = Sample 4 (High compression), Avancado = Sample 2
      sampleSize: this.mode === LiteMode.LITE_ANTIGO ? 4 : (this.mode === LiteMode.LITE_AVANCADO ? 2 : 1),
      preferredConfig: this.isLiteEnabled ? 'RGB_565' : 'ARGB_8888',
      renderingHint: this.isLiteEnabled ? 'optimizeSpeed' : 'auto'
    };
  }

  public async clearCache() {
    this.cache.clear();
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      } catch (e) { console.error("Cache flush failed", e); }
    }
    return true;
  }

  public getConfig(): LiteConfig { return { ...this.config }; }
  public setConfig(newConfig: LiteConfig) {
    this.config = { ...newConfig };
    localStorage.setItem('carlin_lite_config', JSON.stringify(this.config));
    window.dispatchEvent(new CustomEvent('carlin-lite-config-changed'));
  }

  public getFrameDelay(): number { return this.cpu.getFrameDelay(this.mode); }
  public isUnmetered(): boolean { return this.network.isUnmetered(); }

  public isAggressiveOptimizationRequired(): boolean {
    return this.mode === LiteMode.LITE_AVANCADO || (this.isLiteEnabled && !this.isUnmetered());
  }
  
  public getOptimizedImageUrl(url: string): string {
    const isAggressive = this.isAggressiveOptimizationRequired();
    if (!isAggressive && !this.isLiteEnabled && !this.config.reduceImageQuality) return url;
    
    const opts = this.getLiteImageConfig();
    let resolution = opts.sampleSize >= 2 ? (opts.sampleSize === 4 ? 200 : 400) : 1080;
    let quality = opts.preferredConfig === 'RGB_565' ? (isAggressive ? 30 : 50) : 85;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${resolution}&h=${resolution}&q=${quality}`;
  }

  public getMemoryStatus() {
    const cacheStatus = this.cache.getStatus();
    const max = this.memory.getAllocatedMB(this.config.maxRamUsageGB);
    return { ...cacheStatus, max };
  }
}

export const liteModeManager = new LiteManager();
export const networkLimiter = liteModeManager.network;
export const memoryCacheManager = {
  get: (key: string) => liteModeManager.cache.get(key),
  set: (key: string, data: any, sizeMB: number = 0.5) => 
    liteModeManager.cache.set(key, data, sizeMB, liteModeManager.getMemoryStatus().max),
  recalculateLimit: () => {},
  getStatus: () => liteModeManager.getMemoryStatus(),
  clear: () => liteModeManager.cache.clear()
};
