import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSubs, fetchSubs, selectError, selectLoading, selectSubs, updateSubs } from '../redux/subsSlice'
import { Link } from 'react-router-dom'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import LiquidEther from './LiquidEther'

const Dashboard = () => {
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const subs = useSelector(selectSubs)
    const loading = useSelector(selectLoading)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedSub, setSelectedSub] = useState(null)
    const [editForm, setEditForm] = useState({ name: '', category: '', price: '', billingCycle: '' })
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [toDelete, setToDelete] = useState(null)
    
    // Search function
    const searchSubscriptions = (subscriptions, searchTerm) => {
        if (!searchTerm.trim()) return subscriptions
        
        const term = searchTerm.toLowerCase()
        return subscriptions.filter(sub => 
            sub.name.toLowerCase().includes(term) ||
            sub.category.toLowerCase().includes(term) ||
            sub.billingCycle.toLowerCase().includes(term) ||
            (sub.notes && sub.notes.toLowerCase().includes(term)) ||
            sub.price.toString().includes(term)
        )
    }
    
    // Filter subscriptions based on search term
    const filteredSubs = searchSubscriptions(subs, search)
    
    useEffect(() => {
        dispatch(fetchSubs())
    }, [])

    const formatDate = (value) => {
        if (!value) return 'N/A'
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return String(value)
        // YYYY-MM-DD
        return d.toISOString().slice(0, 10)
    }

    if (loading) return <p className="text-center py-8 text-gray-700 dark:text-gray-200">Loading...</p>

    const openEdit = (sub) => {
        setSelectedSub(sub)
        setEditForm({
            name: sub.name || '',
            category: sub.category || '',
            price: sub.price || '',
            billingCycle: sub.billingCycle || '',
        })
        setIsEditOpen(true)
    }
    const closeEdit = () => {
        setIsEditOpen(false)
        setSelectedSub(null)
    }

    const onChangeEdit = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const onSaveEdit = async () => {
        if (!selectedSub) return
        const action = await dispatch(updateSubs({ id: selectedSub.id, subData: editForm }))
        if (updateSubs.fulfilled.match(action)) {
            toast.success('Subscription updated successfully!', {
                position: 'top-right',
                autoClose: 3000,
            })
            closeEdit()
        } else {
            toast.error('Failed to update subscription. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            })
        }
    }

    const openDelete = (sub) => {
        setToDelete(sub)
        setIsDeleteOpen(true)
    }

    const closeDelete = () => {
        setIsDeleteOpen(false)
        setToDelete(null)
    }

    const confirmDelete = async () => {
        if (!toDelete) return
        const action = await dispatch(deleteSubs(toDelete.id))
        if (deleteSubs.fulfilled.match(action)) {
            toast.success(`"${toDelete.name}" deleted successfully!`, {
                position: 'top-right',
                autoClose: 3000,
            })
            closeDelete()
        } else {
            toast.error('Failed to delete subscription. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            })
        }
    }

    return (
        <>
            <section className="relative h-screen overflow-hidden">
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 h-full overflow-y-auto z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

                    <div className="mb-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                <label htmlFor="table-search-subscriptions" className="sr-only">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="table-search-subscriptions"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="block pb-2 pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Search name, category, billing cycle, notes, or price..."
                                    />
                                </div>
                                {search && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {filteredSubs.length} of {subs.length} subscriptions
                                        {search && (
                                            <button
                                                onClick={() => setSearch('')}
                                                className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-x-auto rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md max-h-[calc(100vh-200px)]">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 dark:bg-gray-700/50 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Subscription Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Billing Cycle
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Next Billing Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Notes
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Active
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {subs.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-900 dark:text-white">
                                            No subscriptions found.
                                        </td>
                                    </tr>
                                ) : filteredSubs.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-900 dark:text-white">
                                            No subscriptions found for "{search}".
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSubs.map((sub) => (
                                        <tr key={sub.id} className="bg-transparent border-b dark:border-gray-700 border-gray-200 hover:bg-white/20 dark:hover:bg-gray-600/30">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{sub.name}</td>
                                            <td className="px-6 py-4">{sub.category}</td>
                                            <td className="px-6 py-4">${sub.price}</td>
                                            <td className="px-6 py-4">{sub.billingCycle}</td>
                                            <td className="px-6 py-4">{formatDate(sub.nextBillingDate)}</td>
                                            <td className="px-6 py-4">{sub.notes || '-'}</td>
                                            <td className="px-6 py-4">{sub.isActive ? 'Yes' : 'No'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => openEdit(sub)} 
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                                                        title="Edit Subscription"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => openDelete(sub)} 
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                                                        title="Delete Subscription"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}


                            </tbody>
                        </table>
                        <div id="editUserModal" tabIndex="-1" aria-hidden={!isEditOpen} className={`fixed inset-0 z-[9999] ${isEditOpen ? 'flex' : 'hidden'} items-center justify-center w-full p-4 overflow-hidden`}>
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEdit} />
                            <div className="relative w-full max-w-2xl max-h-full">
                                <form className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 border-gray-200">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Edit Subscription
                                        </h3>
                                        <button type="button" onClick={closeEdit} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subscription Name</label>
                                                <input name="name" type="text" value={editForm.name} onChange={onChangeEdit} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white" />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                                <input name="category" type="text" value={editForm.category} onChange={onChangeEdit} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white" />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                                <input name="price" type="number" step="0.01" value={editForm.price} onChange={onChangeEdit} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white" />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Billing Cycle</label>
                                                <input name="billingCycle" type="text" value={editForm.billingCycle} onChange={onChangeEdit} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white" />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button type="button" onClick={onSaveEdit} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                                        <button type="button" onClick={closeEdit} className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-700">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* Delete Confirmation Modal */}
                    <Dialog open={isDeleteOpen} onClose={setIsDeleteOpen} className="relative z-[9999]">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                        />
                        <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                                >
                                    <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                                                <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-400" />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <DialogTitle as="h3" className="text-base font-semibold text-white">
                                                    Delete subscription
                                                </DialogTitle>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-400">
                                                        Are you sure you want to delete
                                                        {` "${toDelete?.name || ''}"`}? This action cannot be undone.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            onClick={confirmDelete}
                                            className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            data-autofocus
                                            onClick={closeDelete}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </section>
        </>
    )
}

export default Dashboard