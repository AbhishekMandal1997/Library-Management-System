import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white">Home</Link>
        </li>
        <li>
          <Link to="/add-book" className="text-white">Add Book</Link>
        </li>
        <li>
          <Link to="/manage-books" className="text-white">Manage Books</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
