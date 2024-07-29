<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";

  let title = "";
  let subtitle = "";
  let address = "";
  let imageUrl = "";
  let description = "";
  let email = "";

  let meetups = [
    {
      id: "m1",
      title: "Codding Bootcamp",
      subtitle: "Learn code in 2 hours",
      description:
        "In this meetup, we will have some experts that teach coding",
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
  ];
  let editMode = null;
  function cancelEdit() {
    editMode = null;
  }

  function addMeetup(event) {
    const newMeetup = {
      id: Math.random().toString(),
      title: event.detail.title,
      subtitle: event.detail.subtitle,
      description: event.detail.description,
      imageUrl: event.detail.imageUrl,
      contactEmail: event.detail.email,
      address: event.detail.address,
    };
    meetups = [newMeetup, ...meetups];
    editMode = null;
  }

  function toogleFavorite(event) {
    const id = event.detail;
    console.log(id);
    const updatedMeetup = { ...meetups.find((m) => m.id === id) };
    // Toggle isFavorite
    updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
    const meetupIndex = meetups.findIndex((m) => m.id === id);
    const updatedMeetups = [...meetups];
    updatedMeetups[meetupIndex] = updatedMeetup;
    meetups = updatedMeetups;
  }
</script>

<Header />

<main id="main">
  <div class="meetup-controls">
    <Button on:click={() => (editMode = "add")}>New Meetup</Button>
  </div>
  {#if editMode === "add"}
    <EditMeetup on:save={addMeetup} on:cancel = {cancelEdit}/>
  {/if}

  <MeetupGrid {meetups} on:toggleFavorite={toogleFavorite} />
</main>

<style>
  #main {
    margin-top: 5rem;
  }
  .meetup-controls {
    margin: 1rem;
  }
</style>
