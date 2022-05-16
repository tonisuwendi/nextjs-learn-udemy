import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import ErrorAlert from '../../components/ui/error-alert';
import Button from '../../components/ui/button';

function FilteredEventsPage() {
    const [loadedEvents, setLoadedEvents] = useState();
    const router = useRouter();

    const filterData = router.query.slug;

    let pageHeadData = (
        <Head>
            <title>Filtered Event</title>
            <meta name="description" content="A list of filtered events" />
        </Head>
    )

    const fetcher = url => fetch(url).then(res => res.json());

    const { data, error } = useSWR('https://nextjs-course-50dea-default-rtdb.firebaseio.com/events.json', fetcher);

    useEffect(() => {
        if (data) {
            const events = [];

            for (const key in data) {
                events.push({
                    id: key,
                    ...data[key],
                });
            }

            setLoadedEvents(events);
        }
    }, [data]);

    if (!loadedEvents) {
        return (
            <Fragment>
                {pageHeadData}
                <p>Loading...</p>
            </Fragment>
        )
    }

    const filteteredYear = filterData[0];
    const filteteredMonth = filterData[1];

    const numYear = +filteteredYear;
    const numMonth = +filteteredMonth;

    if (isNaN(numYear) || isNaN(numMonth) || numYear > 2030 || numYear < 2020 || numMonth < 1 || numMonth > 12 || error) {
        return (
            <Fragment>
                {pageHeadData}
                <ErrorAlert>
                    <p>Invalid filter. Please adjust your values!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </Fragment>
        );
    }

    const filteredEvents = loadedEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getFullYear() === numYear &&
          eventDate.getMonth() === numMonth - 1
        );
    });

    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <Fragment>
                {pageHeadData}
                <ErrorAlert>
                    <p>No events found for the chosen filter!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </Fragment>
        );
    }

    const date = new Date(numYear, numMonth - 1);

    return (
        <Fragment>
            {pageHeadData}
            <ResultsTitle date={date} />
            <EventList items={filteredEvents} />
        </Fragment>
    )
};

export default FilteredEventsPage;
