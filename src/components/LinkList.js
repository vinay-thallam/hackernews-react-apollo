import React from 'react'
import { Query } from 'react-apollo'
import Link from './Link'
import gql from 'graphql-tag'

export const FEED_QUERY = gql`
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

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
      newLink {
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
`

const LinkList = () => {

    return (
        <Query query={FEED_QUERY}>
            {({loading, error, data, subscribeToMore}) => {
                if(loading) return <div>Fetching...</div>
                if(error) return <div>Error</div>

                _subscribeToNewLinks(subscribeToMore)

                const linksToRender = data.feed.links
                return linksToRender.map((link, index) => (<Link key={link.id} link={link} index={index} updateStoreAfterVote={_updateCacheAfterVote}/>))
            }}
        </Query>
    )
}

const _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({query: FEED_QUERY})

    const votedLink = data.feed.links.find(link => linkId.id === linkId)
    votedLink.votes = createVote.link.votes

    store.writeQuery({query: FEED_QUERY, data})

}

const _subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (prev, {subscriptionData}) => {
            if(!subscriptionData.data) return prev
            const newLink = subscriptionData.data.newLink
            const exists = prev.feed.links.find(({ id }) => id === newLink.id);
            if (exists) return prev;

            return Object.assign({}, prev, {
                feed: {
                  links: [newLink, ...prev.feed.links],
                  count: prev.feed.links.length + 1,
                  __typename: prev.feed.__typename
                }
              })
        }
    })
}

export default LinkList