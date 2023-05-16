import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {gql, useQuery} from '@apollo/client'
import { useRef } from 'react';

const demo = () => {
    const ref = useRef(null)
    const limit = 5
    const [skip, setSkip] = useState(0)
    const [value, setValue] = useState([])
    const {data, fetchMore} = useQuery(gql `
        query POST($limit: Int, $skip: Int) {
            post(limit: $limit, skip: $skip) {
                body
                id
                userId
                title
            }
        }
    `, {variables: {limit, skip}})
    const scrollHandler = () => {
        if(Math.floor(ref.current.scrollTop / ref.current.clientHeight) >= skip)
            setSkip(prev => prev + 1)
    }   	
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchMore({variables: {limit, skip}})
            setValue([...value, ...res?.data?.post])
        }
        fetchData()
        ref.current.addEventListener("scroll", scrollHandler)
        return () => ref?.current?.removeEventListener("scroll", scrollHandler)
    }, [skip])
    return (
        <>
            <div ref={ref} className="h-[30rem] overflow-y-scroll" >
            {
                value.length ? value?.map((x, index) => {
                    return <div key={index}>
                        <p>{x.userId}</p>
                        <p>{x.id}</p>
                        <p>{x.title}</p>
                        <p>{x.body}</p>
                    </div>
                }) : <></>
            }
            </div>
        </>
    );
};

export default demo;