import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import AdminNav from '../../components/AdminNav';
import Footer from '../../components/Footer';
import HeadTag from '../../components/HeadTag';
import Navbar from '../../components/Navbar';
import {useQuery, gql} from '@apollo/client'
import {useRouter} from 'next/router'
import UserTable from '../../components/UserTable';

const admin = () => {
    const history = useRouter()
    const {data} = useQuery(gql `
        query User{
            getSingleUser{
                role
            }
        }
    `,)
    if(data?.getSingleUser?.role !== "admin") {
        if(typeof window !== "undefined") history.push("/")
    }
    const myRef = useRef(null)
    const myRef2 = useRef(null)
    const [toggle, setToggle] = useState(false)
    const showSide = () => {
        if(myRef.current.style.display === "block") {
            myRef.current.style.display = "none"
            myRef2.current.classList.add("fa-arrow-right")
            myRef2.current.classList.remove("fa-times")
            setToggle(false)
        }
        else {
            myRef.current.style.display = "block"
            myRef2.current.classList.add("fa-times")
            myRef2.current.classList.remove("fa-arrow-right")
            setToggle(true)
        }
    }
    return (
        <>
            <HeadTag title="Admin panel" />
            <Navbar />
            <main className='flex items-start justify-center min-h-[89vh] relative'>
                <AdminNav myRef = {myRef} />
                <div className='w-full'>
                    <div onClick={showSide} className='absolute px-2 py-1 border-2 cursor-pointer top-4 left-4 block lg:hidden'>
                        <i ref={myRef2} className={`fa fa-arrow-right ${toggle ? "text-white" : "text-black"}`} aria-hidden="true"></i>
                    </div>
                    <div className='overflow-x-auto px-2'>
                        <UserTable />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default admin;