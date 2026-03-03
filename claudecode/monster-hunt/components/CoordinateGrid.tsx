import { useEffect, useRef } from 'react';
import { ThemeType, getThemeColors } from './GameContext';

interface CoordinateGridProps {
  quadrants: 1 | 2 | 4;
  width: number;
  height: number;
  gridSize: number;
  targetX?: number;
  targetY?: number;
  theme?: ThemeType;
  level?: number;
}

const CoordinateGrid: React.FC<CoordinateGridProps> = ({ 
  quadrants, 
  width, 
  height, 
  gridSize, 
  targetX, 
  targetY,
  theme = 'forest',
  level = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate grid dimensions based on quadrants
  const originX = quadrants === 1 ? 0 : width / 2;
  const originY = quadrants === 1 ? height : height / 2;
  
  // Draw the coordinate grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background with subtle pattern based on theme
    drawBackground(ctx, theme);
    
    // Set line styles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Draw grid lines
    drawGridLines(ctx);
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    drawAxes(ctx);
    
    // Draw quadrant labels
    drawQuadrantLabels(ctx);
    
    // Draw targeting lines if coordinates are provided
    if (targetX !== undefined && targetY !== undefined) {
      drawTargetingLines(ctx, targetX, targetY);
    }
    
    // Draw numbers
    drawAxisLabels(ctx);
  }, [width, height, quadrants, gridSize, targetX, targetY, theme, level]);
  
  // Draw themed background
  const drawBackground = (ctx: CanvasRenderingContext2D, theme: ThemeType) => {
    // Fill background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw theme-specific patterns
    const patternSize = 20;
    const patternOpacity = 0.05;
    
    switch (theme) {
      case 'forest':
        // Draw leaf-like patterns
        ctx.fillStyle = `rgba(0, 100, 0, ${patternOpacity})`;
        for (let i = 0; i < width / patternSize; i++) {
          for (let j = 0; j < height / patternSize; j++) {
            if (Math.random() > 0.8) {
              ctx.beginPath();
              ctx.arc(i * patternSize, j * patternSize, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        break;
      case 'space':
        // Draw stars
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 1.5;
          const opacity = Math.random() * 0.5 + 0.3;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'underwater':
        // Draw bubble-like patterns
        ctx.fillStyle = `rgba(100, 200, 255, ${patternOpacity})`;
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 15 + 5;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'desert':
        // Draw sand-like patterns
        ctx.fillStyle = `rgba(200, 150, 50, ${patternOpacity})`;
        for (let i = 0; i < width; i += patternSize) {
          for (let j = 0; j < height; j += patternSize) {
            if (Math.random() > 0.7) {
              ctx.fillRect(i, j, patternSize / 2, patternSize / 2);
            }
          }
        }
        break;
    }
  };
  
  // Draw the grid lines
  const drawGridLines = (ctx: CanvasRenderingContext2D) => {
    // Calculate grid bounds based on quadrants
    const startX = quadrants >= 2 ? -width / 2 : 0;
    const endX = width / 2;
    const startY = quadrants === 4 ? -height / 2 : 0;
    const endY = quadrants === 1 ? 0 : height / 2;
    
    // Calculate pixel size of a grid unit
    const unitSize = gridSize;
    
    // Draw vertical grid lines
    for (let x = Math.ceil(startX / unitSize) * unitSize; x <= endX; x += unitSize) {
      const pixelX = originX + x;
      ctx.beginPath();
      ctx.moveTo(pixelX, 0);
      ctx.lineTo(pixelX, height);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = Math.ceil(startY / unitSize) * unitSize; y <= endY; y += unitSize) {
      const pixelY = originY - y;
      ctx.beginPath();
      ctx.moveTo(0, pixelY);
      ctx.lineTo(width, pixelY);
      ctx.stroke();
    }
  };
  
  // Draw the X and Y axes
  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    
    // Draw Y-axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();
    
    // Draw axis arrows for X-axis
    ctx.beginPath();
    ctx.moveTo(width - 15, originY - 5);
    ctx.lineTo(width - 5, originY);
    ctx.lineTo(width - 15, originY + 5);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    
    // Draw axis arrows for Y-axis
    ctx.beginPath();
    ctx.moveTo(originX - 5, 15);
    ctx.lineTo(originX, 5);
    ctx.lineTo(originX + 5, 15);
    ctx.fill();
    
    // Label axes
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - 10, originY - 15);
    ctx.fillText('y', originX + 15, 15);
  };
  
  // Draw quadrant labels (I, II, III, IV)
  const drawQuadrantLabels = (ctx: CanvasRenderingContext2D) => {
    if (quadrants === 1) return;
    
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const quadrantPadding = 50;
    
    if (quadrants >= 2) {
      // First quadrant (top right)
      ctx.fillText('I', originX + quadrantPadding, originY - quadrantPadding);
      
      // Second quadrant (top left)
      ctx.fillText('II', originX - quadrantPadding, originY - quadrantPadding);
    }
    
    if (quadrants === 4) {
      // Third quadrant (bottom left)
      ctx.fillText('III', originX - quadrantPadding, originY + quadrantPadding);
      
      // Fourth quadrant (bottom right)
      ctx.fillText('IV', originX + quadrantPadding, originY + quadrantPadding);
    }
  };
  
  // Draw targeting lines for specific coordinates
  const drawTargetingLines = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const pixelX = originX + (x * gridSize);
    const pixelY = originY - (y * gridSize);
    
    // Draw X targeting line
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pixelX, 0);
    ctx.lineTo(pixelX, height);
    ctx.stroke();
    
    // Draw Y targeting line
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
    ctx.beginPath();
    ctx.moveTo(0, pixelY);
    ctx.lineTo(width, pixelY);
    ctx.stroke();
    
    // Reset line dash
    ctx.setLineDash([]);
    
    // Draw intersection point
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw coordinate text at intersection
    ctx.font = '14px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`(${x}, ${y})`, pixelX, pixelY - 20);
  };
  
  // Draw axis labels (numbers)
  const drawAxisLabels = (ctx: CanvasRenderingContext2D) => {
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const unitSize = gridSize;
    const numLabelSpacing = 2; // Label every nth grid line
    
    // X-axis labels
    const startX = quadrants >= 2 ? -Math.floor((width / 2) / unitSize) : 0;
    const endX = Math.floor((width / 2) / unitSize);
    
    for (let i = startX; i <= endX; i += numLabelSpacing) {
      if (i === 0) continue; // Skip zero
      const pixelX = originX + (i * unitSize);
      ctx.fillText(i.toString(), pixelX, originY + 15);
    }
    
    // Y-axis labels
    const startY = quadrants === 4 ? -Math.floor((height / 2) / unitSize) : 0;
    const endY = Math.floor((height / 2) / unitSize);
    
    for (let i = startY; i <= endY; i += numLabelSpacing) {
      if (i === 0) continue; // Skip zero
      const pixelY = originY - (i * unitSize);
      ctx.fillText(i.toString(), originX - 15, pixelY);
    }
    
    // Draw "0" at origin
    ctx.fillText("0", originX - 15, originY + 15);
  };
  
  // Function to convert grid coordinates to pixel coordinates
  const gridToPixel = (x: number, y: number) => {
    return {
      x: originX + (x * gridSize),
      y: originY - (y * gridSize)
    };
  };
  
  // Function to convert pixel coordinates to grid coordinates
  const pixelToGrid = (pixelX: number, pixelY: number) => {
    return {
      x: Math.round((pixelX - originX) / gridSize),
      y: Math.round((originY - pixelY) / gridSize)
    };
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      className="border border-gray-800 bg-black bg-opacity-80"
    />
  );
};

export default CoordinateGrid;