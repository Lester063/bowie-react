const HoverMessage = ({id,message}) => {
    return (
        <span id={id} style={{
            backgroundColor: '#5a5c5a', color:'#fff', position: 'absolute',
            margin: '-20px 0px 0px 10px', zIndex: '2',
            padding: '5px', borderRadius: '5px',
            display: 'none'
        }}>{message}</span>
    );
}
 
export default HoverMessage;