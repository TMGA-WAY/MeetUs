import { subscribe } from "svelte/internal";
import { writable } from "svelte/store";

const meetups = writable([
  {
    id: "m1",
    title: "Codding Bootcamp",
    subtitle: "Learn code in 2 hours",
    description: "In this meetup, we will have some experts that teach coding",
    imageUrl:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    };
    meetups.update((items) => {
      return [newMeetup, ...items];
    });
  },

  updateMeetup: (id, meetupData) => {
    meetups.update((items) => {
      const meetupIndex = items.findIndex((i) => i.id === id);
      const updatedMeetup = { ...items[meetupIndex], ...meetupData }; // get the item with index and replaced with meetupDate
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
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
  deleteMeetup: (id) => {
    meetups.update((items) => {
      const updatedMeetup = items.filter((i) => i.id !== id);
      return updatedMeetup;
    });
  },
};

export default customMeetupsStore;
