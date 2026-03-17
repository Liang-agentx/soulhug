import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';
import type { RoleState } from '../../types';

// Expose PIXI to window for pixi-live2d-display
(window as any).PIXI = PIXI;

interface Live2DViewerProps {
  role: RoleState;
  className?: string;
  emotion?: string;
}

// Model configurations
const MODELS: Record<string, string> = {
  soulhug: '/live2d/shizuku/shizuku.model.json',
  'roleplay-mom': '/live2d/hiyori/Hiyori.model3.json',
  'roleplay-dad': '/live2d/hiyori/Hiyori.model3.json', // 暂时使用 Hiyori，后续可换成男性模型
};

export function Live2DViewer({ role, className }: Live2DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const modelRef = useRef<Live2DModel | null>(null);
  const loadedModelUrl = useRef<string>('');
  const isInitialized = useRef(false);

  // Initialize PIXI and load model
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const modelUrl = MODELS[role] || '';

    // Skip if same model already loaded
    if (loadedModelUrl.current === modelUrl && isInitialized.current) {
      return;
    }

    // Prevent React StrictMode double-initialization
    if (isInitialized.current && appRef.current) {
      // Just need to load different model
      if (modelRef.current) {
        appRef.current.stage.removeChild(modelRef.current);
        modelRef.current.destroy();
        modelRef.current = null;
      }
    } else {
      // Full cleanup
      if (modelRef.current) {
        modelRef.current.destroy();
        modelRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
      container.innerHTML = '';
    }

    loadedModelUrl.current = '';

    if (!modelUrl) return;

    // Get container size
    const rect = container.getBoundingClientRect();
    const width = rect.width || 350;
    const height = rect.height || 450;

    // Create PIXI Application if needed
    if (!appRef.current) {
      const app = new PIXI.Application({
        width,
        height,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      container.appendChild(app.view as HTMLCanvasElement);
      appRef.current = app;
      isInitialized.current = true;
    }

    const app = appRef.current;

    // Load model
    Live2DModel.from(modelUrl).then((model) => {
      // Check app still exists
      if (!appRef.current || appRef.current !== app) {
        model.destroy();
        return;
      }

      app.stage.addChild(model);
      modelRef.current = model;
      loadedModelUrl.current = modelUrl;

      // Scale and position - show upper body
      const scale = Math.min(width / model.width, height / model.height) * 1.4;
      model.scale.set(scale);
      model.anchor.set(0.5, 0.5);
      model.x = width / 2;
      model.y = height * 0.55;

      console.log(`[Live2D] Loaded: ${modelUrl}`);
    }).catch((err) => {
      console.error('[Live2D] Load failed:', err);
    });

    return () => {
      // Only cleanup on unmount, not on re-render
    };
  }, [role]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (modelRef.current) {
        modelRef.current.destroy();
        modelRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
      loadedModelUrl.current = '';
      isInitialized.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: 'hidden' }}
    />
  );
}
