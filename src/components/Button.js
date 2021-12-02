import PropTypes from "prop-types"

const Button = ({ color, text, width, height, key, id, borderRadius, onClick }) => {

    return (
        <button 
            onClick={onClick} 
            style={{ 
                backgroundColor: color,
                borderRadius: borderRadius,
                width: width,
                height: height
            }} 
            className="btn"
            key={key}
            id={id}
        >
            {text}
        </button>
    )
}

Button.defaultProps = {
    color: "gray",
    text: "",
    width: "auto",
    height: "auto",
    key: "",
    id: "",
    borderRadius: "5px"
}

Button.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
}

export default Button
