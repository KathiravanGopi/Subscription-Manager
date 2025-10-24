import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { register as registerThunk, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../redux/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LiquidEther from './LiquidEther'

const Signup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loading = useSelector(selectAuthLoading)
    const error = useSelector(selectAuthError)
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const { handleSubmit, register, watch, formState: { errors } } = useForm()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/view-subs');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {
        const { username, email, password, confirmPassword } = data
        if (password !== confirmPassword) {
            toast.error('Passwords do not match!', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }
        const action = await dispatch(registerThunk({ name: username, email, password }))
        if (registerThunk.fulfilled.match(action)) {
            toast.success('Account created successfully! Welcome aboard.', {
                position: 'top-right',
                autoClose: 3000,
            })
            navigate('/view-subs')
        } else {
            toast.error(action.payload || 'Registration failed. Please try again.', {
                position: 'top-right',
                autoClose: 4000,
            })
        }
    }

    return (
        <section className="relative bg-gray-50 dark:bg-gray-900 min-h-screen overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                <LiquidEther 
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']} 
                    mouseForce={20} 
                    cursorSize={100} 
                    autoDemo={true} 
                />
            </div>
            <div className="relative flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 mx-auto min-h-screen lg:py-0 z-10">
                <p className="flex items-center mb-3 sm:mb-6 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-6 h-6 sm:w-8 sm:h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    Subscription Manager
                </p>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-4 sm:p-8 space-y-3 sm:space-y-4 md:space-y-6">
                        <h1 className="text-lg sm:text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <form className="space-y-3 sm:space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <input type="text" id="username" placeholder="Your name" {...register('username', { required: 'Username is required' })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" id="email" placeholder="name@company.com" {...register('email', { required: 'Email is required' })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" id="password" placeholder="••••••••" {...register('password', { required: 'Password is required' })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input type="password" id="confirmPassword" placeholder="••••••••" {...register('confirmPassword', { required: 'Confirm your password' })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                {watch('confirmPassword') && watch('password') && watch('confirmPassword') !== watch('password') && (
                                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                                )}
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" {...register('terms', { required: 'Accept the terms' })} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <Link to="/terms" target="_blank" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Terms and Conditions</Link></label>
                                </div>
                            </div>
                            {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}
                                            <button type="submit" disabled={loading} className="relative w-full inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600 group-hover:from-purple-500 group-hover:via-pink-400 group-hover:to-purple-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 disabled:opacity-70 shadow-lg shadow-purple-500/50">
                                                <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                                                    {loading ? 'Creating...' : 'Create an account'}
                                                </span>
                                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Signup