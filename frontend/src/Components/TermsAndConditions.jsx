import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../redux/authSlice'
import { DocumentTextIcon, ShieldCheckIcon, UserGroupIcon, CreditCardIcon, BellAlertIcon, TrashIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

const TermsAndConditions = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const navigate = useNavigate()
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                        <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms and Conditions</h1>
                    <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                {/* Content */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8">
                    
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            1. Introduction
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Welcome to Subscription Manager! By accessing or using our service, you agree to be bound by these Terms and Conditions. 
                            Our platform is designed to help you track, manage, and optimize your subscription services in one centralized location. 
                            Please read these terms carefully before using our services.
                        </p>
                    </section>

                    {/* Account Registration */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                            2. Account Registration and Security
                        </h2>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Account Creation:</strong> You must provide accurate, complete, and current information during registration. 
                                Each account must have a unique email address and username.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Password Security:</strong> You are responsible for maintaining the confidentiality of your password. 
                                We use bcrypt encryption to secure your password. You agree to notify us immediately of any unauthorized access to your account.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Two-Step Verification:</strong> We implement OTP (One-Time Password) verification for critical account operations 
                                including password changes and email updates to ensure the security of your account.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Account Responsibility:</strong> You are solely responsible for all activities that occur under your account. 
                                We are not liable for any loss or damage arising from unauthorized use of your account.
                            </p>
                        </div>
                    </section>

                    {/* Subscription Management */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CreditCardIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            3. Subscription Management Services
                        </h2>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Service Purpose:</strong> Our service allows you to track your third-party subscriptions by storing information 
                                such as subscription name, category, price, billing cycle, next billing date, and notes. We do not process any payments or have access to your financial accounts.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Data Accuracy:</strong> You are responsible for the accuracy of the subscription information you enter. 
                                We provide the tools to manage your subscriptions, but we do not verify or validate the information you provide.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">User Data Isolation:</strong> Each user's subscription data is completely isolated and protected. 
                                You can only view, edit, or delete subscriptions associated with your own account. We enforce strict user authentication on all operations.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">No Financial Liability:</strong> We are not responsible for any charges, renewals, or cancellations 
                                of your actual third-party subscriptions. Our service is for tracking purposes only.
                            </p>
                        </div>
                    </section>

                    {/* Privacy and Data Protection */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <LockClosedIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                            4. Privacy and Data Protection
                        </h2>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Data Collection:</strong> We collect only essential information including your name, email, 
                                and subscription details that you voluntarily provide.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Data Storage:</strong> All data is stored securely in MongoDB with proper encryption and access controls. 
                                Your passwords are hashed using bcrypt, and we use JWT tokens with HTTP-only cookies for session management.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Data Usage:</strong> We use your email address solely for account authentication, password recovery, 
                                and account verification purposes. We will never sell or share your personal information with third parties.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Data Retention:</strong> Your data remains in our system until you choose to delete your account. 
                                Upon account deletion, all your subscription data is permanently removed from our servers.
                            </p>
                        </div>
                    </section>

                    {/* Email Communications */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <EnvelopeIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            5. Email Communications
                        </h2>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">OTP Emails:</strong> We send One-Time Password (OTP) emails for password reset and email update operations. 
                                These OTPs expire after 10 minutes for security purposes.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Service Emails:</strong> By using our service, you consent to receive transactional emails 
                                related to your account security and important service updates.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Email Delivery:</strong> We use secure email delivery services, but we cannot guarantee 
                                email delivery due to factors beyond our control (spam filters, email server issues, etc.).
                            </p>
                        </div>
                    </section>

                    {/* User Responsibilities */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <BellAlertIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            6. User Responsibilities and Prohibited Conduct
                        </h2>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="leading-relaxed">You agree not to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Use the service for any unlawful purpose or in violation of these terms</li>
                                <li>Attempt to gain unauthorized access to other users' accounts or data</li>
                                <li>Upload or transmit viruses, malware, or any malicious code</li>
                                <li>Use automated systems (bots, scrapers) to access the service without permission</li>
                                <li>Attempt to reverse engineer, decompile, or disassemble any part of the service</li>
                                <li>Share your account credentials with others or allow others to use your account</li>
                                <li>Submit false, misleading, or fraudulent information</li>
                                <li>Interfere with or disrupt the service or servers/networks connected to the service</li>
                            </ul>
                        </div>
                    </section>

                    {/* Account Deletion */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrashIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            7. Account Deletion and Data Removal
                        </h2>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Right to Delete:</strong> You have the right to delete your account at any time 
                                through the Settings page. This action requires OTP verification for security.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Data Removal:</strong> Upon account deletion, all your personal data and subscription 
                                information will be permanently removed from our database. This action is irreversible.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Backup Retention:</strong> Some anonymized data may remain in our backup systems 
                                for up to 30 days after deletion for disaster recovery purposes only.
                            </p>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Intellectual Property</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            All content, features, and functionality of Subscription Manager, including but not limited to text, graphics, logos, 
                            icons, and software, are the property of Subscription Manager and are protected by copyright, trademark, and other intellectual property laws. 
                            You may not reproduce, distribute, or create derivative works without explicit written permission.
                        </p>
                    </section>

                    {/* Disclaimer and Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Disclaimer and Limitation of Liability</h2>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Service "As Is":</strong> The service is provided on an "as is" and "as available" basis 
                                without warranties of any kind, either express or implied.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">No Liability for Third-Party Services:</strong> We are not responsible for any issues, 
                                charges, or problems with your actual third-party subscriptions. Our service is for tracking only.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Limited Liability:</strong> To the maximum extent permitted by law, we shall not be liable 
                                for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-gray-900 dark:text-white">Data Loss:</strong> While we implement reasonable security measures, we are not liable 
                                for any data loss. We recommend keeping your own backup records of important subscription information.
                            </p>
                        </div>
                    </section>

                    {/* Service Modifications */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Service Modifications and Termination</h2>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="leading-relaxed">
                                We reserve the right to modify, suspend, or discontinue any part of the service at any time with or without notice. 
                                We may also terminate or suspend your account for violation of these terms without prior notice.
                            </p>
                        </div>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Changes to Terms</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We may update these Terms and Conditions from time to time. We will notify users of any material changes by updating 
                            the "Last updated" date at the top of this page. Your continued use of the service after such changes constitutes 
                            acceptance of the updated terms.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Governing Law</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            These Terms and Conditions shall be governed by and construed in accordance with applicable laws. 
                            Any disputes arising from these terms shall be resolved through appropriate legal channels.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Contact Information</h2>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                                If you have any questions about these Terms and Conditions, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <p className="flex items-center gap-2">
                                    <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <strong>Email:</strong> <a href="mailto:kathiravangopi12@gmail.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">kathiravangopi12@gmail.com</a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <DocumentTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <strong>GitHub:</strong> <a href="https://github.com/KathiravanGopi" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">@KathiravanGopi</a>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Acceptance */}
                    <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center font-medium">
                            By using Subscription Manager, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                        </p>
                    </section>

                </div>

                {/* Navigation Links */}
                <div className="text-center mt-8 space-y-3">
                    {isAuthenticated ? (
                        <Link 
                            to="/settings" 
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Settings
                        </Link>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => window.close()}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Close Window
                            </button>
                            <Link 
                                to="/signup" 
                                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Signup
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default TermsAndConditions
