import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import {useQuery, gql} from '@apollo/client'
 
const Navbar = () => {
    const {data, loading, error, refetch} = useQuery(gql `
        query User{
            getSingleUser{
                firstName
                role
            }
        }
    `,)
    const ref = useRef(null)
    const ref2 = useRef(null)
    const showMenu = () => {
        ref.current.classList.add("showMenu")
        if(ref2.current.style.display === "block") ref2.current.style.display = "none"
        else ref2.current.style.display = "block"
        setTimeout(() => {
            ref.current.classList.remove("showMenu")
        }, 500)
    }
    return (
        <header className='flex items-center justify-between px-4 py-2 bg-[#304673]'>
            <div className="logo">
                <Link href="/"><img src="/images/Vector.svg" alt="Logo" width={`50px`} height="50px" /></Link>
            </div>
            <nav ref={ref2}>
                <ul className='flex items-center justify-center'>
                    {
                        data?.getSingleUser?.role === "admin" ? <>
                        <li className='mx-2 font-semibold text-lg text-white'><Link onClick={() => refetch()} href={`/admin/admin`}>Admin panel</Link></li>
                        </> : <></>
                    }
                    {
                        data?.getSingleUser ? <>
                        <li className='mx-2 font-semibold capitalize text-lg text-white'><Link onClick={() => refetch()} href={`/profile`}>{data?.getSingleUser?.firstName}</Link></li>
                        <li className='mx-2 font-semibold text-lg text-white'><Link onClick={() => refetch()} href={`/logout`}>Logout</Link></li>
                        </> : <>
                        <li className='mx-2 font-semibold text-lg text-white'><Link onClick={() => refetch()} href={`/login`}>Login</Link></li>
                        <li className='mx-2 font-semibold text-lg text-white'><Link onClick={() => refetch()} href={`/signup`}>Sign up</Link></li>
                        </>
                    }
                </ul>
            </nav>
            <div onClick={showMenu} ref={ref} className='py-1 px-2 block md:hidden border rounded-md cursor-pointer'>
                <i class="fa fa-bars text-white font-semibold text-xl" aria-hidden="true"></i>
            </div>
        </header>
    );
};

export default Navbar;