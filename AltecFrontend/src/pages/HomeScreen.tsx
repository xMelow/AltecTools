import { Link } from "react-router-dom";
import { features } from "../constants/homeFeatures";

export default function HomeScreen() {
    return (
        <div className="max-w-4xl mx-auto py-6">
            <h2 className="text-center text-3xl font-bold text-altec-teal mb-2">
                About this Application
            </h2>
            <p className="text-center text-gray-500 mb-10">
                Altec Tools is an internal platform for managing printers, designing labels, and automating printing workflows.
            </p>

            <div className="flex flex-col gap-6">
                {features.map((feature) => {
                    const cardContent = (
                        <>
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-altec-dark">
                                    {feature.title}
                                </h3>
                                {feature.route && (
                                    <span className="text-sm font-semibold text-altec-teal">
                                        Open →
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                            {feature.bullets && (
                                <ul className="flex flex-col gap-1">
                                    {feature.bullets.map((b) => (
                                        <li key={b} className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="w-1.5 h-1.5 rounded-full bg-altec-teal shrink-0" />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {feature.subFeatures && (
                                <div className="flex flex-col gap-4 mt-1">
                                {feature.subFeatures.map((sub) => {
                                    const content = (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-altec-dark tracking-wide">
                                                    {sub.title}
                                                </h4>
                                                {sub.route && (
                                                    <span className="text-sm font-semibold text-altec-teal">
                                                        Open →
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm">{sub.description}</p>
                                            <ul className="flex flex-col gap-1">
                                                {sub.bullets.map((bullet) => (
                                                    <li key={bullet} className="flex items-center gap-2 text-sm text-gray-500">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-altec-teal shrink-0" />
                                                        {bullet}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    );

                                    return sub.route ? (
                                        <Link
                                            key={sub.title}
                                            to={sub.route}
                                            className="flex flex-col gap-2 border border-gray-200 rounded-lg p-4 hover:border-altec-teal hover:shadow-sm transition-colors"
                                        >
                                            {content}
                                        </Link>
                                    ) : (
                                        <div
                                            key={sub.title}
                                            className="flex flex-col gap-2 border border-gray-200 rounded-lg p-4"
                                        >
                                            {content}
                                        </div>
                                    );
                                })}
                                </div>
                            )}
                        </>
                    );

                    return feature.route ? (
                        <Link
                            key={feature.title}
                            to={feature.route}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3 hover:border-altec-teal hover:shadow-md transition-colors"
                        >
                            {cardContent}
                        </Link>
                    ) : (
                        <div
                            key={feature.title}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3"
                        >
                            {cardContent}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
