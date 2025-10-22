import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { postSubs } from '../redux/subsSlice';
import { useDispatch } from 'react-redux';

function FormContainer() {
  const { handleSubmit, reset, register, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = watch('category', '');
  const billingCycle = watch('billingCycle', '');
  const startDate = watch('startDate', '');
  const nextBillingDate = watch('nextBillingDate', '');
  const isActive = watch('isActive', '');
  const submit = (data) => {
    dispatch(postSubs(data));
    reset();
    navigate('/view-subs')
  }
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center px-6 py-8 mx-auto min-h-screen lg:py-10">
          <Link to="/addSubs" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
            Subscription Manager
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg md:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="top-0 bg-white dark:bg-gray-800 z-10 py-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Add Subscription
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(submit)}>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subscription Name</label>
                  <input type="text" {...register('name', { required: 'Subscription name is required' })} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter subscription name" />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    id="category"
                    defaultValue=""
                    className={`bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${!category ? 'text-gray-400' : 'text-gray-900'} dark:text-white`}
                  >
                    <option value="" disabled>Select from below</option>
                    <option value="Music">Music</option>
                    <option value="OTT">OTT</option>
                    <option value="Shopping Sites">Shopping Sites</option>
                    <option value="Clubs">Clubs</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
                <div>
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                  <input type="number" min="0" step="0.01" {...register('price', { required: 'Price is required' })} id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter price" />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label htmlFor="billingCycle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Billing Cycle</label>
                  <select
                    {...register('billingCycle', { required: 'Billing cycle is required' })}
                    id="billingCycle"
                    defaultValue=""
                    className={`bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${!billingCycle ? 'text-gray-400' : 'text-gray-900'} dark:text-white`}
                  >
                    <option value="" disabled>Select from below</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  {errors.billingCycle && <p className="text-red-500 text-sm mt-1">{errors.billingCycle.message}</p>}
                </div>

                <div>
                  <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                  <input
                    type="date"
                    {...register('startDate', { required: 'Start Date is required' })}
                    id="startDate"
                    placeholder="yyyy-mm-dd"
                    className={`bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${!startDate ? 'text-gray-400' : 'text-gray-900'} dark:text-white`}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                </div>
                <div>
                  <label htmlFor="nextBillingDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Next Billing Date</label>
                  <input
                    type="date"
                    {...register('nextBillingDate', { required: 'Next billing Date is required' })}
                    id="nextBillingDate"
                    placeholder="yyyy-mm-dd"
                    className={`bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${!nextBillingDate ? 'text-gray-400' : 'text-gray-900'} dark:text-white`}
                  />
                  {errors.nextBillingDate && <p className="text-red-500 text-sm mt-1">{errors.nextBillingDate.message}</p>}
                </div>
                <div>
                  <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
                  <textarea {...register('notes')} id="notes" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Enter notes (optional)'></textarea>
                </div>
                <div>
                  <label htmlFor="isActive" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Active</label>
                  <select
                    {...register('isActive', { required: 'Billing cycle is required' })}
                    id="isActive"
                    defaultValue=""
                    className={`bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${!isActive ? 'text-gray-400' : 'text-gray-900'} dark:text-white`}
                  >
                    <option value="" disabled>Select from below</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  {errors.isActive && <p className="text-red-500 text-sm mt-1">{errors.isActive.message}</p>}
                </div>
                <button type='submit' className="relative w-full inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                  <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                    Add Subscription
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
// startDate, nextBillingDate, notes, isActive

export default FormContainer;
