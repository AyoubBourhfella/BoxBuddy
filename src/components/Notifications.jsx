import React from 'react'
import useordersService from '../services/OrdersService'
import useUserService from '../services/UserService'
import toast from 'react-hot-toast'

function Notifications() {

    const { getAllByOwner, remove, accept } = useordersService()
    const { currentUser, getById } = useUserService()
    const notif = getAllByOwner(currentUser.id)


    const userinfo = (id) => {
        let user = getById(id)
        return user.name + " " + user.email
    }

    const acceptOferr = (id , productid) => {
        accept(id , productid)
        toast.success("Offer accepted")
    }
    const declineOferr = (id) => {
        remove(id);
        toast.success("Offer declined")
    }
    return (
        <>
            <dialog id="shownotif" className="modal">
                <div className="modal-box max-h-[80vh] overflow-y-auto">
                    <h3 className="font-bold text-lg">Notifications.</h3>
                    <div className='flex flex-col gap-2'>

                        {notif.length > 0 ? notif.map((notif) => {
                            return (
                                <div className="card w-full bg-base-100 shadow-xl">
                                    <div className='flex items-start gap-2 justify-start'>
                                        <img src={notif.image} className='aspect-square w-12' alt="" />
                                        <div>
                                            <h1 className='font-bold text-xl'>{notif.name}</h1>
                                            <p className='text-xs bg-slate-100 rounded-xl p-2'>Submited By : {userinfo(notif.submitted_by)}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-evenly items-center mt-3">
                                        <button onClick={() => { acceptOferr(notif.id_order , notif.id) }} className='text-green-500 cursor-pointer '> Accepte</button>
                                        <button onClick={() => { declineOferr(notif.id_order) }} className='text-red-500 cursor-pointer'>Decline</button>
                                    </div>

                                </div>
                            )
                        }) :
                            <p className='text-center my-5 text-xl italic'>No notifications yet.</p>
                        }
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default Notifications