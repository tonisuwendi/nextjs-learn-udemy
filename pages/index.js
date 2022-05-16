import EventList from "../components/events/event-list";
import { getFeaturedEvents } from "../helper/api.util";

function HomePage ({ featuredEvent }) {

    return <EventList items={featuredEvent} />;
};

export async function getStaticProps() {
    const featuredEvent = await getFeaturedEvents();

    return {
        props: {
            featuredEvent,
        },
        revalidate: 1800,
    }
}

export default HomePage;
