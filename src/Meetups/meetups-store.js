import { subscribe } from "svelte/internal";
import { writable } from "svelte/store";

const meetups = writable([]);

const customMeetupsStore = {
  subscribe: meetups.subscribe,

  // set meetups to store
  setMeetups: (meetupArray) => {
    meetups.set(meetupArray);
  },

  // Adding meetups
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
