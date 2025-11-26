import React from "react";
import { PlayIcon, PauseIcon, RestartIcon, StopIcon } from "../Icons";
import "./timerButton.css";

const TimerButton = ({
  variant = "start",
  status = "active",
  size = "sm",
  ...props
}) => {
  const getSizeClass = (variant, size) => {
    if ((variant === "start" || variant === "stop") && size === "sm") {
      return "timer-pill--sm";
    }
    if ((variant === "start" || variant === "stop") && size === "lg") {
      return "timer-pill--lg";
    }
    if ((variant === "pause" || variant === "restart") && size === "sm") {
      return "timer-circle--sm";
    }
    if ((variant === "pause" || variant === "restart") && size === "lg") {
      return "timer-circle--lg";
    }
    return "";
  };

  const variantClass = {
    start: "timer--start",
    stop: "timer--stop",
    pause: "timer--pause",
    restart: "timer--restart",
  }[variant];

  const statusClass = {
    active: "timer--active",
    inactive: "timer--inactive",
  }[status];

  //  만약 variant가 start,stop 이고, size가 lg경우와
  // variant가 start,stop 이고, size가 sm경우,
  //variant가 pause,restart 이고, size가 lg경우,
  //variant가 pause,restart 이고, size가 sm경우로 사이즈를 다르게 지정하고 싶으면 어떻게하지?
  const sizeClass = getSizeClass(variant, size);

  const displayIcon = {
    start: <PlayIcon />,
    stop: <StopIcon />,
    pause: <PauseIcon />,
    restart: <RestartIcon />,
  }[variant];

  const displayLable = function (variant) {
    if (variant === "start") {
      return "Start!";
    }
    if (variant === "stop") {
      return "Stop!";
    } else {
      return "";
    }
  };

  const hasLabel = variant === "start" || variant === "stop";

  return (
    <button
      className={`timer-btn ${variantClass} ${statusClass}  ${sizeClass}`}
    >
      <span className={`timer-icon--${size}`}>{displayIcon}</span>
      {hasLabel && (
        <span className={`timer-label--${size}`}>{displayLable(variant)}</span>
      )}
    </button>
  );
};

export default TimerButton;
