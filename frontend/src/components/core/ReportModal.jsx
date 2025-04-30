// src/components/modals/ReportModal.jsx
import { useState } from 'react';

const REPORT_REASONS = [
  'Inappropriate content',
  'Misinformation',
  'Spam or promotional',
  'Harmful or dangerous',
  'Other'
];

export default function ReportModal({ isOpen, onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalReason = selectedReason === 'Other' ? customReason : selectedReason;
    
    try {
      await onSubmit(finalReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl text-center font-bold mb-4 text-red-600 dark:text-red-400">
            Report Content
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            {REPORT_REASONS.map(reason => (
              <label key={reason} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="form-radio text-primary-600"
                />
                <span className="text-gray-700 dark:text-gray-300">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === 'Other' && (
            <div className="mt-4">
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please specify the reason..."
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-white"
                rows="3"
                required
              />
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={!selectedReason || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
