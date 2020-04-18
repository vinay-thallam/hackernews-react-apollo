import React from 'react'
import { Query } from 'react-apollo'
import Link from './Link'
import gql from 'graphql-tag'

const FEED_QUERY = gql`
{
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
            id
            name
        }
        votes {
            id
            user {
                id
            }
        }
      }
    }
  }
`

const LinkList = () => {

    return (
        <Query query={FEED_QUERY}>
            {({loading, error, data}) => {
                if(loading) return <div>Fetching...</div>
                if(error) return <div>Error</div>

                const linksToRender = data.feed.links
                return linksToRender.map((link, index) => (<Link key={link.id} link={link} index={index}/>))
            }}
        </Query>
    )
}

export default LinkList