const BodyTemplate = ({title, body}) => {
    return (
        <div className="container">
        <div className="row">
            <div className="col md-12">
                <div className="card mt-3">
                    <div className="card-header">
                        <h1>{title}</h1>
                    </div>
                    <div className="card-body">
                        {body.body}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
 
export default BodyTemplate;