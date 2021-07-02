import React, { FC, ReactNode } from 'react';
import './modal.scss';

interface ModalContainerProps {
  children?: ReactNode | ReactNode[];
  className?: string;
  onMaskClick?: Function;
}

const ModalContainer: FC<ModalContainerProps> = (props: ModalContainerProps) => {
  const {children, className, onMaskClick} = props;

  const onClickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMaskClick) {
      (onMaskClick as React.MouseEventHandler<HTMLDivElement>)(e);
    }
  };

  const innerOnClickHandler =  (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={`modal-container${className ? ` ${className}` : ''}`} onClick={onClickHandler}>
      <div className="modal-container-box" onClick={innerOnClickHandler}>
        {children}
      </div>
    </div>
  );
}

export default ModalContainer;
