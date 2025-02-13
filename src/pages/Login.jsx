import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import useUserService from '../services/UserService';
import toast from 'react-hot-toast';

function Login() {
    const [passVisible, setPassVisible] = useState(false)

    const { login } = useUserService();
    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({
        email: "",
        password: "",
    })


    const handleForm = (e) => {
        const { name, value } = e.target
        setFormdata({ ...formdata, [name]: value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formdata.email === "" || formdata.password === "") {
            toast.error("Please fill all the fields")
            return
        }

        try {
            const currentUser = login(formdata.email , formdata.password)
            if (currentUser) {
                toast.success("Login Successful")
                window.location.reload()
            }

        } catch (err) {
            toast.error(err.message)
        }


    }

    return (
        <div className="font-sans text-gray-900 antialiased">
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8f4f3]">
                <div className='flex  items-center justify-center gap-4'>
                    <div className="h-28 w-28 relative">
                        <img src="/logo.png" className='h-full w-full absolute object-cover' alt="" />

                    </div>
                    <h2 className="font-bold text-3xl">Box <span className="bg-[#f84525] text-white px-2 rounded-md">Buddy</span></h2>
                </div>

                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <form onChange={handleForm} onSubmit={handleSubmit}>

                        <div className="py-8">
                            <center>
                                <span className="text-2xl font-semibold">Log In</span>
                            </center>
                        </div>

                        <div>
                            <label className="block font-medium text-sm text-gray-700" for="email" value="Email" />
                            <input type='email'
                                name='email'
                                placeholder='Email'
                                className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]" />
                        </div>


                        <div className="mt-4">
                            <label className="block font-medium text-sm text-gray-700" for="password" value="Password" />
                            <div className="relative">
                                <input id="password" type={passVisible ? 'text' : 'password'} name="password" placeholder="Password" required autocomplete="current-password" className='w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]' />

                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    <button type="button" onClick={() => { setPassVisible(!passVisible) }} id="togglePassword" className="text-gray-500 cursor-pointer focus:outline-none focus:text-gray-600 hover:text-gray-600">
                                        {passVisible ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                            </div>
                        </div>



                        <div className="flex items-center justify-end mt-4">
                            <Link to={'/Signup'} className="hover:underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('password.request') }}">
                                Don't have an Account ?
                            </Link>

                            <button className='ms-4 cursor-pointer inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150'>
                                Sign In
                            </button>

                        </div>

                    </form>
                </div>
            </div >
        </div >

    )
}

export default Login