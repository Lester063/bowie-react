import BodyTemplate from "../components/BodyTemplate";
import Loading from '../components/Loading';
import useLoading from "../components/useLoading";

const Contact = () => {
    document.title = 'Contact';
    const { loading } = useLoading();
    const data = {
        body: "If you are looking for a Software Engineer, you can directly contact me with my LinkedIn account, https://www.linkedin.com/in/lester-tuazon-665569199/"
    }
    return (
        <div className="mobile-body">
            {loading && <Loading />}
            {!loading && <BodyTemplate title="Contact" body={data}/>}
        </div>
    );
}
 
export default Contact;