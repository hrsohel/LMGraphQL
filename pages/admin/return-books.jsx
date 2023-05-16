import React, {useRef, useState} from 'react';
import AdminNav from '../../components/AdminNav';
import Footer from '../../components/Footer';
import HeadTag from '../../components/HeadTag';
import Navbar from '../../components/Navbar';
import {useQuery, gql, useMutation} from '@apollo/client'
import Loading from '../../components/Loading';

const returnBook = () => {
    const {data, loading, fetchMore} = useQuery(gql`
        query GetUser {
            users {
                email
                firstName
                lastName
                issuedBooks
            }
        }
    `)
    const [mutate, res] = useMutation(gql`
        mutation ReturnBooks($book: String, $user: String) {
            returnBook(book: $book, user: $user) {
                acknowledged
                modifiedCount
            }
        }
    `)
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
    const returnBook = async (user, book) => {
        try {
            const {data} = await mutate({variables: {book, user}})
            fetchMore({})
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <HeadTag title="Admin panel" />
            <Navbar />
            <main className='min-h-[89vh] flex items-start justify-center relative'>
                <AdminNav myRef={myRef} />
                <div className='w-full lg:mt-0 mt-16'>
                    <div onClick={showSide} className='absolute z-20 px-2 py-1 border-2 cursor-pointer top-4 left-4 block lg:hidden'>
                        <i ref={myRef2} className={`fa fa-arrow-right ${toggle ? "text-white" : "text-black"}`} aria-hidden="true"></i>
                    </div>
                    <div className='overflow-x-auto p-1'>
                        {
                                loading ? <Loading /> : <table className='w-[150vw] md:w-[120vw] lg:w-full text-center '>
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
                                            return user.issuedBooks.map((book, index) => {
                                                return <tr key={index}>
                                                    <td className='border p-1'>{book}</td>
                                                    <td className='border p-1'>{user.firstName} {user.lastName}</td>
                                                    <td className='border p-1'>
                                                        <button onClick={() => returnBook(user.email, book)} className='px-2 py-1 text-center rounded-sm bg-[#304673]'>Return book</button>
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
        </>
    );
};

export default returnBook;