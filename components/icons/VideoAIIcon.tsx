import { VideoCameraIcon, SparklesIcon } from '@heroicons/react/24/outline'

export function VideoAIIcon(props: React.ComponentProps<'svg'>) {
    return (
        <div className={`relative ${props.className || ''}`} style={{ width: props.width || 24, height: props.height || 24 }}>
            {/* Main Video Icon */}
            <VideoCameraIcon strokeWidth={props.strokeWidth} style={{ ...props.style, width: '100%', height: '100%' }} className="text-current" />

            {/* AI Star/Sparkle positioned at the top right */}
            <div className="absolute -top-1 -right-1">
                <SparklesIcon style={{ width: 14, height: 14 }} className="text-current" strokeWidth={2} />
            </div>
        </div>
    )
}
