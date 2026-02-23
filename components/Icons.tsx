import Svg, { Path, Line, Circle, Rect,Polygon,Polyline } from "react-native-svg";


export function GithubPrMergeRateIcon({
  size = 24,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="m8 6 4-4 4 4" />
      <Path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
      <Path d="m20 22-5-5" />
    </Svg>
  );
}



export function GithubClosedIssuesIcon({
  size = 24,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M6 3v12" />
      <Path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <Path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <Path d="M15 6a9 9 0 0 0-9 9" />
      <Path d="M18 15v6" />
      <Path d="M21 18h-6" />
    </Svg>
  );
}

export function GithubOpenIssuesIcon({
  size = 24,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Line x1={6} y1={3} x2={6} y2={15} />
      <Circle cx={18} cy={6} r={3} />
      <Circle cx={6} cy={18} r={3} />
      <Path d="M18 9a9 9 0 0 1-9 9" />
    </Svg>
  );
}


export function GithubLastCommitIcon({
  size = 24,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M8 2v4" />
      <Path d="M16 2v4" />
      <Rect x={3} y={4} width={18} height={18} rx={2} />
      <Path d="M3 10h18" />
    </Svg>
  );
}



export function TeamsIcon({
  size = 24,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <Circle cx={9} cy={7} r={4} />
    </Svg>
  );
}


export function WarningIcon({
  size = 24,
  backgroundColor = "#F59E0B",
  color = "#111827",
}: {
  size?: number;
  backgroundColor: string
  color?: string;
}) {
  const center = size / 2

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={12}
        fill={backgroundColor}
      />

      <Rect
        x={11}
        y={5}
        width={2}
        height={10}
        rx={1}
        fill={color}
      />

      <Circle
        cx={12}
        cy={18}
        r={1.5}
        fill={color}
      />
    </Svg>
  )
}

type Props = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};



type Props2 = {
  width?: number;
  height?: number;
  color?: string;
};


export  function TrendDownIcon({
                                 width = 160,
                                 height = 45,
                                 color = "rgba(239,68,68,0.67)",
                               }: Props2) {
  return (
      <Svg width={width} height={height} viewBox="0 0 140 40">
        <Path
            d="
          M 0 2
          Q 35 32, 70 26
          T 140 40
          "
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.6}
        />
      </Svg>
  );
}


export  function TrendUpIcon({
                                              width = 160,
                                              height = 45,
                               color = "rgba(34,197,94,0.67)",
                                            }: Props2) {
  return (
      <Svg width={width} height={height} viewBox="0 0 140 40">
        <Path
            d="
          M 0 38
          Q 35 8, 70 14
          T 140 0
          "
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.6}
        />
      </Svg>
  );
}

export function TrendFlatIcon({
                                width = 160,
                                height = 45,
                                color = "#9ca3af",
                              }: Props2) {
  return (
      <Svg width={width} height={height} viewBox="0 0 140 40">
        <Path
            d="
            M 0 20
            Q 70 20, 140 20
            "
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.6}
        />
      </Svg>
  );
}