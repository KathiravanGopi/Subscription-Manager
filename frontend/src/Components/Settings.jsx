import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  selectAuthUser, 
  selectAuthLoading, 
  deleteAccount,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  sendEmailUpdateOTP,
  verifyEmailUpdateOTP
} from '../redux/authSlice'
import { toast } from 'react-toastify'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import OtpInput from './OtpInput'

const Settings = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(selectAuthUser)
    const loading = useSelector(selectAuthLoading)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [newUsername, setNewUsername] = useState('')
    
    // OTP states
    const [passwordOtpSent, setPasswordOtpSent] = useState(false)
    const [passwordOtp, setPasswordOtp] = useState('')
    const [emailOtpSent, setEmailOtpSent] = useState(false)
    const [emailOtp, setEmailOtp] = useState('')

    const username = user?.name || (user?.email ? user.email.split('@')[0] : 'User')

    // Send Password Reset OTP
    const handleSendPasswordOTP = async (e) => {
        e.preventDefault()
        
        if (!passwordData.currentPassword) {
            toast.error('Please enter your current password', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        const action = await dispatch(sendPasswordResetOTP({ 
            currentPassword: passwordData.currentPassword 
        }))

        if (sendPasswordResetOTP.fulfilled.match(action)) {
            toast.success('OTP sent to your email! Please check your inbox.', {
                position: 'top-right',
                autoClose: 5000,
            })
            setPasswordOtpSent(true)
        } else {
            toast.error(action.payload || 'Failed to send OTP', {
                position: 'top-right',
                autoClose: 3000,
            })
        }
    }

    // Verify OTP and Reset Password
    const handlePasswordReset = async (e) => {
        e.preventDefault()
        
        if (!passwordOtp || passwordOtp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match!', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters!', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        const action = await dispatch(verifyPasswordResetOTP({
            otp: passwordOtp,
            newPassword: passwordData.newPassword
        }))

        if (verifyPasswordResetOTP.fulfilled.match(action)) {
            toast.success('Password updated successfully!', {
                position: 'top-right',
                autoClose: 3000,
            })
            setIsPasswordModalOpen(false)
            setPasswordOtpSent(false)
            setPasswordOtp('')
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } else {
            toast.error(action.payload || 'Invalid OTP or failed to update password', {
                position: 'top-right',
                autoClose: 3000,
            })
        }
    }

    // Send Email Update OTP
    const handleSendEmailOTP = async (e) => {
        e.preventDefault()
        
        if (!newUsername.trim()) {
            toast.error('Please enter a new email address!', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        const action = await dispatch(sendEmailUpdateOTP({
            newEmail: newUsername
        }))

        if (sendEmailUpdateOTP.fulfilled.match(action)) {
            toast.success('OTP sent to your current email! Please check your inbox.', {
                position: 'top-right',
                autoClose: 5000,
            })
            setEmailOtpSent(true)
        } else {
            toast.error(action.payload || 'Failed to send OTP', {
                position: 'top-right',
                autoClose: 3000,
            })
        }
    }

    // Verify OTP and Update Email
    const handleVerifyEmailOTP = async () => {
        if (!emailOtp || emailOtp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        const action = await dispatch(verifyEmailUpdateOTP({ otp: emailOtp }))

        if (verifyEmailUpdateOTP.fulfilled.match(action)) {
            toast.success('Email updated successfully! Redirecting to login...', {
                position: 'top-right',
                autoClose: 3000,
            })
            setIsUsernameModalOpen(false)
            setEmailOtpSent(false)
            setEmailOtp('')
            setNewUsername('')
            
            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login')
            }, 1500)
        } else {
            toast.error(action.payload || 'Invalid or expired OTP', {
                position: 'top-right',
                autoClose: 3000,
            })
        }
    }

    // Delete Account Handler
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            toast.error('Please type DELETE to confirm', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        const action = await dispatch(deleteAccount())

        if (deleteAccount.fulfilled.match(action)) {
            toast.success('Account deleted successfully', {
                position: 'top-right',
                autoClose: 3000,
            })
            setIsDeleteModalOpen(false)
            
            // Redirect to login
            setTimeout(() => {
                navigate('/login')
            }, 1500)
        } else {
            toast.error(action.payload || 'Failed to delete account', {
                position: 'top-right',
                autoClose: 3000,
            })
        }
    }

    return (
        <>
            <section className="relative min-h-screen overflow-hidden">
                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 z-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

                    {/* User Info Card */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Username:</span>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">{username}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h2>
                        <div className="space-y-4">
                            {/* Reset Password */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Reset Password</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
                                </div>
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Change
                                </button>
                            </div>

                            {/* Reset Username */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Reset Email</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Change your account email address</p>
                                </div>
                                <button
                                    onClick={() => setIsUsernameModalOpen(true)}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                >
                                    Update
                                </button>
                            </div>

                            {/* Delete Account */}
                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div>
                                    <h3 className="font-medium text-red-900 dark:text-red-400">Delete Account</h3>
                                    <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
                                </div>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reset Password Modal */}
            <Dialog open={isPasswordModalOpen} onClose={() => {
                setIsPasswordModalOpen(false)
                setPasswordOtpSent(false)
                setPasswordOtp('')
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
            }} className="relative z-[9000]">
                <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Reset Password
                        </DialogTitle>
                        
                        {!passwordOtpSent ? (
                            /* Step 1: Enter current password and send OTP */
                            <form onSubmit={handleSendPasswordOTP} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    We'll send a verification code to your email address.
                                </p>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPasswordModalOpen(false)
                                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Step 2: Enter OTP and new password, then submit */
                            <form onSubmit={handlePasswordReset} className="space-y-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Enter the 6-digit code sent to <strong>{user?.email}</strong>
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                                        Verification Code
                                    </label>
                                    <OtpInput 
                                        length={6}
                                        onComplete={(otp) => setPasswordOtp(otp)}
                                        loading={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                        disabled={loading}
                                        placeholder="Enter new password (min 6 characters)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                        disabled={loading}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        disabled={loading || passwordOtp.length !== 6}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPasswordOtpSent(false)
                                            setPasswordOtp('')
                                            setPasswordData({ ...passwordData, newPassword: '', confirmPassword: '' })
                                        }}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                                        disabled={loading}
                                    >
                                        Back
                                    </button>
                                </div>
                            </form>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Reset Username Modal */}
            <Dialog open={isUsernameModalOpen} onClose={() => {
                setIsUsernameModalOpen(false)
                setEmailOtpSent(false)
                setEmailOtp('')
                setNewUsername('')
            }} className="relative z-[9000]">
                <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Update Email Address
                        </DialogTitle>
                        
                        {!emailOtpSent ? (
                            /* Step 1: Enter new email and send OTP */
                            <form onSubmit={handleSendEmailOTP} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        New Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter new email"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    We'll send a verification code to your current email address.
                                </p>
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                    Note: You will be logged out after updating your email and need to login again.
                                </p>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsUsernameModalOpen(false)
                                            setNewUsername('')
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Step 2: Enter OTP to verify */
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Enter the 6-digit code sent to <strong>{user?.email}</strong>
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                                        Verification Code
                                    </label>
                                    <OtpInput 
                                        length={6}
                                        onComplete={(otp) => setEmailOtp(otp)}
                                        loading={loading}
                                    />
                                </div>
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                    Your email will be changed to: <strong>{newUsername}</strong>
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleVerifyEmailOTP}
                                        disabled={loading || emailOtp.length !== 6}
                                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Verifying...' : 'Verify & Update Email'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEmailOtpSent(false)
                                            setEmailOtp('')
                                        }}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Delete Account Modal */}
            <Dialog open={isDeleteModalOpen} onClose={setIsDeleteModalOpen} className="relative z-[9000]">
                <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                Delete Account
                            </DialogTitle>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            This action cannot be undone. This will permanently delete your account and remove all your subscriptions data from our servers.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Type <span className="font-bold text-red-600">DELETE</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Type DELETE"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading || deleteConfirmText !== 'DELETE'}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Deleting...' : 'Delete Account'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setDeleteConfirmText('')
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default Settings
