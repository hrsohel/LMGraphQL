import React from 'react';
import Footer from '../components/Footer';
import HeadTag from '../components/HeadTag';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import {useQuery, gql, useMutation} from '@apollo/client'
import { useRouter } from 'next/router';
import { hasCookie } from 'cookies-next';
import Error from '../components/Error';

const profile = ({token}) => {
    const [err, setErr] = React.useState("")
    const history = useRouter()
    if(typeof window !== "undefined") {
        if(!token) history.push("/login")
    }
    const [submit, {}] = useMutation(gql `
        mutation UploadFile($file: Upload) {
            uploadFile (file: $file)
        }
    `)
    const {data, loading} = useQuery(gql `
        query User{
            getSingleUser{
                firstName
                role
                email
                lastName
                issuedBooks
                requestBooks {
                    books
                    requestedDate
                }
            }
        }
    `,)
    const [show, setShow] = React.useState(false)
    const changePic = async (e) => {
        setShow(true)
        const formData = new FormData()
        formData.append("file", e.target.files[0])
        console.log(e.target.files[0])
        if(e.target.files[0].type.split("/")[0] !== "image") {
            setErr(`Only image file allowed. You provided ${e.target.files[0].type.split("/")[1]} file.`)
        }else {
            try {
                const {data} = await submit({variables: {file: e.target.files[0]}})
                console.log(data)
            } catch (error) {
                console.error(error.message);
            }
        }
        setShow(false)
    }
    return (
        <>
            <HeadTag title={`${data?.getSingleUser?.firstName} ${data?.getSingleUser?.lastName}'s profile`} />
            <Navbar />
            <main className='flex items-center justify-around flex-wrap md:flex-nowrap min-h-[89vh] relative'>
                <div className='w-[15rem] md:w-[20rem] h-[15rem] md:h-[20rem] relative rounded-full profile'>
                    <img src="/images/bg img.png" alt=""  className='object-cover w-full h-full rounded-full' />
                    {
                        show ? <h1 className='bg-slate-500 rounded-full absolute top-0 left-0 flex items-center justify-center h-full w-full'><span className='text-sm md:text-lg font-semibold'>Uploading...</span></h1> :<> <form encType='multipart/form-data' className='profile-form border-2 absolute top-0 left-0 w-full h-full rounded-full'>
                        <label className='text-white px-2 py-1 bg-slate-500 rounded-md cursor-pointer w-[60%] text-center mt-[45%] block mx-auto' htmlFor="image"><i className="fa-duotone fa-camera"></i></label>
                        {/* <i className="fa-duotone fa-camera"></i> */}
                        <input onChange={changePic} type="file" name="file" id="image" className='hidden' />
                    </form> 
                    </>
                    }
                    
                </div>
                <div className='absolute top-4 left-[50%] -translate-x-[50%] mx-auto w-full sm:w-[30rem]'>
                    {
                        err ? <Error status={400} message={err} /> : <></>
                    }
                </div>
                {
                    loading ? <Loading /> : <div className='mt-16 md:mt-0 mx-auto'>
                    <p className='text-sm md:text-md'>First name</p>
                    <p className='text-md md:text-lg capitalize font-semibold'>{data?.getSingleUser?.firstName}</p><br />
                    <p className='text-sm md:text-md'>Last name</p>
                    <p className='text-md md:text-lg capitalize font-semibold'>{data?.getSingleUser?.lastName}</p><br />
                    <p className='text-sm md:text-md'>Email</p>
                    <p className='text-md md:text-lg font-semibold'>{data?.getSingleUser?.email}</p><br />
                    <p className='text-sm md:text-md'>Requested books: </p>
                    <p className='text-md md:text-lg capitalize font-semibold'>
                        {
                            data?.getSingleUser?.requestBooks?.length ? <table className='w-full text-center'>
                            <thead>
                                <tr><th className="p-1 border">Book name</th></tr>
                            </thead>
                            <tbody>
                                {data?.getSingleUser?.requestBooks.map((value, index) => {
                                    return <tr key={index}>
                                        <td className="p-1 border">{value.books}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table> : "N/A"
                        }
                    </p><br />
                    <p className='text-sm md:text-md'>Issued books: </p>
                    <p>
                        {
                            data?.getSingleUser?.issuedBooks?.length ? <table className='w-full text-center'>
                            <thead>
                                <tr><th className="p-1 border">Book name</th></tr>
                            </thead>
                            <tbody>
                                {data?.getSingleUser?.issuedBooks.map((book, index) => {
                                    return <tr key={index}>
                                        <td className="p-1 border">{book}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table> : "N/A"
                        }
                    </p>
                    <p className='text-sm md:text-md'>Role</p>
                    <p className='text-md md:text-lg capitalize font-semibold'>{data?.getSingleUser?.role}</p><br />
                </div>
                }
            </main>
            <Footer />
        </>
    );
};

export default profile;

export async function getServerSideProps({req, res}) {
    const token = hasCookie("token", {req, res})
    return {props: {token}}
}