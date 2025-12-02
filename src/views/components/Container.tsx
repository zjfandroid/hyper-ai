import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface IContainer {
  title?: string;
  children: React.ReactNode;
  isCommonBg?: boolean;
  loading?: boolean;
  isBack?: boolean;
  opt?: React.ReactNode;
  style?: React.CSSProperties;
  isHidden?: boolean;
}

const Container = (props: IContainer) => {
  const { title, children, isCommonBg, loading, isBack, opt, style, isHidden } = props;
  const nav = useNavigate();

  const isMobile = window.innerWidth < 768;

  const onBack = () => {
    const location = window.location.pathname;
    const newPath = location.split('/').slice(0, -1).join('/');
    nav(newPath);
  }

  return (
    <div className="w-full h-full">
      {title && <div className="w-full relative h-[3.375rem] leading-[3.375rem] px-6 bg-white text-[#2C4E93] font-bold">
        {isBack && <ArrowLeftOutlined className='mr-2 cursor-pointer' onClick={onBack} />}
        <span>{title}</span>
        {opt}
      </div>}
      <div style={style}>
        {loading && <div className="w-full h-full left-0 top-0 text-center   fixed " style={{ background: 'rgba(0,0,0,0.15)' }}>
          <LoadingOutlined style={{ color: 'blue' }} className='text-5xl z-1000 mt-[50vh]' />
        </div>}
        <div style={isCommonBg ? {} : { background: '#fff' }} className={`${isHidden ? 'overflow-hidden' : 'overflow-auto'}`}>{children}</div>
      </div>
    </div>
  );
}

export default Container;