import { subscribe } from "svelte/internal";
import { writable } from "svelte/store";

const meetups = writable([
  {
    id: "m1",
    title: "Codding Bootcamp",
    subtitle: "Learn code in 2 hours",
    description: "In this meetup, we will have some experts that teach coding",
    imageUrl:
      "https://media.licdn.com/dms/image/D4E12AQEi_yQspOHgqA/article-cover_image-shrink_720_1280/0/1665931119494?e=1726099200&v=beta&t=lXZdu2uHIfLQATh5iZAl0qCm5qS-1-ZCYdvUhjybioM",
    address: "184, Bengaluru",
    contactEmail: "code@gmail.com",
    isFavorite: false,
  },
  {
    id: "m2",
    title: "Swim Together",
    subtitle: "Learn Swim in 2 hours",
    description: "In this meetup, we will have some experts that teach swim",
    imageUrl:
      "https://cdn.britannica.com/83/126383-050-38B8BE25/Michael-Phelps-American-Milorad-Cavic-final-Serbia-2008.jpg?w=400&h=300&c=crop",
    address: "184, Bengaluru",
    contactEmail: "swime@gmail.com",
    isFavorite: false,
  },
]);

const customMeetupsStore = {
  subscribe: meetups.subscribe,
  addMeetup: (meetupData) => {
    const newMeetup = {
      ...meetupData,
      id: Math.random().toString(),
      isFavorite: false,
    };
    meetups.update((items) => {
      return [newMeetup, ...items];
    });
  },
  toggleFavorite: (id) => {
    meetups.update((items) => {
      const updatedMeetup = { ...items.find((m) => m.id === id) };
      // Toggle isFavorite
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      const meetupIndex = items.findIndex((m) => m.id === id);
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
};

export default customMeetupsStore;
