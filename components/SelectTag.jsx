import React from 'react';
import {useQuery, gql, useMutation} from '@apollo/client'

const SelectTag = ({category, setCategory, setShow}) => {
    const [isSkip, setIsSkip] = React.useState(false)
    const [submit, res] = useMutation(gql`
        mutation GetBook($content: String) {
        getBookByCategory(content: $content) {
                author
                name
                _id
                image
            }
        }
    `)
    const {data, loading} = useQuery(gql `
        query GetCategory {
            getCategory {
                category
            }
        }
    `, {skip: isSkip})
    let categories = [...new Set(data?.getCategory?.map(category => category.category))]
    const getCategory = async e => {
        if(e.target.value === "categories") {
            setShow(false)
            return
        }
        const {data} = await submit({variables: {content: e.target.value}})
        setCategory(data.getBookByCategory)
        setShow(true)
    }
    return (
        <>
            <select onChange={getCategory} className='p-2 mt-4 text-sm md:text-lg w-full outline-none rounded-lg text-white bg-[#304673] border-none outline-offset-0'>
                <option value="categories">Categories</option>
                {
                    categories?.map((categoty, index) => {
                        return <option key={index} value={categoty}>{categoty}</option>
                    })
                }
            </select>
        </>
    );
};

export default SelectTag;