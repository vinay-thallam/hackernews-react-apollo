import React from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'

const authToken = localStorage.getItem(AUTH_TOKEN)

const Link = ({link:{description, votes, postedBy, url, createdAt}, index}) => {
    return (
        <div className="flex mt2 items-start">
          <div className="flex items-center">
            <span className="gray">{index + 1}.</span>
            {authToken && (
              <div className="ml1 gray f11" onClick={() => this._voteForLink()}>
                ▲
              </div>
            )}
          </div>
          <div className="ml1">
            <div>
              {description} ({url})
            </div>
            <div className="f6 lh-copy gray">
              {votes.length} votes | by{' '}
              {postedBy
                ? postedBy.name
                : 'Unknown'}{' '}
              {timeDifferenceForDate(createdAt)}
            </div>
          </div>
        </div>
      )
}

export default Link