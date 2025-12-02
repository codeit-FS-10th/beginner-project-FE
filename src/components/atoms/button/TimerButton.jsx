import React from "react";
import { PlayIcon, PauseIcon, RestartIcon, StopIcon } from "@assets/Icons";
import "@styles/atoms/timerbutton.css";

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

    const sizeClass = getSizeClass(variant, size);

    const displayIcon = {
        start: <PlayIcon />,
        stop: <StopIcon />,
        pause: <PauseIcon />,
        restart: <RestartIcon />,
    }[variant];

    const displayLabel = (variant) => {
        if (variant === "start") return "Start!";
        if (variant === "stop") return "Stop!";
        return "";
    };

    const hasLabel = variant === "start" || variant === "stop";

    return (
        <button
            className={`timer-btn ${variantClass} ${statusClass} ${sizeClass}`}
            disabled={status === "inactive"}
            {...props}
        >
            <span className={`timer-icon--${size}`}>{displayIcon}</span>
            {hasLabel && (
                <span className={`timer-label--${size}`}>
                    {displayLabel(variant)}
                </span>
            )}
        </button>
    );
};

export default TimerButton;
