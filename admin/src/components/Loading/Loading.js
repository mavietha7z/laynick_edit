import ReactLoading from 'react-loading';

function Loading() {
    return (
        <div className="loading">
            <ReactLoading type="bubbles" color="white" height="70px" width="70px" />
        </div>
    );
}

export default Loading;
