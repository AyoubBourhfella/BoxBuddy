import React, { useEffect, useState } from 'react'
import { FaCheck, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import useUserService from '../services/UserService'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

function Signup() {
    const [passVisible, setPassVisible] = useState(false)
    const [passStrength, setPassStrength] = useState(0)
    const {signup} = useUserService();
    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    })


    const handleForm = (e) => {
        const { name, value } = e.target
        setFormdata({ ...formdata, [name]: value })
    }

    useEffect(() => {
        const pass = formdata.password
        let strength = 0;
        if (pass.length >= 8) strength += 25;
        if (/[A-Z]/.test(pass)) strength += 25;
        if (/[0-9]/.test(pass)) strength += 25;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
        setPassStrength(strength);
    }, [formdata.password])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formdata.password !== formdata.cpassword) {
            toast.error("Password and Confirm Password does not match")
            return
        }
        if (passStrength < 75) {
            toast.error("Password is weak")
            return
        }
        if(formdata.name === "" || formdata.email === "" || formdata.password === "" || formdata.cpassword === ""){
            toast.error("Please fill all the fields")
            return
        }

        try{
            const currentUser = signup(formdata)
            if(currentUser){
                toast.success("User Created Successfully")
                navigate("/")
            }

        }catch(err){
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
                    <form onSubmit={handleSubmit} onChange={handleForm}>

                        <div className="py-8">
                            <center>
                                <span className="text-2xl font-semibold">Sign up</span>
                            </center>
                        </div>

                        <div className="flex gap-2 items-center">
                            <div className='w-1/2'>
                                <label className="block font-medium text-sm text-gray-700" htmlFor="email" value="Email" />
                                <input type='text'
                                    name='name'
                                    placeholder='name'
                                    className="w-full rounded-md py-2.5 px-4 border-2 border-slate-200  text-sm outline-[#f84525]" />
                            </div>
                            <div className='w-1/2'>
                                <label className="block font-medium text-sm text-gray-700" htmlFor="email" value="Email" />
                                <input type='text'
                                    name='Lastname'
                                    placeholder='Last name'
                                    className="w-full rounded-md py-2.5 px-4 border-2 border-slate-200  text-sm outline-[#f84525]" />
                            </div>
                        </div>

                        <div className='mt-4'>
                            <label className="block font-medium text-sm text-gray-700" htmlFor="email" value="Email" />
                            <input type='email'
                                name='email'
                                placeholder='Email'
                                className="w-full rounded-md py-2.5 px-4 border-2 border-slate-200  text-sm outline-[#f84525]" />
                        </div>


                        <div className="mt-4">
                            <label className="block font-medium text-sm text-gray-700" htmlFor="password" value="Password" />
                            <div className="relative">
                                <input id="password" type={passVisible ? 'text' : 'password'} name="password" placeholder="Password" required autoComplete="current-password" className='w-full rounded-md py-2.5 px-4 border-2 border-slate-200 text-sm outline-[#f84525]' />

                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    <button type="button" onClick={() => { setPassVisible(!passVisible) }} id="togglePassword" className="text-gray-500 cursor-pointer focus:outline-none focus:text-gray-600 hover:text-gray-600">
                                        {passVisible ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>

                            </div>


                        </div>
                        <div className="mt-4">
                            <label className="block font-medium text-sm text-gray-700" htmlFor="password" value="Password" />
                            <div className="relative">
                                <input id="cpassword" type={passVisible ? 'text' : 'password'} name="cpassword" placeholder="Confirm Password" required autoComplete="current-password" className='w-full rounded-md py-2.5 px-4 border-2 border-slate-200  text-sm outline-[#f84525]' />

                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    <button type="button" onClick={() => { setPassVisible(!passVisible) }} id="togglePassword" className="text-gray-500 cursor-pointer focus:outline-none focus:text-gray-600 hover:text-gray-600">
                                        {passVisible ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                            </div>
                        </div>

               
                        <div className="flex w-full h-2 bg-slate-200 rounded-full mt-4">
                            <div className="h-full bg-green-600 rounded-full" style={{ width: `${passStrength}%` }}></div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            <p>For a safe Password consider having :</p>
                            <ul className="list-none list-inside">
                                <li className='flex items-center gap-2'>{formdata.password.length >= 8 ? <FaCheck className='text-green-600' /> : <FaTimes className='text-red-600' />}At least 8 characters</li>
                                <li className='flex items-center gap-2'>{/[A-Z]/.test(formdata.password) ? <FaCheck className='text-green-600' /> : <FaTimes className='text-red-600' />}One uppercase letter</li>
                                <li className='flex items-center gap-2'>{/[0-9]/.test(formdata.password) ? <FaCheck className='text-green-600' /> : <FaTimes className='text-red-600' />}One number</li>
                                <li className='flex items-center gap-2'>{/[^A-Za-z0-9]/.test(formdata.password) ? <FaCheck className='text-green-600' /> : <FaTimes className='text-red-600' />}One special character</li>
                            </ul>
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <Link to={'/'} className="hover:underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                                Already have an Account ?
                            </Link>

                            <button className='ms-4 cursor-pointer inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150'>
                                Sign up
                            </button>

                        </div>

                    </form>
                </div>
            </div >
        </div >

    )
}

export default Signup