import { FileText, Calendar, MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { HealthReport } from '@/types/index';

interface MyReportsProps {
    reports: HealthReport[];
}

export function MyReports({ reports }: MyReportsProps) {

    // FIX: Added default case to prevent undefined class names
    const getSeverityColor = (severity: HealthReport['severity']) => {
        switch (severity) {
            case 'severe':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'moderate':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'mild':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // FIX: Added default case to prevent crash when status is unknown
    const getStatusConfig = (status: HealthReport['status']) => {
        switch (status) {
            case 'resolved':
                return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Resolved' };
            case 'reviewed':
            case 'investigating': // Handle variations
                return { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Under Review' };
            case 'pending':
            default:
                return { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Pending Review' };
        }
    };

    const sortedReports = [...reports].sort(
        (a, b) => new Date(b.timestamp || b.dateOfOnset).getTime() - new Date(a.timestamp || a.dateOfOnset).getTime()
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl text-gray-900 mb-1">My Health Reports</h2>
                    <p className="text-sm text-gray-600">Your submission history</p>
                </div>
                <div className="px-3 py-1 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-900">{reports.length} total</span>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reports submitted yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Your health reports will appear here after submission
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedReports.map((report) => {
                        // Safe because getStatusConfig now always returns an object
                        const status = getStatusConfig(report.status);
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={report.id}
                                className="p-4 border-2 border-gray-200 rounded-lg hover:shadow-md transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Status Icon */}
                                    <div className={`p-2 ${status.bg} rounded-lg flex-shrink-0`}>
                                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${status.bg} ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded border text-xs capitalize ${getSeverityColor(report.severity)}`}>
                                                        {report.severity} Severity
                                                    </span>
                                                    {report.confirmedDisease && (
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded border border-red-200">
                                                            Confirmed
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            Symptoms started: {new Date(report.dateOfOnset).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        {/* FIX: Safe Access for Location */}
                                                        {report.location ? (
                                                            <span>
                                                                {report.location.building} - Room {report.location.room} - Seat {report.location.seatNumber}
                                                            </span>
                                                        ) : (
                                                            <span>Location info unavailable</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Symptoms */}
                                        <div className="mb-3">
                                            <div className="text-xs text-gray-500 mb-1">Reported Symptoms:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {report.symptoms.map((symptom) => (
                                                    <span
                                                        key={symptom}
                                                        className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                                                    >
                                                        {symptom.replace('-', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {report.confirmedDisease && report.diseaseName && (
                                            <div className="mb-3 p-2 bg-red-50 rounded border border-red-200">
                                                <div className="text-xs text-red-900">
                                                    <strong>Confirmed Diagnosis:</strong> {report.diseaseName}
                                                </div>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="pt-3 border-t border-gray-200">
                                            <span className="text-xs text-gray-500">
                                                Submitted: {new Date(report.timestamp || report.dateOfOnset).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}