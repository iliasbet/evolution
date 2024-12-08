import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PIXI from 'pixi.js';
import { RootState } from '../store/store';
import { updateViewConfig } from '../store/evolutionSlice';
import { Grid } from '../types/evolution';

interface Props {
  width: number;
  height: number;
}

type PointerEvent = PIXI.FederatedMouseEvent;

const SimulationCanvas: React.FC<Props> = ({ width, height }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application<HTMLCanvasElement>>();
  const dispatch = useDispatch();
  
  const currentOrganism = useSelector((state: RootState) => state.evolution.currentOrganism);
  const viewConfig = useSelector((state: RootState) => state.evolution.viewConfig);
  const highlightActiveRules = useSelector((state: RootState) => 
    state.evolution.viewConfig.highlightActiveRules
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize PIXI Application
    const app = new PIXI.Application<HTMLCanvasElement>({
      width,
      height,
      backgroundColor: 0x1a1a1a,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
    });

    canvasRef.current.appendChild(app.view);
    appRef.current = app;

    // Add interaction
    const viewport = new PIXI.Container();
    app.stage.addChild(viewport);
    
    viewport.eventMode = 'static';
    viewport.on('pointerdown', onDragStart);
    viewport.on('pointerup', onDragEnd);
    viewport.on('pointerupoutside', onDragEnd);
    viewport.on('pointermove', onDragMove);

    return () => {
      app.destroy(true);
    };
  }, [width, height]);

  useEffect(() => {
    if (!appRef.current || !currentOrganism) return;

    const app = appRef.current;
    const grid = currentOrganism.grid;
    
    // Clear previous rendering
    const container = app.stage.getChildAt(0);
    if (container instanceof PIXI.Container) {
      while (container.children.length > 0) {
        container.removeChildAt(0);
      }
      renderGrid(grid, container);
    }
  }, [currentOrganism, viewConfig]);

  const renderGrid = (grid: Grid, container: PIXI.Container) => {
    const cellSize = Math.min(width / grid[0].length, height / grid.length) * viewConfig.zoom;
    const offsetX = (width - grid[0].length * cellSize) / 2 + viewConfig.pan.x;
    const offsetY = (height - grid.length * cellSize) / 2 + viewConfig.pan.y;

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === 1) {
          const cell = new PIXI.Graphics();
          const color = highlightActiveRules ? getActiveRuleColor(x, y) : 0xffffff;
          
          cell.beginFill(color);
          cell.drawRect(
            offsetX + x * cellSize,
            offsetY + y * cellSize,
            cellSize,
            cellSize
          );
          cell.endFill();
          
          container.addChild(cell);
        }
      }
    }
  };

  const getActiveRuleColor = (x: number, y: number): number => {
    // Color based on position in the grid
    const hue = (x + y) % 360;
    return parseInt(`0x${HSLToHex(hue, 70, 60).substring(1)}`);
  };

  // Helper function to convert HSL to Hex
  const HSLToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return '#' + [0, 8, 4].map(n => {
      const hex = Math.round(255 * f(n)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Drag handling
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let startPanX = 0;
  let startPanY = 0;

  const onDragStart = (event: PointerEvent) => {
    isDragging = true;
    dragStartX = event.global.x;
    dragStartY = event.global.y;
    startPanX = viewConfig.pan.x;
    startPanY = viewConfig.pan.y;
  };

  const onDragEnd = () => {
    isDragging = false;
  };

  const onDragMove = (event: PointerEvent) => {
    if (!isDragging) return;

    const dx = event.global.x - dragStartX;
    const dy = event.global.y - dragStartY;

    dispatch(updateViewConfig({
      pan: {
        x: startPanX + dx,
        y: startPanY + dy
      }
    }));
  };

  // Wheel zoom handling
  const onWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, viewConfig.zoom * zoomFactor));
    
    dispatch(updateViewConfig({ zoom: newZoom }));
  };

  return (
    <div 
      ref={canvasRef} 
      onWheel={onWheel}
      style={{ width, height, overflow: 'hidden' }}
    />
  );
};

export default SimulationCanvas; 