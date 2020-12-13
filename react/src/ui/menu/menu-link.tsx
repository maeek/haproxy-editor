import React, { FC } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import DefaultIcon from '@material-ui/icons/HelpOutlineRounded';
import './menu.scss';

interface MenuLinkProps {
  isLink?: boolean;
  href?: string;
  linkProps?: { [key in keyof LinkProps]: any };
  onClick?: Function,
  Icon: FC;
  tooltip: string;
  className?: string;
}

const MenuLink = (props: MenuLinkProps) => {
  const {
    isLink,
    Icon,
    onClick,
    tooltip,
    href,
    linkProps,
    className
  } = props;

  const onClickHandler = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (onClick) {
      (onClick as React.MouseEventHandler<HTMLLIElement>)(e)
    }
  };

  const content = (
    <>
      <Icon />
      <div className="links-container-element-tooltip">
        {tooltip}
      </div>
    </>
  );

  return (
    <li className={`links-container-element${className ? ` ${className}` : ''}`} onClick={onClickHandler}>
      {isLink
        ? <Link to={href} {...linkProps}>{content}</Link>
        : content
      }
    </li>
  );
};

MenuLink.defaultProps = {
  isLink: false,
  Icon: DefaultIcon
};

export default MenuLink;
