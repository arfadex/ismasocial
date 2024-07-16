import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { handleFollow } from '../../redux/authSlice';
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter';
import classes from './suggestedUsers.module.css';
import man from '../../assets/man.jpg'; // Adjust the import path based on your project structure

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/user/find/suggestedUsers`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setSuggestedUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSuggestedUsers();
  }, [token]);

  const toggleFollow = async (id) => {
    try {
      await fetch(`http://localhost:5000/user/toggleFollow/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: "PUT"
      });
      setSuggestedUsers((prev) => {
        return [...prev].filter((user) => user._id !== id);
      });
      dispatch(handleFollow(id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.myProfile}>
          <img src={user?.profileImg ? `http://localhost:5000/images/${user.profileImg}` : man} className={classes.profileUserImg} alt="Profile" />
          <div className={classes.profileData}>
            <span>{capitalizeFirstLetter(user.username)}</span>
            <span className={classes.shortBio}>{user?.bio ? user.bio : ""}</span>
          </div>
        </div>
        {suggestedUsers?.length > 0 ? (
          <div className={classes.suggestedUsers}>
            <h3 className={classes.title}>Recommended users to follow</h3>
            {suggestedUsers?.slice(0, 3).map((suggestedUser) => (
              <div className={classes.suggestedUser} key={suggestedUser._id}>
                <Link to={`/profileDetail/${suggestedUser._id}`}>
                  <img src={suggestedUser?.profileImg ? `http://localhost:5000/images/${suggestedUser.profileImg}` : man} className={classes.imgUser} alt="Suggested User" />
                </Link>
                <div className={classes.suggestedUserData}>
                  <span>{capitalizeFirstLetter(suggestedUser.username)}</span>
                  <span className={classes.suggestedMsg}>Suggested to you</span>
                </div>
                <button onClick={() => toggleFollow(suggestedUser._id)} className={classes.followBtn}>Follow</button>
              </div>
            ))}
          </div>
        ) : <h3 className={classes.title}>You have no suggested users</h3>}
      </div>
    </div>
  );
};

export default SuggestedUsers;
