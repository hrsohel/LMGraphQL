import React from 'react';
import Loading from '../components/Loading';
import {useQuery, gql} from '@apollo/client'
import { hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';


const logout = ({token}) => {
    const history = useRouter()
    if(!token) {
        if(typeof window !== "undefined") history.push("/")
    }
    const {data, error} = useQuery(gql `
        query Logout {
            logout {
                message
            }
        }
    `)
    if(error) return <h1>{error}</h1>
    if(data) window.location.href = "/login"
    return (
        <div>
            <Loading />
        </div>
    );
};

export default logout;

export async function getServerSideProps({req, res}) {
    const token = hasCookie("token", {req, res})
    return {props: {token}}
}