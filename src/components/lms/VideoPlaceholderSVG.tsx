const VideoPlaceholderSVG = ({
  width = 800,
  height = 450,
  title = "Course thumbnail",
}) => (
  <svg
    width="100%"
    height="100%"
    viewBox={`0 0 ${width} ${height}`}
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.8 }}
  >
    <defs>
      <linearGradient id="videoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="100%" height="100%" fill="url(#videoGradient)" />

    {/* Film strip pattern */}
    <rect x="0" y="0" width="100%" height="40" fill="rgba(0,0,0,0.2)" />
    <rect
      x="0"
      y={height - 40}
      width="100%"
      height="40"
      fill="rgba(0,0,0,0.2)"
    />

    {/* Film holes */}
    {Array.from({ length: 20 }, (_, i) => (
      <g key={i}>
        <rect
          x={i * 40 + 10}
          y="10"
          width="20"
          height="20"
          rx="10"
          fill="rgba(0,0,0,0.3)"
        />
        <rect
          x={i * 40 + 10}
          y={height - 30}
          width="20"
          height="20"
          rx="10"
          fill="rgba(0,0,0,0.3)"
        />
      </g>
    ))}

    {/* Play button icon */}
    <circle
      cx={width / 2}
      cy={height / 2}
      r="60"
      fill="rgba(255,255,255,0.9)"
    />
    <polygon
      points={`${width / 2 - 20},${height / 2 - 30} ${width / 2 - 20},${height / 2 + 30} ${width / 2 + 30},${height / 2}`}
      fill="#333"
    />

    {/* Text */}
    <text
      x={width / 2}
      y={height - 80}
      textAnchor="middle"
      fill="rgba(255,255,255,0.8)"
      fontSize="24"
      fontFamily="Arial, sans-serif"
    >
      {title}
    </text>
  </svg>
)
export default VideoPlaceholderSVG
