import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Can from "../rbac/Can";
function UserHeader() {
  const userDetails = useSelector((state) => state.userDetails);
  console.log("userDetails from Redux:", userDetails);
console.log("typeof userDetails.name:", typeof userDetails?.name);



  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          Dashboard
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* You can add links like Home, Profile, etc. here */}
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <Link
  className="nav-link dropdown-toggle"
  href="#"
  role="button"
  data-bs-toggle="dropdown"
  aria-expanded="false"
  onClick={(e) => e.preventDefault()}>
    {userDetails?.name || "Account"}

  

</Link>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/users">Manage Users</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/manage-payment">Payments</Link>
                     </li>
                      <hr className="m-0" />

                <li>
                  <Link className="dropdown-item" to="/logout">
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default UserHeader;
