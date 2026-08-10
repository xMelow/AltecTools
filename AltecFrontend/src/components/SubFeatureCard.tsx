import { Link } from "react-router-dom";

type SubFeatureCardProps = {
    title: string;
    description: string;
    bullets: string[];
    route?: string;
};

export default function SubFeatureCard({title, description, bullets, route }: SubFeatureCardProps) {
    const content = (
        <>
        <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-altec-dark tracking-wide">
                    {title}
                </h4>
                {route && (
                    <span className="text-sm font-semibold text-altec-teal">
                        Open →
                    </span>
                )}
            </div>
            <p className="text-gray-600 text-sm">{description}</p>
            <ul className="flex flex-col gap-1">
                {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-altec-teal shrink-0" />
                        {bullet}
                    </li>
                ))}
            </ul>
        </>
    )
    
    return route ? (
        <Link
            to={route}
            className="flex flex-col gap-2 border border-gray-200 rounded-lg p-4 hover:border-altec-teal hover:shadow-sm transition-colors"
        >
            {content}
        </Link>
    ) : (
        <div
            className="flex flex-col gap-2 border border-gray-200 rounded-lg p-4"
        >
            {content}
        </div>
    );
}
