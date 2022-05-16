import { Fragment } from 'react';
import Head from 'next/head';

import EventSummary from '../../components/event-detail/event-summary';
import EventLogistics from '../../components/event-detail/event-logistics';
import EventContent from '../../components/event-detail/event-content';
import { getEventById, getFeaturedEvents } from '../../helper/api.util';

function EventDetailPage({ event }) {

    return (
        <Fragment>
            <Head>
                <title>{event.title}</title>
                <meta name="description" content={event.description} />
            </Head>
            <EventSummary title={event.title} />
            <EventLogistics
                date={event.date}
                address={event.location}
                image={event.image}
                imageAlt={event.title}
            />
            <EventContent>
                <p>{event.description}</p>
            </EventContent>
        </Fragment>
    )
};

export async function getStaticProps({ params: { eventId } }) {
    const event = await getEventById(eventId);

    return {
        props: {
            event,
        },
        revalidate: 30,
    }
}

export async function getStaticPaths() {

    const events = await getFeaturedEvents();

    const paths = events.map(event => ({ params: { eventId: event.id } }));

    return {
        paths,
        fallback: 'blocking',
    }
}

export default EventDetailPage;
