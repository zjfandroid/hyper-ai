import { Button, Modal } from 'antd';
import { ReactNode } from 'react';
import { IClose } from '@/components/icon';

interface BaseModalProps {
  title: string | ReactNode;
  titleClassName?: string;
  open: boolean;
  onClose: () => void;
  onSubmit?: (() => any | Promise<any>) | null;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  submitText?: string;
  width?: number;
  children: ReactNode;
}

const BaseModal = ({
  title,
  titleClassName = 'mb-4',
  open,
  onClose,
  onSubmit,
  submitLoading = false,
  submitDisabled = false,
  submitText = 'Submit',
  width = 500,
  children
}: BaseModalProps) => {
  return (
    <Modal
      destroyOnHidden={true}
      centered 
      width={width} 
      open={open} 
      footer={null} 
      onCancel={onClose} 
      closeIcon={<IClose className='' />}
    >
      <div className='d-flex flex-column p-3 p-md-4'>
        <h4 className={`d-flex align-items-center gap-3 fw-500 pt-1 pb-2 ps-1 h5 ${titleClassName}`}>{title}</h4>
        <div className='d-flex flex-column gap-1'>
          {children}
        </div>
        {onSubmit &&
          <div className='d-flex justify-content-center pt-4 mt-2'>
            <Button size='small' disabled={submitDisabled} type='primary' loading={submitLoading} className='d-flex align-items-center justify-content-center fw-bold br-4 px-3 col-12 col-md-4 gap-3' onClick={onSubmit}>
              {submitText}
            </Button>
          </div>
        }
      </div>
    </Modal>
  );
};

export default BaseModal;