import React, { useEffect, useState } from 'react';

const Chat = () => {
    const [show, setShow] = useState(false)
    return (
        show ? <div className='fixed bottom-[1rem] right-4'>
            <div className='w-full sm:w-[18rem] h-[30rem]'>
                <div className='px-2 py-3 flex items-center justify-between rounded-t-lg bg-[#1d2a44] h-[10%] text-white'>
                    <div>
                        <i className="fa-solid fa-user"></i>
                        <span className='ml-2'>Admin</span>
                    </div>
                    <i onClick={() => setShow(false)} className="fa-solid fa-xmark cursor-pointer"></i>
                </div>
                <div className='h-[80%] bg-white p-2'>
                    <div className='bg-[#304673] text-white px-2 py-1 rounded-md float-left'>Hello</div>
                    <div className='bg-slate-300 text-black px-2 py-1 rounded-md float-right'>Hi...</div>
                </div>
                <div className='flex items-center justify-between h-[10%] px-2 py-3 bg-[#1d2a44] rounded-b-lg'>
                    <input type="text" className='w-[80%] rounded-lg border-none outline-none text-md p-1 bg-white' placeholder='Message...'/>
                    <button type='button' className='px-2 py-3 text-white'>Send</button>
                </div>
            </div>
        </div> : <div className='fixed cursor-pointer messenger bottom-[1rem] right-4 text-4xl text-white'>
            <i onClick={() => setShow(true)} class="fa-brands fa-facebook-messenger"></i>
        </div>
    );
};

export default Chat;