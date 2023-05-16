import React, {useRef, useState} from 'react';
import HeadTag from "../components/HeadTag"
import Navbar from "../components/Navbar"
import Footer from '../components/Footer'
import Chat from '../components/Chat'
import Loading from '../components/Loading'
import SelectTag from '../components/SelectTag'
import {useQuery, gql, useMutation} from '@apollo/client'
import { hasCookie } from 'cookies-next';
import Error from '../components/Error'
import UpdateBook from '../components/UpdateBook'

const index = ({token}) => {
  const [book, setBook] = React.useState("")
  const [id, setId] = React.useState("")
  const [showForm, setShowForm] = React.useState(false)
  const [err, setErr] = useState({status: 0, message: ""})
  const {data, loading, fetchMore} = useQuery(gql`
    query SearchBooks ($content: String) {
      searchBooks(content: $content) {
        name
        author
        image
        _id
      }
    }
  `, {variables: {content: ""}})
  const ref = useRef(null)
  const mainRef = useRef(null)
  const buttonRef = useRef(null)
  const [category, setCategory] = React.useState("")
  const [show, setShow] = React.useState(false)
  const animateButton = () => {
    ref.current.classList.add("main-button")
    
    setTimeout(() => {
      ref.current.classList.remove("main-button")
    }, 1000)
  }
  const submitData = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const {inputBook} = Object.fromEntries(formData.entries())
    if(!inputBook) return
    try {
      const {data} = await fetchMore({variables: {content: inputBook}})
      setCategory(data?.searchBooks)
      setShow(true)
    } catch(err) {
      console.error(err)
    }
  }
  const issueBook = async (id, book) => {
    setBook(book)
    setId(id)
    setShowForm(true)
  }
  React.useEffect(() => {

  }, [])
  return (
    <>
      <HeadTag title="Home / Library management" />
      <Navbar />
      <main ref={mainRef} className='w-full home-main flex items-start justify-center px-4 relative' style={{minHeight: "89vh"}}>
       
        <div className='my-8 w-full'>
          {
              err.message ? <div className='w-full sm:w-[30rem] mx-auto'>
                <Error status={err.status} message = {err.message} />
            </div>: <></>
          }
          <img className='block mx-auto' src={`/images/Vector.svg`} alt="" width={`90px`} height={`90px`} />
          <form onSubmit={submitData} className='mt-4 w-full md:w-[70%] lg:w-[50%] mx-auto'>
            <div className='flex items-center justify-center home-input'>
              <input className='p-2 w-[70%] sm:w-[80%] bg-white text-sm md:text-lg border-none outline-none' type="search" placeholder='Seach by book name' name='inputBook' />
              {/* <label onClick={animateButton} ref={ref} className='cursor-pointer text-white font-semibold px-4 w-[30%] sm:w-[20%] py-2 text-center text-sm md:text-lg bg-[#304673]' htmlFor="">Search</label> */}
              <input type="submit" onClick={animateButton} ref={ref} className='cursor-pointer submit text-white font-semibold px-4 w-[30%] sm:w-[20%] py-2 text-center text-sm md:text-lg bg-[#304673]' value="Search" />
            </div>
            <SelectTag category={category} setCategory={setCategory} setShow={setShow} />
          </form>
          {
            show ? <div className='h-[50vh] w-full md:w-[70%] lg:w-[50%] mx-auto rounded-sm bg-white'>
            <div className='h-full overflow-y-auto'>
              {
                category && category?.map((value, index) => {
                  return <><div key={index} className='flex items-center justify-between flex-col sm:flex-row px-2 py-1 border-b-4'>
                    <img src={`/images/${value.image}`} alt="" className='object-cover w-[10rem]' />
                    <div className='my-1 text-[1rem] md:text-[1rem] font-semibold'>
                      <p className='text-[#304673]'>{value.name}</p>
                      <p className='text-red-500'>Writer(s): {value.author}</p>
                    </div>
                    <button ref={buttonRef} onClick={() => issueBook(value._id, value.name)} className='bg-[#304673] hover:bg-slate-300 click:bg-red-500 text-white px-2 py-1 text-[1rem] rounded-sm'>Issue book</button>
                  
                </div>
                </> 
                })
              }
            </div>
          </div> : <></>
          }
        </div>
        <Chat />
        {
          showForm ? <UpdateBook book={book} id={id} setShowForm={setShowForm} /> : <></>
        }
      </main>
      <Footer></Footer>
    </>
  );
};

export default index;

export async function getServerSideProps({req, res}) {
  const token = hasCookie("token", {req, res})
  return {props: {token}}
}