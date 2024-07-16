import React from 'react'
import Posts from '../posts/Posts'
import ProfileCard from '../profileCard/ProfileCard'
import Rightside from '../rightside/Rightside'
import SuggestedUsers from '../suggestedUsers/SuggestedUsers'
import classes from './home.module.css'

const Home = () => {
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <ProfileCard />
        <SuggestedUsers />
      </div>
      <Posts />
      <div className={classes.right}> <Rightside /></div>
      
    </div>
  )
}

export default Home