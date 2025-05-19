import React from 'react';

interface DupliconAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  seed: string;
  size?: number;
}

function DupliconAvatar({ seed, size = 40, ...props }: DupliconAvatarProps) {
  // Generate a unique pattern based on the seed
  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const hash = hashCode(seed);
  
  // Generate colors based on the hash
  const hue = hash % 360;
  const saturation = 70 + (hash % 20);
  const lightness = 55 + (hash % 10);
  
  const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  
  // SVG pattern generation
  const totalShapes = 3 + (hash % 3); // 3-5 shapes
  const shapes = [];
  
  for (let i = 0; i < totalShapes; i++) {
    const shapeType = (hash + i) % 3; // 0: circle, 1: square, 2: triangle
    const x = 10 + ((hash + i * 5) % 80);
    const y = 10 + ((hash + i * 7) % 80);
    const size = 10 + ((hash + i * 11) % 40);
    
    const opacity = 0.6 + ((hash + i * 13) % 4) / 10;
    const rotate = (hash + i * 17) % 360;
    
    if (shapeType === 0) {
      // Circle
      shapes.push(
        <circle 
          key={i}
          cx={x} 
          cy={y} 
          r={size / 2}
          fill={`hsla(${(hue + 40 * i) % 360}, ${saturation}%, ${lightness + 10}%, ${opacity})`}
        />
      );
    } else if (shapeType === 1) {
      // Square
      shapes.push(
        <rect 
          key={i}
          x={x - size/2} 
          y={y - size/2} 
          width={size} 
          height={size}
          transform={`rotate(${rotate} ${x} ${y})`}
          fill={`hsla(${(hue + 40 * i) % 360}, ${saturation}%, ${lightness + 10}%, ${opacity})`}
        />
      );
    } else {
      // Triangle
      const points = `${x},${y - size/2} ${x - size/2},${y + size/2} ${x + size/2},${y + size/2}`;
      shapes.push(
        <polygon 
          key={i}
          points={points}
          transform={`rotate(${rotate} ${x} ${y})`}
          fill={`hsla(${(hue + 40 * i) % 360}, ${saturation}%, ${lightness + 10}%, ${opacity})`}
        />
      );
    }
  }
  
  // Get first letter of the seed for the center
  const firstLetter = seed.charAt(0).toUpperCase();
  
  return (
    <div 
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        ...props.style
      }}
      {...props}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill={bgColor} />
        {shapes}
        <text
          x="50"
          y="50"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="40"
          fontWeight="bold"
          fill="rgba(255, 255, 255, 0.9)"
        >
          {firstLetter}
        </text>
      </svg>
    </div>
  );
}

export default DupliconAvatar;
