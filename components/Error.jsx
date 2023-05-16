import React from 'react';

const Error = ({status, message}) => {
    return (
        status == 200 ? <div className='bg-green-300 px-2 sticky top-0 text-green-600 text-sm md:text-lg rounded-md py-1 text-center w-full'>
            <i>{message}</i>
        </div> : <div className='bg-red-300 px-2 sticky top-0 text-red-600 text-sm md:text-lg rounded-md py-1 text-center w-full'>
            <i>{message}</i>
        </div>
    );
};

export default Error;