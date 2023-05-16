import React from 'react';
import {useQuery, gql} from '@apollo/client'

const search = () => {
    const {data, loading, fetchMore} = useQuery(gql `
        query SearchData($content: String) {
            search(content: $content) {
                name
                author
            }
        }
    `, {skip: true})
    const submit = async e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const {search} = Object.fromEntries(formData.entries())
        const {data} = await fetchMore({variables: {content: search}, skip:false})
        console.log(data)
    }
    return (
        <div>
            <form onSubmit={submit} action="" className='block mx-auto mt-4'>
                <label className='block' htmlFor="">Search</label>
                <input className='p-1 mr-2' type="search" name="search" id="" />
                <input type="submit" value="Search" />
            </form>
        </div>
    );
};

export default search;