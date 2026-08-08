import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { type Job } from '../../types';

interface Document {
  id: string;
  type: 'CV' | 'LETTER';
  fileName: string;
}

interface Props {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplyModal = ({ job, onClose, onSuccess }: Props) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [coverNote, setCoverNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/documents')
      .then((res) => setDocuments(res.data.data ?? []))
      .catch(() => setError('Failed to load user documents.'));
  }, []);

  const cvDoc = documents.find((d) => d.type === 'CV');
  const letterDoc = documents.find((d) => d.type === 'LETTER');

  const handleSubmit = async () => {
    if (!confirmed) {
      setError('Please confirm that your documents are authentic.');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      await api.post('/applications', {
        jobPostingId: job.id,
        coverNote: coverNote || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to submit application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-xl font-bold text-navy">Complete Application</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {job.company.companyProfile?.companyName} — {job.title}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-400 hover:text-navy transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* CV Section */}
          <div className="mb-4">
            <p className="text-sm font-bold text-navy mb-1">CV PDF</p>
            <p className="text-xs text-gray-400 mb-2">
              Upload your latest professional curriculum vitae in PDF format.
            </p>
            {cvDoc ? (
              <div className="flex items-center gap-3 bg-teal-light border border-teal rounded-xl p-3">
                <span className="text-lg">📄</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy">{cvDoc.fileName}</p>
                  <p className="text-xs text-teal-dark">CV ready ✓</p>
                </div>
              </div>
            ) : (
              <Link
                to="/documents"
                className="flex flex-col items-center border border-dashed border-gray-200 rounded-xl p-6 hover:border-navy transition-colors"
              >
                <span className="text-3xl mb-2">📄</span>
                <p className="text-sm font-semibold text-navy">Click to upload CV</p>
                <p className="text-xs text-gray-400">PDF max 5MB</p>
              </Link>
            )}
          </div>

          {/* Endorsement Letter Section */}
          <div className="mb-4">
            <p className="text-sm font-bold text-navy mb-1">
              University Endorsement Letter
            </p>
            <p className="text-xs text-gray-400 mb-2">
              A signed letter from your Career Office confirming your academic eligibility.
            </p>
            {letterDoc ? (
              <div className="flex items-center gap-3 bg-teal-light border border-teal rounded-xl p-3">
                <span className="text-lg">✅</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy">{letterDoc.fileName}</p>
                  <p className="text-xs text-teal-dark">Letter ready ✓</p>
                </div>
              </div>
            ) : (
              <Link
                to="/documents"
                className="flex flex-col items-center border border-dashed border-gray-200 rounded-xl p-6 hover:border-navy transition-colors"
              >
                <span className="text-3xl mb-2">✅</span>
                <p className="text-sm font-semibold text-navy">Click to upload Letter</p>
                <p className="text-xs text-gray-400">PDF max 10MB</p>
              </Link>
            )}
          </div>

          {/* Cover Note Section */}
          <div className="mb-4">
            <textarea
              placeholder="Add a cover note (optional)..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-navy resize-none"
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
            />
          </div>

          {/* Confirmation Checkbox */}
          <div
            className="flex items-start gap-3 mb-5 cursor-pointer select-none"
            onClick={() => setConfirmed(!confirmed)}
          >
            <div
              className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                confirmed ? 'bg-navy border-navy' : 'border-gray-300'
              }`}
            >
              {confirmed && <span className="text-white text-xs">✓</span>}
            </div>
            <p className="text-xs text-gray-500 leading-5">
              I confirm that all uploaded documents are authentic and up to date
              according to university guidelines.
            </p>
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-navy text-white font-semibold py-4 rounded-xl hover:bg-navy-light transition-colors text-sm disabled:opacity-70 mb-2"
          >
            {isLoading ? 'Submitting...' : 'Submit Application ➤'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-gray-200 text-gray-500 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;