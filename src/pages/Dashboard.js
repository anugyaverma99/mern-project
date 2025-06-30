import { Link } from "react-router-dom";
import LinkDashBoard from "./links/LinkDashBoard"; // Adjust the path if needed

function Dashboard() {
  return (
    <>
      

      {/* Include the link dashboard table below the heading */}
      <LinkDashBoard />
    </>
  );
}

export default Dashboard;
