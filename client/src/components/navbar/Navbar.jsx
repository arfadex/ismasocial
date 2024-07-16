import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose, AiOutlineFileImage, AiOutlineLogout, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { ImMenu } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUser } from '../../redux/authSlice';
import classes from './navbar.module.css';
import man from '../../assets/man.jpg';
import logo from '../../assets/logo.png';
import logo1 from '../../assets/logo1.png';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

const Navbar = () => {
  const [state, setState] = useState({
    username: '',
    email: '',
    bio: '',
    password: ''
  });
  const { token, user } = useSelector((state) => state.auth);
  const [searchText, setSearchText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/user/findAll`);
        const data = await res.json();
        setAllUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (searchText) {
      setFilteredUsers(allUsers.filter((user) => user.username.includes(searchText)));
    } else {
      setFilteredUsers(allUsers);
    }
  }, [searchText, allUsers]);

  useEffect(() => {
    if (showForm && user) {
      setState({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        password: ''
      });
      setPhoto(null);
    }
  }, [showForm, user]);

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleShowForm = () => {
    setShowForm(true);
    setShowModal(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    let filename = user.profileImg;
    if (photo) {
      const formData = new FormData();
      filename = crypto.randomUUID() + photo.name;
      formData.append('filename', filename);
      formData.append('image', photo);

      await fetch(`http://localhost:5000/upload/image`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: formData
      });
    }

    try {
      const res = await fetch(`http://localhost:5000/user/updateUser/${user._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: "PUT",
        body: JSON.stringify({ ...state, profileImg: filename })
      });

      const data = await res.json();
      setShowForm(false);
      dispatch(updateUser(data));
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <Link to='/' className='linklogo' >
          <img src={logo} alt="logo" className='logo' style={{ width: '200px',marginTop:'10px' }} /></Link>
        </div>
        <div className={classes.center}>
          <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" placeholder="Search user..." />
          <AiOutlineSearch className={classes.searchIcon} />
          {searchText && (
            <div onClick={() => setSearchText("")} className={classes.allUsersContainer}>
              {filteredUsers?.map((user) => {
                console.log('User:', user);
                const imageUrl = user.profileImg ? `http://localhost:5000/images/${user.profileImg}` : man;

                console.log(`User: ${user.username}, Image URL: ${imageUrl}`);
                return (
                  <Link to={`/profileDetail/${user._id}`} key={user._id}>
                    <img
                      src={imageUrl}
                      alt='profile'
                      onError={(e) => { e.target.onerror = null; e.target.src = man; }}
                    />
                    <div className={classes.userData}>
                      <span>{user?.username}</span>
                      <span>{user?.bio?.slice(0, 10)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className={classes.right}>
          <Link to='/upload' style={{ textDecoration: 'none', color: 'inherit' }}>Create</Link>
          <div className={classes.icons}>
            <Link to={`/profileDetail/${user._id}`} className={classes.iconLink}>
              <AiOutlineUser />
            </Link>
            <AiOutlineLogout onClick={handleLogout} />
          </div>
          <img
            src={user?.profileImg ? `http://localhost:5000/images/${user.profileImg}` : man}
            className={classes.profileUserImg}
            onClick={() => setShowModal((prev) => !prev)}
            onError={(e) => { e.target.onerror = null; e.target.src = man; }}
          />
          {showModal &&
            <div className={classes.modal} ref={modalRef}>
              <span onClick={handleShowForm}>Update Profile</span>
            </div>
          }
        </div>
        {
          showForm &&
          <div className={classes.updateProfileForm} onClick={() => setShowForm(false)}>
            <div className={classes.updateProfileWrapper} onClick={(e) => e.stopPropagation()}>
              <h2>Update Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <input type="text" placeholder='Username' name="username" value={state.username}  onChange={handleState} />
                <input type="email" placeholder='Email' name="email" value={state.email} onChange={handleState} />
                <input type="text" placeholder='Bio' name="bio" value={state.bio} onChange={handleState} />
                <input type="password" placeholder='Password'  name="password" onChange={handleState} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                  <label htmlFor='photo'>Profile Picture <AiOutlineFileImage /></label>
                  <input
                    type="file"
                    id='photo'
                    placeholder='Profile picture'
                    style={{ display: 'none' }}
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                  {photo && <p>{photo.name}</p>}
                </div>
                <button>Update profile</button>
              </form>
              <AiOutlineClose onClick={() => setShowForm(false)} className={classes.removeIcon} />
            </div>
          </div>
        }
      </div>
      {
        <div className={classes.mobileNav}>
          {showMobileNav &&
            <div className={classes.navigation}>
              <div className={classes.left} onClick={() => setShowMobileNav(false)}>
                <Link to='/' className='linklogo' >
                <img src={logo1} alt="logo" className='logo' style={{ width: '60px' }} />
                </Link>
              </div>
              <AiOutlineClose className={classes.mobileCloseIcon} onClick={() => setShowMobileNav(false)} />
              <div className={classes.center}>
                <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" placeholder="Search user..." />
                <AiOutlineSearch className={classes.searchIcon} />
                {searchText && (
                  <div onClick={() => setSearchText("")} className={classes.allUsersContainer}>
                    {filteredUsers?.map((user) => {
                      const imageUrl = user.profileImg ? `http://localhost:5000/images/${user.profileImg}` : man;
                      console.log(`User: ${user.username}, Image URL: ${imageUrl}`);
                      return (
                        <Link to={`/profileDetail/${user._id}`} key={user._id} onClick={() => setShowMobileNav(false)}>
                          <img src={imageUrl} alt='profile' onError={(e) => { e.target.onerror = null; e.target.src = man; }} />
                          <div className={classes.userData}>
                            <span>{user?.username}</span>
                            <span>{user?.bio?.slice(0, 10)}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={classes.right}>
                <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/upload' onClick={() => setShowMobileNav(false)}>Upload</Link >
                <div className={classes.icons}>
                  <Link to={`/profileDetail/${user._id}`} className={classes.iconLink} onClick={() => setShowMobileNav(false)}>
                    <AiOutlineUser />
                  </Link>
                  <AiOutlineLogout onClick={handleLogout} />
                </div>
              </div>
              {showModal &&
                <div className={classes.modal}>
                  <span onClick={handleShowForm}>Update Profile</span>
                </div>
              }
              {showForm &&
                <div className={classes.updateProfileForm} onClick={() => setShowForm(false)}>
                  <div className={classes.updateProfileWrapper} onClick={(e) => e.stopPropagation()}>
                    <h2>Update Profile</h2>
                    <form onSubmit={handleUpdateProfile}>
                      <input type="text" placeholder='Username' name="username" onChange={handleState} />
                      <input type="email" placeholder='Email' name="email" onChange={handleState} />
                      <input type="text" placeholder='Bio' name="bio" onChange={handleState} />
                      <input type="password" placeholder='Password' name="password" onChange={handleState} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                        <label htmlFor='photo'>Profile Picture <AiOutlineFileImage /></label>
                        <input
                          type="file"
                          id='photo'
                          placeholder='Profile picture'
                          style={{ display: 'none' }}
                          onChange={(e) => setPhoto(e.target.files[0])}
                        />
                        {photo && <p>{photo.name}</p>}
                      </div>
                      <button>Update profile</button>
                    </form>
                    <AiOutlineClose onClick={() => setShowForm(false)} className={classes.removeIcon} />
                  </div>
                </div>
              }
            </div>
          }
          <div className={classes.left} onClick={() => setShowMobileNav(true)}>
          <ImMenu style={{ fontSize: '27px' }} />
          </div>
          <div className={classes.center}>
            <Link to='/'  className='log'>
            <img src={logo} alt="logo" className='logo' style={{ width: '180px' }} />
            </Link>
          </div>
        </div>
      }
    </div>
  );
};

// Wrapping Navbar with Error Boundary
const NavbarWithErrorBoundary = () => (
  <ErrorBoundary>
    <Navbar />
  </ErrorBoundary>
);

export default NavbarWithErrorBoundary;
