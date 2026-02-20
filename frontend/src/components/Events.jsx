import { useEffect, useState } from "react";
import axios from "axios";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/events/")
      .then(res => setEvents(res.data));
  }, []);

  return (
    <div>
      <h2>All Events</h2>
      {events.map((e, i) => (
        <div key={i}>
          <h3>{e[1]}</h3>
          <p>{e[4]} - {e[6]}</p>
        </div>
      ))}
    </div>
  );
}
