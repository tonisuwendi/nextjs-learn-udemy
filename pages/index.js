import { Fragment } from 'react';
import Head from 'next/head';

import EventList from "../components/events/event-list";
import { getFeaturedEvents } from "../helper/api.util";

function HomePage ({ featuredEvent }) {

    return (
        <Fragment>
            <Head>
                <title>NextJS Events</title>
                <meta name="description" content="Find a lot of great events that allow you to envolve." />
            </Head>
            <EventList items={featuredEvent} />
        </Fragment>
    );
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
