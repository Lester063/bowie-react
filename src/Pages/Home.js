import BodyTemplate from "../components/BodyTemplate";
import Loading from '../components/Loading';
import useLoading from "../components/useLoading";

const Home = () => {
    document.title = 'Home';
    const { loading } = useLoading();
    const data = {
        body: "A simple react repository to demonstrate a single page application."
    }

    return (
        <div>
            {loading && <Loading />}
            {!loading && <BodyTemplate title="Home" body={data} />}
        </div>
    );
}

export default Home;