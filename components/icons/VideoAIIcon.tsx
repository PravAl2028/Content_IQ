import React from "react"
import { VideoCameraIcon } from "@heroicons/react/24/outline"

export function VideoAIIcon(props: React.ComponentProps<"svg">) {
    const { className, width = 24, height = 24, strokeWidth, style, ...rest } = props

    return (
        <div
            className={`relative flex items-center justify-center ${className || ""}`}
            style={{ width, height }}
        >
            <VideoCameraIcon
                strokeWidth={strokeWidth}
                style={{ width: "100%", height: "100%", ...style }}
                className="text-current"
                {...rest}
            />

            <svg
                viewBox="0 0 256 256"
                className="absolute -top-1.2 right-2 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M60 170c40 28 100 28 140-2"
                    stroke="#FF9900"
                    strokeWidth="18"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    )
}