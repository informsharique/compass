import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Polygon, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	useAnimatedProps,
	SharedValue,
} from 'react-native-reanimated';
import { useThemeColor, PressableFeedback } from 'heroui-native';
import { useSettings } from '../../domain/settings/settings-store';
import { triggerHaptics } from './haptic-helper';
import { applyAlpha } from './color-helper';

const AnimatedG = Animated.createAnimatedComponent(G);

interface UprightTextProps {
  x: number;
  y: number;
  rotation: SharedValue<number>;
  children: React.ReactNode;
  [key: string]: any;
}

const UprightText: React.FC<UprightTextProps> = ({ x, y, rotation, children, ...props }) => {
  const animatedProps = useAnimatedProps(() => {
    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${-rotation.value}deg` as any },
      ] as any,
    };
  });

  return (
    <AnimatedG animatedProps={animatedProps}>
      <SvgText
        x={0}
        y={0}
        textAnchor="middle"
        alignmentBaseline="middle"
        {...props}
      >
        {children}
      </SvgText>
    </AnimatedG>
  );
};

interface CompassDialProps {
  heading: number;
}

export const CompassDial: React.FC<CompassDialProps> = ({ heading }) => {
  const { compassDesign } = useSettings();
  const rotation = useSharedValue(0);
  
  const accentColor = useThemeColor('accent');
  const foregroundColor = useThemeColor('foreground');
  const borderLinkColor = useThemeColor('border');
  const surfaceColor = useThemeColor('surface');
  const backgroundColor = useThemeColor('background');

  const size = 400;
  const center = size / 2;
  const radius = size * 0.45;

  // Shortest path interpolation to prevent 360 -> 0 degree spin-back glitch
  useEffect(() => {
    const prev = rotation.value;
    const target = -heading;
    const diff = ((target - prev) % 360);
    const shortestDiff = ((diff + 540) % 360) - 180;
    
    rotation.value = withSpring(prev + shortestDiff, {
      damping: 15,
      stiffness: 120,
      mass: 0.8,
    });
  }, [heading, rotation]);

  const animatedDialStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });


  const handlePress = () => {
    triggerHaptics();
  };

  const renderClassicDial = () => {
    const ticks = [];
    for (let i = 0; i < 360; i += 5) {
      const isMajor = i % 30 === 0;
      const isCardinal = i % 90 === 0;
      const length = isCardinal ? 15 : isMajor ? 10 : 5;
      const strokeWidth = isCardinal ? 2.5 : isMajor ? 1.5 : 1;
      const color = isCardinal
        ? i === 0
          ? '#ef4444'
          : accentColor
        : isMajor
        ? foregroundColor
        : `${foregroundColor}60`;

      ticks.push(
        <Line
          key={`tick-classic-${i}`}
          x1={center}
          y1={center - radius}
          x2={center}
          y2={center - radius + length}
          stroke={color}
          strokeWidth={strokeWidth}
          transform={`rotate(${i}, ${center}, ${center})`}
        />
      );
    }

    return (
      <G>
        {/* Outer Glow Ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius + 4}
          stroke={accentColor}
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
        />

        {/* Dial Background */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#dialGrad)"
          stroke={`${borderLinkColor}40`}
          strokeWidth="1.5"
        />

        {ticks}

        {/* Cardinal Labels - placed at radius 148 */}
        <UprightText x={center} y={200 - 148} rotation={rotation} fill="#ef4444" fontSize="18" fontWeight="bold">N</UprightText>
        <UprightText x={200 + 148} y={center} rotation={rotation} fill={foregroundColor} fontSize="16" fontWeight="bold">E</UprightText>
        <UprightText x={center} y={200 + 148} rotation={rotation} fill={foregroundColor} fontSize="16" fontWeight="bold">S</UprightText>
        <UprightText x={200 - 148} y={center} rotation={rotation} fill={foregroundColor} fontSize="16" fontWeight="bold">W</UprightText>

        {/* Ordinals - placed at radius 132 */}
        <UprightText x={200 + 93.3} y={200 - 93.3} rotation={rotation} fill={`${foregroundColor}90`} fontSize="11">NE</UprightText>
        <UprightText x={200 + 93.3} y={200 + 93.3} rotation={rotation} fill={`${foregroundColor}90`} fontSize="11">SE</UprightText>
        <UprightText x={200 - 93.3} y={200 + 93.3} rotation={rotation} fill={`${foregroundColor}90`} fontSize="11">SW</UprightText>
        <UprightText x={200 - 93.3} y={200 - 93.3} rotation={rotation} fill={`${foregroundColor}90`} fontSize="11">NW</UprightText>

        {/* Classic Compass Rose */}
        <G transform={`translate(${center - 25}, ${center - 25})`}>
          <Polygon points="25,5 29,21 25,25" fill="#ef4444" />
          <Polygon points="25,5 21,21 25,25" fill="#b91c1c" />
          <Polygon points="25,45 21,29 25,25" fill={foregroundColor} opacity="0.8" />
          <Polygon points="25,45 29,29 25,25" fill={foregroundColor} opacity="0.6" />
          <Polygon points="45,25 29,21 25,25" fill={foregroundColor} opacity="0.8" />
          <Polygon points="45,25 29,29 25,25" fill={foregroundColor} opacity="0.6" />
          <Polygon points="5,25 21,29 25,25" fill={foregroundColor} opacity="0.8" />
          <Polygon points="5,25 21,21 25,25" fill={foregroundColor} opacity="0.6" />
          <Circle cx="25" cy="25" r="4" fill="#09090b" />
        </G>
      </G>
    );
  };

  const renderModernDial = () => {
    // HUD segments and lines
    const ticks = [];
    for (let i = 0; i < 360; i += 10) {
      const isCardinal = i % 90 === 0;
      const length = isCardinal ? 12 : 6;
      ticks.push(
        <Line
          key={`tick-modern-${i}`}
          x1={center}
          y1={center - radius}
          x2={center}
          y2={center - radius + length}
          stroke={isCardinal ? accentColor : `${accentColor}80`}
          strokeWidth={isCardinal ? 2 : 1}
          transform={`rotate(${i}, ${center}, ${center})`}
        />
      );
    }

    return (
      <G>
        {/* Radar concentric rings */}
        <Circle cx={center} cy={center} r={radius} fill="none" stroke={`${accentColor}30`} strokeWidth="1.5" />
        <Circle cx={center} cy={center} r={radius - 20} fill="none" stroke={`${accentColor}15`} strokeWidth="1" />
        <Circle cx={center} cy={center} r={radius * 0.4} fill="none" stroke={`${accentColor}10`} strokeWidth="1" strokeDasharray="4 4" />

        {/* Crosshair grids */}
        <Line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke={`${accentColor}15`} strokeWidth="1" />
        <Line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke={`${accentColor}15`} strokeWidth="1" />

        {ticks}

        {/* Modern Sci-Fi Text labels - Letters at radius 146 */}
        <UprightText x={center} y={200 - 146} rotation={rotation} fill={accentColor} fontSize="16" fontWeight="bold" fontFamily="monospace">N</UprightText>
        <UprightText x={200 + 146} y={center} rotation={rotation} fill={foregroundColor} fontSize="14" fontWeight="bold" fontFamily="monospace">E</UprightText>
        <UprightText x={center} y={200 + 146} rotation={rotation} fill={foregroundColor} fontSize="14" fontWeight="bold" fontFamily="monospace">S</UprightText>
        <UprightText x={200 - 146} y={center} rotation={rotation} fill={foregroundColor} fontSize="14" fontWeight="bold" fontFamily="monospace">W</UprightText>

        {/* Modern Sci-Fi Text labels - Degrees at radius 124 */}
        <UprightText x={center} y={200 - 124} rotation={rotation} fill={`${accentColor}90`} fontSize="11" fontWeight="bold" fontFamily="monospace">0°</UprightText>
        <UprightText x={200 + 124} y={center} rotation={rotation} fill={`${foregroundColor}90`} fontSize="11" fontWeight="bold" fontFamily="monospace">90°</UprightText>
        <UprightText x={center} y={200 + 124} rotation={rotation} fill={`${foregroundColor}90`} fontSize="11" fontWeight="bold" fontFamily="monospace">180°</UprightText>
        <UprightText x={200 - 124} y={center} rotation={rotation} fill={`${foregroundColor}90`} fontSize="11" fontWeight="bold" fontFamily="monospace">270°</UprightText>

        {/* Digital display box */}
        <Circle cx={center} cy={center} r="28" fill="#00000030" stroke={`${accentColor}40`} strokeWidth="1.5" />
        
        {/* Core Laser HUD center dot */}
        <Circle cx={center} cy={center} r="3" fill={accentColor} />
      </G>
    );
  };

  const renderMinimalistDial = () => {
    // Bauhaus clean design
    const ticks = [];
    for (let i = 0; i < 360; i += 30) {
      const isCardinal = i % 90 === 0;
      ticks.push(
        <Line
          key={`tick-minimal-${i}`}
          x1={center}
          y1={center - radius + 5}
          x2={center}
          y2={center - radius + 12}
          stroke={isCardinal ? foregroundColor : `${foregroundColor}40`}
          strokeWidth="1.5"
          transform={`rotate(${i}, ${center}, ${center})`}
        />
      );
    }

    return (
      <G>
        {/* Borderless Dial */}
        <Circle cx={center} cy={center} r={radius} fill="none" stroke={`${foregroundColor}15`} strokeWidth="1" />

        {ticks}

        {/* Clean, thin Typography - placed at radius 145 */}
        <UprightText x={center} y={200 - 145} rotation={rotation} fill="#ef4444" fontSize="16" fontWeight="300">N</UprightText>
        <UprightText x={200 + 145} y={center} rotation={rotation} fill={foregroundColor} fontSize="14" fontWeight="300">E</UprightText>
        <UprightText x={center} y={200 + 145} rotation={rotation} fill={foregroundColor} fontSize="14" fontWeight="300">S</UprightText>
        <UprightText x={200 - 145} y={center} rotation={rotation} fill={foregroundColor} fontSize="14" fontWeight="300">W</UprightText>

        {/* Minimalist Pointer Needles */}
        <G>
          {/* North needle pointing up */}
          <Polygon points={`${center - 4},${center} ${center + 4},${center} ${center},${center - radius + 25}`} fill="#ef4444" />
          {/* South needle pointing down */}
          <Polygon points={`${center - 4},${center} ${center + 4},${center} ${center},${center + radius - 25}`} fill={foregroundColor} opacity="0.6" />
          
          <Circle cx={center} cy={center} r="6" fill="#09090b" stroke={foregroundColor} strokeWidth="1.5" />
        </G>
      </G>
    );
  };

  return (
    <PressableFeedback
      onPress={handlePress}
      animation={{
        scale: {
          value: 1,
        },
      }}
      className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] items-center justify-center relative"
    >
      <PressableFeedback.Ripple
        animation={{
          backgroundColor: { value: applyAlpha(foregroundColor, '20%') }
        }}
      />
      {/* Rotating Dial Layer */}
      <Animated.View
        className="w-full h-full items-center justify-center"
        style={animatedDialStyle}
      >
        <Svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <RadialGradient id="dialGrad" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="70%" stopColor={surfaceColor} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={backgroundColor} stopOpacity="0.5" />
            </RadialGradient>
          </Defs>
  
          {/* Render selected compass face design */}
          {compassDesign === 'classic' && renderClassicDial()}
          {compassDesign === 'modern' && renderModernDial()}
          {compassDesign === 'minimalist' && renderMinimalistDial()}
        </Svg>
      </Animated.View>
  
      {/* Stationary Top Marker Overlay */}
      <View
        className="absolute inset-0 items-center pointer-events-none"
      >
        <Svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
          <Polygon
            points={`${center - 8},14 ${center + 8},14 ${center},26`}
            fill="#ef4444"
          />
          <Line
            x1={center}
            y1="0"
            x2={center}
            y2="14"
            stroke="#ef4444"
            strokeWidth="2.5"
          />
        </Svg>
      </View>
    </PressableFeedback>
  );
};
