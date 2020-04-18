import React from 'react'

const Link = ({link}) => {
    return (
        <div>
            {link.description} ({link.url})
        </div>
    )
}

export default Link