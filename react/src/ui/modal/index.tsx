import * as React from 'react';
import { createPortal } from 'react-dom';
import './modal.scss';

interface ModalProps {
  children: React.ReactNode | React.ReactNode[];
  bodyScroll?: boolean;
  rootElement?: HTMLElement;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  bodyScroll,
  rootElement
}: ModalProps) => {
  const [element] = React.useState(
    rootElement || document.createElement('div')
  );

  React.useEffect(() => {
    let modalRoot = document.getElementById('modal');

    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal';
      document.body.append(modalRoot);
    }

    modalRoot.appendChild(element);

    if (bodyScroll) document.body.style.overflow = 'hidden';

    return () => {
      if (bodyScroll) document.body.style.overflow = 'auto';
      element.remove();

      if (modalRoot) modalRoot.remove();
    };
  }, [element, bodyScroll]);

  return createPortal(children, element);
};

Modal.defaultProps = {
  bodyScroll: true
};

export default Modal;
