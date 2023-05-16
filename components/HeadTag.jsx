import React from 'react';
import Head from "next/head"

const HeadTag = ({title}) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="This is my page description." />
                <link rel="icon" href="\images\Vector.svg" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            </Head>
        </>
    );
};

export default HeadTag;