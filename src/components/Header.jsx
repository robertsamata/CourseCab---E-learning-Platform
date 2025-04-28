import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

function Header() {
    const locationTypes = [
      { label: 'All Courses', value: 'courses' },
      { label: 'My Courses', value: 'history' },
    ];
  
    return (
    <header className="w-full bg-gray-800 text-white p-10 flex items-center justify-between">
      <Link to="/">
        <img src={logoImage} alt="Logo" className="h-10" />
      </Link>
    <nav className="flex-grow">
      <ul className="flex justify-end space-x-4">
        {locationTypes.map((type) => (
          <li key={type.value}>
            <Link to={`/${type.value}`} className="hover:text-gray-200">{type.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
    </header>
    );
  }
  
  export default Header;
  