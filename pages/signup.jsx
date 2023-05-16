import React from 'react';
import Error from '../components/Error';
import Footer from '../components/Footer';
import HeadTag from '../components/HeadTag';
import Navbar from '../components/Navbar';
import {AES} from 'crypto-js'
import {useMutation, gql} from '@apollo/client'
import {useRouter} from 'next/router'
import Loading from '../components/Loading';
import { hasCookie } from 'cookies-next';

const signup = ({token}) => {
    const history = useRouter()
    if(token) {
        if(typeof window !== "undefined") history.push("/")
    }
    const [err, setErr] = React.useState("")
    const [submit, {data, loading}] = useMutation(gql `
        mutation AddUser($content: String) {
            addUser(content: $content) {
                __typename
                ...on ErrorMessage {
                    message
                }
                ...on User {
                    email
                }
            }
        }
    `,)
    const getValues = async e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const {firstName, lastName, email, password, cpassword} = Object.fromEntries(formData.entries())
        if(password !== cpassword) setErr("Confirm password does not match")
        else {
            const encrypt = AES.encrypt(JSON.stringify({firstName, lastName, email, password}), "HARUN@2705@1997ATYADNOM").toString()
            
            submitData(encrypt)
        }
    }
    const submitData = async (encrypt) => {
        try {
            const {data} = await submit({variables: {content: encrypt}})
            if(data.addUser.__typename === "ErrorMessage") setErr(data.addUser.message)
            else {
                setErr("")
                history.push("/login")
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <HeadTag title="Sign up" />
            <Navbar />
            {
                loading ? <Loading /> : <main className='min-h-[89vh] flex items-center justify-center px-4'>
                <form onSubmit={getValues} action="" className='w-full sm:w-[30rem]'>
                    {
                        err ? <Error status={400} message={err} /> : <></>
                    }
                    <label className='block text-sm md:text-lg font-semibold' htmlFor="fname">First Name</label>
                    <input className='w-full my-1 bg-slate-100 p-1 text-sm md:text-lg rounded-sm border-none outline-none' type="text" placeholder='First name' id='fname' name='firstName' required={true} />
                    <label className='block text-sm md:text-lg font-semibold' htmlFor="lname">Last Name</label>
                    <input className='w-full my-1 bg-slate-100 p-1 text-sm md:text-lg rounded-sm border-none outline-none' type="text" placeholder='Last name' id='lname' name='lastName' required={true}  />
                    <label className='block text-sm md:text-lg font-semibold' htmlFor="email">Email</label>
                    <input className='w-full my-1 bg-slate-100 p-1 text-sm md:text-lg rounded-sm border-none outline-none' type="email" placeholder='Email' id='email' name='email' required={true} />
                    <label className='block text-sm md:text-lg font-semibold' htmlFor="password">Password</label>
                    <input className='w-full my-1 bg-slate-100 p-1 text-sm md:text-lg rounded-sm border-none outline-none' type="password" placeholder='Password' id='password' name='password' required={true} />
                    <label className='block text-sm md:text-lg font-semibold' htmlFor="cpassword">Confirm Password</label>
                    <input className='w-full my-1 bg-slate-100 p-1 text-sm md:text-lg rounded-sm border-none outline-none' type="password" placeholder='Confirm password' id='cpassword' name='cpassword' required={true} />
                    <input className='w-full bg-[#304673] py-2 cursor-pointer text-center text-sm md:text-lg text-white font-semibold' type="submit" value="Login" />
                </form>
            </main>
            }
            <Footer />
        </>
    );
};

export default signup;

export async function getServerSideProps({req, res}) {
    const token = hasCookie("token", {req, res})
    return {props: {token}}
}