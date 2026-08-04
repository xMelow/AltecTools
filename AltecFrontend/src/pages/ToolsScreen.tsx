import SubFeatureCard from "../components/SubFeatureCard";
import { features } from "../constants/homeFeatures";

export default function ToolsScreen() {
    const featureContent = features.find(f => f.title === "Tools");

    if (!featureContent) {
        return <div>
             <h2 className="text-center text-3xl font-bold text-altec-teal">Tools</h2>
             <p>Tools not found!</p>
        </div>
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-center text-3xl font-bold text-altec-teal">Tools</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-altec-dark">
                        {featureContent.title}
                    </h3>
                    {featureContent.route && (
                        <span className="text-sm font-semibold text-altec-teal">
                            Open →
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-sm">{featureContent.description}</p>
                {featureContent.bullets && (
                    <ul className="flex flex-col gap-1">
                        {featureContent.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-altec-teal shrink-0" />
                                {bullet}
                            </li>
                        ))}
                    </ul>
                )}
                {featureContent.subFeatures && (
                    <div className="flex flex-col gap-4 mt-1">
                        {featureContent.subFeatures.map((sub) => (
                            <SubFeatureCard bullets={sub.bullets} description={sub.description} title={sub.title} key={sub.title} route={sub.route} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
