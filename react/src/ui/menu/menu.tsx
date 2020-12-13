import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import {ReactComponent as  HAProxyLogo} from '../../assets/haproxy-icon.svg';
import DescriptionIcon from '@material-ui/icons/DescriptionRounded';
import CachedIcon from '@material-ui/icons/CachedRounded';
import ServerIcon from '@material-ui/icons/DnsRounded';
import AddIcon from '@material-ui/icons/AddCircleOutlineRounded';
import DownloadIcon from '@material-ui/icons/SaveAltRounded';
import SnippetsIcon from '@material-ui/icons/CategoryRounded';
import './menu.scss';
import MenuLink from './menu-link';

interface MenuProps {
  syncFunc?: Function;
  className?: string;
}

const Menu: FC<MenuProps> = (props: MenuProps) => {
  const { syncFunc, className } = props;

  return (
    <aside className={`menu-main-side${className ? ` ${className}` : ''}`}>
      <div className="logo">
        <Link to="/" draggable="false">
          <HAProxyLogo />
        </Link>
      </div>

      <div className="spacer"></div>

      <ul className="links-container">
        <MenuLink
          Icon={CachedIcon}
          isLink={false}
          tooltip="Sync with server"
          onClick={syncFunc}
        />

        <MenuLink
          Icon={DescriptionIcon}
          isLink={true}
          href="/configs/"
          tooltip="Configs"
        />

        <MenuLink
          Icon={AddIcon}
          isLink={true}
          href="/configs/add"
          tooltip="Add config"
        />

        <MenuLink
          Icon={DownloadIcon}
          isLink={true}
          href="/configs/export"
          tooltip="Export config"
        />

        <MenuLink
          Icon={SnippetsIcon}
          isLink={true}
          href="/snippets"
          tooltip="Snippets"
        />

        <MenuLink
          Icon={ServerIcon}
          isLink={true}
          href="/service"
          tooltip="Manage service"
        />
      </ul>
    </aside>
  );
}

export default Menu;
