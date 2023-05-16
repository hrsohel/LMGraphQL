import React from 'react';
import {useQuery, gql} from '@apollo/client'
import Loading from './Loading'

const UserTable = () => {
    const {data, loading, error} = useQuery(gql `
        query getUser {
            users {
                _id
                firstName
                lastName
                email
                role
            }
        }
    `)
    return (
        <>
        {
            loading ? <div className='h-[89vh]'>
                <Loading />
            </div> : <table className='w-[110vh] md:w-[120vh] lg:w-full text-center'>
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        {/* <th>Issued books</th> */}
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {
                        data?.users?.map(user => {
                            return <tr key={user._id} className="hover:bg-slate-500">
                                <td className='py-1 border capitalize'>{user.firstName}</td>
                                <td className='py-1 border capitalize'>{user.lastName}</td>
                                <td className='py-1 border'>{user.email}</td>
                                <td className='py-1 border capitalize'>{user.role}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        }
        </>
    );
};

export default UserTable;