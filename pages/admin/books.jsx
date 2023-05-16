import React, {useRef, useState} from 'react';
import AdminNav from '../../components/AdminNav';
import Footer from '../../components/Footer';
import HeadTag from '../../components/HeadTag';
import Navbar from '../../components/Navbar';
import {useQuery, gql} from '@apollo/client'
import Loading from '../../components/Loading'

const books = () => {
    const limit = 40
    let [skip, setSkip] = React.useState(0)
    let [books, setBooks] = React.useState([])
    const {data, loading, error, fetchMore} = useQuery(gql `
        query GetBooks ($limit: Int, $skip: Int) {
            getBooks(limit: $limit, skip: $skip) {
                id
                name
                author
                quantity
            }
        }
    `, {variables: {limit, skip}})
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
    const scrollHandler = () => {
        if(Math.floor(tableRef.current.scrollTop / tableRef.current.clientHeight) >= skip)
            setSkip(prev => prev + 1)
    }
    React.useEffect(() => {
        const fetchData = async () => {
            const res = await fetchMore({
                variables: { limit, skip },
            });
            setBooks([...books, ...res?.data?.getBooks]);
        };
        fetchData()
        tableRef?.current?.addEventListener("scroll", scrollHandler)
        return () => tableRef?.current?.removeEventListener("scroll", scrollHandler)
    }, [skip])
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
                    <div ref={tableRef} className='w-full overflow-x-auto h-[89vh] px-2'>
                        <table className='sm:w-full w-[130vw] text-center'>
                            <thead className='sticky top-0  bg-black text-white'>
                                <tr>
                                    <th>Book Id</th>
                                    <th>Book name</th>
                                    <th>Author</th>
                                    <th>Availability</th>
                                </tr>
                            </thead>
                            <tbody className='overflow-y-scroll'>
                                {
                                    books && books.map((book, index) => {
                                        return <tr key={index} className='hover:bg-slate-500 text-white'>
                                            <td className='border-2 py-1 border-black'>{book?.id}</td>
                                            <td className='border-2 py-1 border-black'>{book?.name}</td>
                                            <td className='border-2 py-1 border-black'>{book?.author}</td>
                                            <td className='border-2 py-1 border-black'>{book?.quantity}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default books;