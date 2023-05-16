import React, {useRef, useState} from 'react';
import AdminNav from '../../components/AdminNav';
import Footer from '../../components/Footer';
import HeadTag from '../../components/HeadTag';
import Navbar from '../../components/Navbar';
import {useQuery, gql, useMutation} from '@apollo/client'
import Loading from '../../components/Loading'
import {hasCookie} from 'cookies-next'
import {useRouter} from 'next/router'
import moment from 'moment'

const issueBooks = ({token}) => {
    const router = useRouter()
    if(typeof window !== "undefined") {
        if(!token) router.push("/login")
    }
    const {data, loading, fetchMore} = useQuery(gql`
        query GetUser {
            users {
                email
                firstName
                lastName
                requestBooks {
                    books
                    requestedDate
                }
            }
        }
    `)
    const [mutate, res] = useMutation(gql `
        mutation AcceptRequest($book: String, $user: String, $date: String) {
            acceptRequest(book: $book, user: $user, date: $date) {
                acknowledged
                modifiedCount
            }
        }
    `)
    const myRef = useRef(null)
    const myRef2 = useRef(null)
    const tableRef = useRef(null)
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
    console.log(data)
    const acceptRequest = async (book, user, date) => {
        console.log(date)
        // const {data} = await mutate({variables: {book, user, date}})
        // await fetchMore({})
    }
    // React.useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollTop = window.scrollY || window.pageYOffset;
    //         console.log(scrollTop, tableRef.current.clientHeight);
    //     };

    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, [])
    return (
        <div>
            <HeadTag title="Admin panel" />
            <Navbar />
            <main className='min-h-[89vh] flex items-start justify-center relative'>
                <AdminNav myRef={myRef} />
                <div className='w-full lg:mt-0 mt-16'>
                    <div onClick={showSide} className='absolute px-2 z-20 py-1 border-2 cursor-pointer top-4 left-4 block lg:hidden'>
                        <i ref={myRef2} className={`fa fa-arrow-right ${toggle ? "text-white" : "text-black"}`} aria-hidden="true"></i>
                    </div>
                    <div ref={tableRef} className='overflow-x-auto p-1 h-full'>
                        {
                            loading ? <Loading /> : <table className='w-[120vw] md:w-[120vw] lg:w-full text-center '>
                            <thead>
                                <tr>
                                    {/* <th>Book id</th> */}
                                    <th className='p-1 border'>Book name</th>
                                    <th className='p-1 border'>User</th>
                                    <th className='p-1 border'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.users?.map((user) => {
                                        return user.requestBooks.map((value, index) => {
                                            return <tr key={index}>
                                                <td className='border p-1'>{value.books}</td>
                                                {/* <td className='border p-1'>{new Date(value.requestedDate)}</td> */}
                                                <td className='border p-1'>{user.firstName} {user.lastName}</td>
                                                <td className='border p-1'>
                                                    <button onClick={() => acceptRequest(value.books, user.email, new Date(Date(value.requestedDate)))} className='px-2 py-1 text-center rounded-sm bg-[#304673]'>Accept request</button>
                                                    {/* <button className='px-2 py-1 text-center rounded-sm bg-[#304673]'>Loading</button> */}
                                                </td>
                                            </tr>
                                        })
                                    })
                                }
                            </tbody>
                        </table>
                        }
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default issueBooks;

export async function getServerSideProps({req, res}) {
    const token = hasCookie("token", {req, res})
    return {props: {token}}
}