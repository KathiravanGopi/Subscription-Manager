import React, { useEffect } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const LogoutModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md">
        <div className="relative bg-gray-800 rounded-lg shadow-xl outline -outline-offset-1 outline-white/10 transform transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-400" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-base font-semibold text-white">
                  Sign Out
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Are you sure you want to sign out? You will need to log in again to access your subscriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex w-full justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto transition-colors"
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
