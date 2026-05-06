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
                {features.map((feature) => (
                    <div
                        key={feature.route}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-altec-dark">
                                {feature.title}
                            </h3>
                            <Link
                                to={feature.route}
                                className="text-sm font-semibold text-altec-teal hover:underline"
                            >
                                Open →
                            </Link>
                        </div>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                        <ul className="flex flex-col gap-1">
                            {feature.bullets.map((b) => (
                                <li key={b} className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-altec-teal shrink-0" />
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
