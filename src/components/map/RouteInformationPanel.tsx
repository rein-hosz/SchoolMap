import React from 'react';
import { RouteInfo } from './RoutingControl';
import { 
  FaLocationDot, 
  FaArrowRight, 
  FaArrowLeft, 
  FaArrowUp,
  FaSchool,
  FaClock,
  FaRulerHorizontal
} from 'react-icons/fa6';

interface RouteInformationPanelProps {
  routeInfo: RouteInfo;
  originName: string;
  destinationName: string;
}

export default function RouteInformationPanel({ 
  routeInfo, 
  originName, 
  destinationName 
}: RouteInformationPanelProps) {
  // Get icon for instruction type
  const getInstructionIcon = (type: string) => {
    switch (type) {
      case "Right":
        return <FaArrowRight className="text-indigo-500" />;
      case "Left":
        return <FaArrowLeft className="text-indigo-500" />;
      case "Straight":
        return <FaArrowUp className="text-indigo-500" />;
      case "SharpRight":
        return <FaArrowRight className="text-indigo-600 rotate-45" />;
      case "SharpLeft":
        return <FaArrowLeft className="text-indigo-600 -rotate-45" />;
      case "SlightRight":
        return <FaArrowRight className="text-indigo-400 rotate-12" />;
      case "SlightLeft":
        return <FaArrowLeft className="text-indigo-400 -rotate-12" />;
      case "WaypointReached":
        return <FaLocationDot className="text-green-500" />;
      case "Roundabout":
        return <FaArrowRight className="text-indigo-500 rotate-45" />;
      case "DestinationReached":
        return <FaSchool className="text-green-600" />;
      default:
        return <FaArrowUp className="text-indigo-500" />;
    }
  };

  // Format distance for display
  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-200">
      {/* Route summary header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white">
        <h3 className="font-bold text-lg mb-1">Route Information</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaRulerHorizontal className="text-blue-200" />
            <span>{formatDistance(routeInfo.distance)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-200" />
            <span>{Math.round(routeInfo.duration / 60)} min</span>
          </div>
        </div>
      </div>

      {/* Origin and destination */}
      <div className="p-3 bg-indigo-50 border-b border-indigo-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FaLocationDot className="text-blue-600" />
          </div>
          <div className="text-sm font-medium text-neutral-700 line-clamp-1">{originName}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <FaSchool className="text-green-600" />
          </div>
          <div className="text-sm font-medium text-neutral-700 line-clamp-1">{destinationName}</div>
        </div>
      </div>

      {/* Instructions list */}
      <div className="max-h-[400px] overflow-y-auto">
        <div className="p-2">
          {routeInfo.instructions.map((instruction, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-3 p-2 rounded-lg ${
                instruction.type === "DestinationReached" 
                  ? "bg-green-50 text-green-800" 
                  : index % 2 === 0 
                    ? "bg-neutral-50" 
                    : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-neutral-200">
                {getInstructionIcon(instruction.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800">{instruction.text}</p>
                {instruction.distance > 0 && (
                  <p className="text-xs text-neutral-500">{formatDistance(instruction.distance)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}