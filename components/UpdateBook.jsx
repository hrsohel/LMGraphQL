import React from 'react';
import {useMutation, gql, useQuery} from '@apollo/client'
import Error from '../components/Error'

const UpdateBook = ({book, setShowForm, id}) => {
    const [formData, setFormData] = React.useState({book, date: ""})
    const {data} = useQuery(gql `
        query HasToken {
            hasToken
        }
    `)
    const [submit, mutate] = useMutation(gql`
        mutation IssueBooks($id: ID, $book: String, $date: String) {
        issueBooks(id: $id, book: $book, date: $date) {
            acknowledged
            modifiedCount
        }
        }
    `)
    const changeCalue = e => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const submitData = async e => {
        e.preventDefault()
        const {data} = await submit({variables: {id, book, date: formData.date}})
        if(data?.issueBooks.modifiedCount === -1) alert("You already issued this books")
        else if(data?.issueBooks.modifiedCount === 1) alert("You successfully requested this book")
        setShowForm(false)
    }
    return (
        <>
            <div className='flex w-full h-full bg-slate-500 items-center justify-center px-4 py-2 rounded-md absolute top-0 left-0'>
                <div className='relative'>
                    {
                        data?.hasToken ? <form action="" className=' md:w-[30rem] w-full'>
                            <label className='block md:text-lg text-sm mt-2' htmlFor="book">Book name</label>
                            <input className='p-1 md:text-lg text-sm rounded-md border-none outline-none w-full' type="text" name="book" id="book" value={book} />
                            <label className='block md:text-lg text-sm mt-2' htmlFor="date">Return date</label>
                            <input onChange={changeCalue} className='p-1 md:text-lg text-sm rounded-md border-none outline-none w-full' type="datetime-local" name="date" id="date" placeholder='Set date and time' required={true} />
                            <button className='px-2 py-1 sm:text-lg text-sm mt-2 text-center rounded-sm bg-[#304673] text-white' onClick={(e) => {
                                e.preventDefault()
                                setShowForm(false)
                            }} type='button'>Cancel</button>
                            <button onClick={submitData} className='px-2 py-1 sm:text-lg text-sm mt-2 ml-3 hover:text-red-600 text-center rounded-sm bg-[#304673] text-white' type='button'>Submit</button>
                        </form> : <Error status={400} message="You must be logged in" />
                    }
                </div>
            </div>
        </>
    );
};

export default UpdateBook;