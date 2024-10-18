import PropTypes from 'prop-types'
import {  FadeLoader,  } from 'react-spinners'
const LoadingSpinner = ({ smallHeight }) => {
    return (
        <div
            className={` ${smallHeight ? 'h-[250px]' : 'h-[100vh]'}
          flex 
          flex-col 
          justify-center 
          items-center `}
        >
            {/* PulseLoader */}
            <FadeLoader size={100} color='red' />
        </div>
    )
};
LoadingSpinner.propTypes = {
    smallHeight: PropTypes.bool,
}
export default LoadingSpinner;