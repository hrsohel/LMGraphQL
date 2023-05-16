import React from 'react';
import Link from 'next/link';

const AdminNav = ({myRef}) => {
    return (
        <div ref={myRef} className='sideBar z-10 w-full md:w-[20%] relative h-auto md:min-h-[100vh] md:sticky md:top-0 bg-[#304673] p-4 hidden lg:block'>
            <ul className='text-white mt-12 lg:mt-0'>
                <li className='bg-blue-800 rounded-sm px-3 py-2 my-2'><Link href={`/admin/admin`}>Users</Link></li>
                <li className='bg-blue-800 rounded-sm px-3 py-2 my-2'><Link href={`/admin/books`}>Books</Link></li>
                <li className='bg-blue-800 rounded-sm px-3 py-2 my-2'><Link href={`/admin/issue-requests`}>Issue requests</Link></li>
                <li className='bg-blue-800 rounded-sm px-3 py-2 my-2'><Link href={`/admin/return-books`}>Return books</Link></li>
            </ul>
        </div>
    );
};

export default AdminNav;