import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <footer className='flex items-center justify-between flex-wrap p-4 bg-[#304673]'>
            <img className='block md:inline mx-auto md:mx-0 my-1' src="/images/Vector.svg" alt="" width={`100px`} height={100} />
            <div className='my-1 mx-2 text-center'>
                <Link href={`/`}><span className='text-red-500 hover:underline'>Terms and conditions</span> </Link>
                <Link href={`/`}><span className='text-red-500 hover:underline'>| Privacy policy</span></Link>
            </div>
            <div className='my-1 text-center'>
                <p className='text-white'>Powered by</p>
                <h1 className='text-red-500 font-bold'>ICE Association</h1>
            </div>
        </footer>
    );
};

export default Footer;