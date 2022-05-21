import { useState, useContext } from "react";
import NotificationContext from "../../store/notification-context";

import classes from "./newsletter-registration.module.css";

function NewsletterRegistration() {
  const notifCtx = useContext(NotificationContext);
  const [enteredEmail, setEnteredEmail] = useState("");

  function registrationHandler(event) {
    event.preventDefault();

    notifCtx.showNotification({
      title: "Signing up...",
      message: "Registering for newsletter.",
      status: "pending",
    });
    fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        return res.json().then((data) => {
          throw new Error(data.message || "Something went wrong!");
        });
      })
      .then((data) => {
        notifCtx.showNotification({
          title: "Success!",
          message: "Successfully registered for newsletter!",
          status: "success",
        });
      })
      .catch((error) => {
        notifCtx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong!",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            value={enteredEmail}
            onChange={(e) => setEnteredEmail(e.target.value)}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
