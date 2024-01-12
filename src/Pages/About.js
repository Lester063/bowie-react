import BodyTemplate from "../components/BodyTemplate";
import Loading from '../components/Loading';
import useLoading from "../components/useLoading";

const About = () => {
    document.title = 'About';
    const { loading } = useLoading();
    const data = {
        body: "A sample of Single Page Application that demonstrates a simple CREATE, READ, UPDATE, and DELETE data using React library and Laravel framework."
    }
    return (
        <div className="mobile-body">
            {loading && <Loading />}
            {!loading && <BodyTemplate title="About" body={data} />}
        </div>
    );
}

export default About;