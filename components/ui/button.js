import Link from "next/link";

import classes from './button.module.css';

const Button = ({ link, children }) => {

    if (link) {
        return (
            <Link href={link}>
                <a className={classes.btn}>{children}</a>
            </Link>
        );
    }

    return <button className={classes.btn}>{children}</button>
};

export default Button;
