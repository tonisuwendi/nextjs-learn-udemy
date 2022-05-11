import EventList from "../components/events/event-list";
import { getFeaturedEvents } from "../dummy-data";

function HomePage () {

    const featuredEvent = getFeaturedEvents();

    return <EventList items={featuredEvent} />;
};

export default HomePage;
