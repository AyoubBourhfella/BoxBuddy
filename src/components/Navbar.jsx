
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TbMapSearch } from "react-icons/tb";
import { LuPackagePlus } from "react-icons/lu";
import { LuPackageSearch } from "react-icons/lu"
import { MdOutlineNotificationsActive } from "react-icons/md";
import useordersService from '../services/OrdersService';
import useUserService from '../services/UserService';
import { RiLogoutBoxRLine } from "react-icons/ri"

const Navbar = () => {
  const navigate = useNavigate()

  const {getAllByOwner} = useordersService()
  const {logout} = useUserService()
  const notif = getAllByOwner()
  const handleAdd = () => {
    document.getElementById('my_modal_1').showModal()
  }
  const handleupdate = () => {

    document.getElementById('updatemodel').showModal()
  }
  const handlenotif = () => {

    document.getElementById('shownotif').showModal()
  }

  const lgout = () => {
    logout()
    window.location.reload()
  }
  const items = [
    {
      callback: () => { navigate('/') },
      icon: <TbMapSearch />
    },
    {
      callback: handleAdd,
      icon: <LuPackagePlus />
    },
    {
      callback: handleupdate,
      icon: <LuPackageSearch />
    },
    {
      callback: handlenotif,
      icon: <span className='relative'>
        <MdOutlineNotificationsActive />
        <span className='absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full text-white text-[10px] flex items-center justify-center'>{notif.filter((e) => e.done == false ).length}</span>
      </span>
    },
    {
      callback: lgout,
      icon: <RiLogoutBoxRLine />
    }
  ];
  return (
    <nav className="  bg-amber-50/20 w-screen h-screen absolute top-0 left-0 " >

      <Link to="/" className="z-50 absolute top-5 left-5 ">
        <div className='flex  items-center justify-center gap-4'>
          <div className="h-16 w-16 relative">
            <img src="/logo.png" className='h-full  w-full absolute object-contain' alt="" />
          </div>
          <h2 className="font-bold text-3xl">Box <span className="bg-[#f84525] text-white px-2 rounded-md">Buddy</span></h2>
        </div>
      </Link>

      <div
        className="flex absolute  bottom-5 left-5  flex-col justify-center items-center z-50 transition-all duration-[450ms] ease-in-out w-16"
      >
        <article
          className=" border-[2px] border-[#f84525] w-full ease-in-out duration-500 left-0 rounded-2xl inline-block shadow-lg shadow-[#f84525]/15 bg-white"
        >
          {
            items.map((item, index) => {
              return (
                <button key={index} onClick={item.callback} className="flex items-center cursor-pointer text-2xl justify-center w-full h-16 text-black hover:text-[#f84525] hover:scale-105 duration-500 ease-in-out">
                  {item.icon}
                </button>
              )
            })
          }
        </article>
      </div>




    </nav>
  );
};

export default Navbar;