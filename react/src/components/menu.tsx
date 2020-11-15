import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <aside>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/manage">Manage Haproxy</Link>
        </li>
      </ul>
    </aside>
  );
}

export default Menu;
