
import PropTypes from 'prop-types';
const Container = ({children, className}) => {
    return (
        <div className={`max-w-[1238px]  mx-auto ${className} overflow-hidden`} >
        {children}
      
    </div>
    );
};
Container.propTypes = {
    
    children: PropTypes.node, 
    className: PropTypes.string,
}
export default Container;