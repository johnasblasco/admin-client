import { useState } from 'react';
import { Send, Calendar, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { SymptomSelector } from './SymptomSelector';
import { LocationSelector } from './LocationSelector';
import { api } from '@/services/api';
import type { SeverityLevel, CreateHealthReport } from '@/types/index';

interface StudentReportFormProps {
    onSuccess: () => void;
    onClose?: () => void;
}

export function StudentReportForm({ onSuccess, onClose }: StudentReportFormProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        symptoms: [] as string[],
        severity: 'mild' as SeverityLevel,
        dateOfOnset: new Date().toISOString().split('T')[0],
        confirmedDisease: false,
        diseaseName: '',
        gradeLevel: 'Grade 10', // Default
        location: {
            building: '',
            room: '',
            seatNumber: '',
        },
    });

    const handleSymptomToggle = (symptomId: string) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptomId)
                ? prev.symptoms.filter(s => s !== symptomId)
                : [...prev.symptoms, symptomId],
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const payload: CreateHealthReport = {
                userGradeLevel: formData.gradeLevel,
                symptoms: formData.symptoms,
                severity: formData.severity,
                dateOfOnset: new Date(formData.dateOfOnset).toISOString(),
                confirmedDisease: formData.confirmedDisease,
                diseaseName: formData.confirmedDisease ? formData.diseaseName : undefined,
                location: formData.location,
            };

            await api.reports.submit(payload);

            setIsSuccess(true);

            // Wait 2 seconds before closing
            setTimeout(() => {
                onSuccess();
            }, 2000);

        } catch (error: any) {
            console.error("Submission failed", error);
            setSubmitError(error.message || "Failed to submit report. Please try again.");
            setIsSubmitting(false);
        }
    };

    // --- Steps Logic ---
    const canProceedToStep2 = formData.symptoms.length > 0;
    const canProceedToStep3 = formData.gradeLevel && formData.dateOfOnset;
    const canProceedToStep4 = formData.location.building && formData.location.room && formData.location.seatNumber;

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl text-gray-900">Report Submitted!</h2>
                    <p className="text-gray-600">We are redirecting you back to the dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Close button */}
            {onClose && (
                <div className="flex justify-end mb-4">
                    <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all">
                        <X className="w-4 h-4" /> Close
                    </button>
                </div>
            )}

            {/* Progress Bar (Same as before) */}
            <div className="mb-8">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {[1, 2, 3, 4].map((s, idx) => (
                        <div key={s} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {s}
                                </div>
                            </div>
                            {idx < 3 && <div className={`h-0.5 flex-1 -mt-4 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Step 1: Symptoms */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl text-gray-900">Select Symptoms</h2>
                        <SymptomSelector selectedSymptoms={formData.symptoms} onSymptomToggle={handleSymptomToggle} />
                        <div className="flex justify-end">
                            <button onClick={() => setStep(2)} disabled={!canProceedToStep2} className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl text-gray-900">Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">When did symptoms start?</label>
                                <input type="date" value={formData.dateOfOnset} onChange={(e) => setFormData(prev => ({ ...prev, dateOfOnset: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Severity</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['mild', 'moderate', 'severe'] as SeverityLevel[]).map(level => (
                                        <button key={level} onClick={() => setFormData(prev => ({ ...prev, severity: level }))} className={`p-3 rounded-lg border capitalize ${formData.severity === level ? 'bg-blue-50 border-blue-600 text-blue-700' : 'hover:bg-gray-50'}`}>{level}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setStep(1)} className="px-6 py-3 border rounded-lg">Back</button>
                            <button onClick={() => setStep(3)} disabled={!canProceedToStep3} className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Location */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl text-gray-900">Location</h2>
                        <LocationSelector selectedLocation={formData.location} onLocationChange={(loc) => setFormData(prev => ({ ...prev, location: loc }))} />
                        <div className="flex justify-between">
                            <button onClick={() => setStep(2)} className="px-6 py-3 border rounded-lg">Back</button>
                            <button onClick={() => setStep(4)} disabled={!canProceedToStep4} className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">Review</button>
                        </div>
                    </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl text-gray-900">Review & Submit</h2>

                        {/* Summary Card */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                            <p><strong>Symptoms:</strong> {formData.symptoms.join(', ')}</p>
                            <p><strong>Severity:</strong> {formData.severity}</p>
                            <p><strong>Location:</strong> {formData.location.building}, Room {formData.location.room}, Seat {formData.location.seatNumber}</p>
                        </div>

                        {submitError && (
                            <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {submitError}
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button onClick={() => setStep(3)} disabled={isSubmitting} className="px-6 py-3 border rounded-lg">Back</button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Submit Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}