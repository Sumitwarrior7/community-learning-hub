// src/components/feed/FeedCard.jsx
import { useState, useEffect } from 'react';
import { saveFeed, reportFeed, unsaveFeed, checkFeedSaved } from '../../services/userService';
import { toast } from 'react-toastify';
import ReportModal from '../core/ReportModal';

const sourceColors = {
  reddit: 'text-white bg-orange-500',
  twitter: 'text-white bg-blue-400',
  linkedin: 'text-white bg-blue-700',
};

export default function FeedCard({ item, onUpdate }) {
  const [isSaved, setIsSaved] = useState(item.isSaved || false);
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  // on first render, ask “is this saved?”
  useEffect(() => {
    let isMounted = true;
    checkFeedSaved({ contentId: item.id, contentType: item.source })
      .then(({ isSaved }) => {
        if (isMounted) setIsSaved(isSaved);
      })
      .catch(() => {/* ignore */});
    return () => { isMounted = false; };
  }, [item.id, item.source]);

  // Handle save content
  const handleSaveToggle = async () => {
    if (isSaving) return
    setIsSaving(true)

    try {
      if (isSaved) {
        // unsave
        await unsaveFeed({ contentId: item.id, contentType: item.source })
        toast.success('Removed from saved')
        setIsSaved(false)
      } else {
        // save
        await saveFeed({
          contentId: item.id,
          contentType: item.source,
          metadata: {
            title: item.title,
            url: item.url,
            thumbnail: item.thumbnail,
            author: item.metadata.author,
            timestamp: item.metadata.timestamp
          }
        })
        toast.success('Saved successfully')
        setIsSaved(true)
      }
      onUpdate?.()
    } catch (error) {
      toast.error(error.message || 'Operation failed')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle report submission
  const handleReport = async (reason) => {
    try {
      console.log("Report item: ", item)
      await reportFeed({
        contentId: item.id,
        contentType: item.source,
        reason
      });
      toast.success('Report submitted successfully');
      setShowReport(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.message || 'Report failed');
    }
  };

  // Generate share URLs
  const shareContent = {
    title: item.title,
    url: item.url,
    text: `${item.title} - Check this out on Learning Hub`
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareContent.text + ' ' + shareContent.url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.text)}&url=${encodeURIComponent(shareContent.url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareContent.url)}`
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row">
        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex flex-col h-full">
            {/* Source and Title */}
            <div className="mb-2">
            <span
              className={`
                inline-block text-xs font-semibold uppercase py-0.5 px-2 rounded 
                ${sourceColors[item.source] || 'text-primary-600 dark:text-primary-400'}
              `}
            >
              {item.source}
            </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-1 text-lg font-medium text-gray-900 dark:text-gray-100 hover:underline"
              >
                {item.title}
              </a>
            </div>

            {/* Content Preview */}
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-1">
              {item.content}
            </p>

            {/* Metadata */}
            <div className="mt-auto text-sm text-gray-500 dark:text-gray-400">
              {item.metadata.author && (
                <div className="flex items-center gap-1 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{item.metadata.author}</span>
                </div>
              )}
              {item.metadata.timestamp && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{new Date(item.metadata.timestamp).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-3">
        <div className="flex items-center justify-end gap-2">
          {/* Save Button */}
          <button
            onClick={handleSaveToggle}
            disabled={isSaving}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-colors ${
              isSaved 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isSaving ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
          </button>

          {/* Share Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowShare(!showShare)}
              className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>

            {showShare && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-10">
                <div className="p-2 space-y-1">
                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.245-1.632a11.882 11.882 0 005.68 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </a>
                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Report Button */}
          <button
            onClick={() => setShowReport(true)}
            className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200 text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report
          </button>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={handleReport}
      />
    </div>
  );
}
