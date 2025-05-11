import './Scrollbox.css';
type ScrollboxProps = {
  children: React.ReactNode;
  className?: string;
};

const Scrollbox: React.FC<ScrollboxProps> = ({ children, className = '' }) => {
  return (
    <div className={`scrollbox ${className}`}>
      <div className="scrollbox-content">{children}</div>
    </div>
  );
};

export { Scrollbox };
