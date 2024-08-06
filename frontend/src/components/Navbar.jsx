import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (where && checkIn && checkOut) {
      navigate(
        `/properties/search?where=${encodeURIComponent(
          where
        )}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(
          checkOut
        )}`
      );
    }
  };

  return (
    <div className="navbar">
      <div className="navbar_top">
        <a href="/">
          <img src="/assets/logo.png" alt="logo" />
        </a>

        <div className="navbar_right">
          {user ? (
            <Link to="/create-listing" className="host">
              MomentStay your home
            </Link>
          ) : (
            <Link to="/login" className="host">
              Become A Host
            </Link>
          )}

          <button
            className="navbar_right_account"
            onClick={() => setDropdownMenu(!dropdownMenu)}
          >
            <Menu />
            {!user ? (
              <Person />
            ) : (
              <img
                src={`http://localhost:3001/${user.profileImagePath.replace(
                  "profile",
                  ""
                )}`}
                alt="profile"
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            )}
          </button>

          {dropdownMenu && !user && (
            <div className="navbar_right_accountmenu">
              <Link to="/login">Sign In</Link>
              <Link to="/register">Sign Up</Link>
            </div>
          )}

          {dropdownMenu && user && (
            <div className="navbar_right_accountmenu">
              <Link to={`/${user._id}/trips`}>Trips</Link>
              <Link to={`/${user._id}/wishList`}>Wish List</Link>
              <Link to={`/${user._id}/properties`}>Property List</Link>
              <Link to={`/${user._id}/reservations`}>Reservation List</Link>
              <Link to="/create-listing">Become A Host</Link>
              <Link
                to="/login"
                onClick={() => {
                  dispatch(setLogout());
                }}
              >
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="navbar_search">
        <div className="search_field">
          <label htmlFor="where">Where</label>
          <input
            id="where"
            type="text"
            placeholder="Search destinations"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
          />
        </div>

        <div className="search_field">
          <label htmlFor="checkin">Check In</label>
          <input
            id="checkin"
            type="date"
            placeholder="Add dates"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div className="search_field">
          <label htmlFor="checkout">Check Out</label>
          <input
            id="checkout"
            type="date"
            placeholder="Add dates"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <IconButton
        className="search-button"
          disabled={!(where && checkIn && checkOut)}
          onClick={handleSearch}
        >
          <Search />
        </IconButton>
      </div>
    </div>
  );
};

export default Navbar;
