import React from 'react';
import HeadTag from '../components/HeadTag'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import {gql, useMutation} from '@apollo/client'
import { useState } from 'react';
import Error from '../components/Error'
import {AES} from 'crypto-js';
import {hasCookie} from 'cookies-next'
import {useRouter} from 'next/router'

const login = ({token}) => {
    const history = useRouter()
    if(typeof window !== "undefined") {
        if(token) history.push("/")
    }
    const [err, setErr] = useState("")
    const [submit, {data, loading, error}] = useMutation(gql`
        mutation Login($content: String) {
            loginUser(content: $content) {
                __typename
                ...on ErrorMessage {
                    message
                }
                ...on User {
                    firstName
                }
            }
        }
    `,)
    const getValues = async e => {
        e.preventDefault()
        const data = new FormData(e.target)
        const {email, password} = Object.fromEntries(data.entries())
        const encrypt = AES.encrypt(JSON.stringify({email, password}), "HARUN@2705@1997ATYADNOM").toString()
        
        try {
            const {data} = await submit({variables: {content: encrypt}})
            if(data.loginUser.__typename === "ErrorMessage") {
                setErr(data.loginUser.message)
            } else {
                setErr("")
                window.location.href = "/"
            }
        } catch (error) {
             console.error(error)
        }
    }
    return (
        <>
            <HeadTag title = "Login" />
            <Navbar />
            {
                loading ? <Loading /> : <main className='min-h-[89vh] flex items-center justify-center px-4'>
                
                <form onSubmit={getValues} className='w-full sm:w-[30rem]'>
                    {
                        err ? <Error status={400} message={err} /> : <></>
                    }
                    <label className='block text-sm sm:text-lg font-semibold' htmlFor="email">Email</label>
                    <input className='w-full my-1 bg-slate-100 p-1 text-sm sm:text-lg rounded-sm border-none outline-none' type="email" placeholder='Email' id='email' name='email' required={true} />
                    <label className='block text-sm sm:text-lg font-semibold' htmlFor="password">Password</label>
                    <input className='w-full my-1 bg-slate-100 p-1 text-sm sm:text-lg rounded-sm border-none outline-none' type="password" placeholder='Password' id='password' name="password" required={true} />
                    {/* <input onClick={submitData} className='w-full bg-[#304673] py-2 cursor-pointer text-center text-sm sm:text-lg text-white font-semibold' type="submit" value="Login" /> */}
                    <input  className='w-full bg-[#304673] py-2 cursor-pointer text-center text-sm sm:text-lg text-white font-semibold' type="submit" value="Login" />
                </form>
            </main>
            }
            <Footer />
        </>
    );
};

export default React.memo(login);

export async function getServerSideProps({req, res}) {
    const token = hasCookie("token", {req, res})
    return {props: {token}}
}