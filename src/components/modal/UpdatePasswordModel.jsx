

import { IoClose } from 'react-icons/io5'
import { Fragment } from 'react';
import PropTypes from 'prop-types'
import {
    Dialog,
    Transition,
    TransitionChild,
    DialogTitle,
    DialogPanel,

} from '@headlessui/react'
import useAuth from '../../hooks/useAuth';





const UpdatePasswordModel = ({ setIsOpen, isOpen, }) => {

    const { user,handleUpdatePassword, setLoading } = useAuth()


    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const form = e.target;
        const newPassword = form.newPassword.value;
        const currentPassword = form.currentPassword.value;
      

        if (user) {
            try {
             
                await handleUpdatePassword(newPassword, currentPassword);
                setLoading(false)
                setIsOpen(false)
            } catch (error) {
               
                console.log(error.message);
            }
        } else {
          
            console.log("No user is currently logged in.");
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as='div'
                className='relative z-10'
                onClose={() => setIsOpen(false)}
            >
                <TransitionChild
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black bg-opacity-25' />
                </TransitionChild>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <TransitionChild
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <DialogPanel className='w-full  max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                <DialogTitle
                                    as='h3'
                                    className='text-lg font-medium text-center leading-6 text-gray-900'
                                >
                                    Update profile
                                </DialogTitle>
                                <IoClose onClick={() => setIsOpen(false)} className="text-3xl ml-auto bg-red-300 rounded" />
                                <form action="" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor='name' className='block mb-2 text-sm capitalize'>
                                            old Password
                                        </label>
                                        <input type="password" name="currentPassword" placeholder="Current Password" required  className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900' />
                                      
                                    </div>
                                    <div>
                                        <label htmlFor='name' className='block mb-2 text-sm capitalize'>
                                            new Password
                                        </label>
                                        <input type="password" name="newPassword" placeholder="New Password" required className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900'/>

                                    </div>

                                    <button
                                        onClick={() => setIsOpen(false)}
                                        type='submit'
                                        className='bg-rose-500 w-full mt-4 rounded-md py-3 text-white'
                                    >
                                      Update Password
                                    </button>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
UpdatePasswordModel.propTypes = {
    setIsOpen: PropTypes.func,
    isOpen: PropTypes.bool,
}
export default UpdatePasswordModel;