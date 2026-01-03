import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { api } from '@/services/api';
import type { Symptom } from '@/types/index';

interface SymptomSelectorProps {
    selectedSymptoms: string[];
    onSymptomToggle: (symptomId: string) => void;
}

export function SymptomSelector({ selectedSymptoms, onSymptomToggle }: SymptomSelectorProps) {
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        api.resources.getSymptoms()
            .then(data => setSymptoms(data))
            .catch(err => console.error("Failed to load symptoms", err))
            .finally(() => setLoading(false));
    }, []);

    const categories = ['all', 'respiratory', 'digestive', 'general'];

    const filteredSymptoms = filter === 'all'
        ? symptoms
        : symptoms.filter(s => s.category === filter);

    const getIcon = (iconName: string) => {
        // Dynamic icon lookup from string name
        const Icon = (LucideIcons as any)[iconName] || LucideIcons.Circle;
        return Icon;
    };

    if (loading) return <div className="text-center p-4">Loading symptoms...</div>;

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredSymptoms.map(symptom => {
                    const Icon = getIcon(symptom.icon);
                    // Handle case where symptom might use 'key' or 'id'
                    const symptomKey = symptom.key || symptom.id;
                    const isSelected = selectedSymptoms.includes(symptomKey);

                    return (
                        <button
                            key={symptom.id}
                            onClick={() => onSymptomToggle(symptomKey)}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                        >
                            <div className={`p-2 rounded-full ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{symptom.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}