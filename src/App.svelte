<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";

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

  function addMeetup() {
    const newMeetup = {
      id: Math.random(),
      title: title,
      subtitle: subtitle,
      description: description,
      imageUrl: imageUrl,
      contactEmail: email,
      address: address,
    };
    meetups = [newMeetup, ...meetups];
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
  <form on:submit|preventDefault={addMeetup}>
    <TextInput
      id="titile"
      label="Title"
      type="text"
      value={title}
      on:input={(event) => (title = event.target.value)}
    />

    <TextInput
      id="subtitile"
      label="Subtitle"
      type="text"
      value={subtitle}
      on:input={(event) => (subtitle = event.target.value)}
    />

    <TextInput
      id="address"
      label="Address"
      type="text"
      value={address}
      on:input={(event) => (address = event.target.value)}
    />

    <TextInput
      id="imageUrl"
      label="ImageUrl"
      type="text"
      value={imageUrl}
      on:input={(event) => (imageUrl = event.target.value)}
    />

    <TextInput
      id="description"
      label="Description"
      controlType="textarea"
      value={description}
      type="text"
      on:input={(event) => (description = event.target.value)}
    />

    <TextInput
      id="email"
      label="Email"
      value={email}
      type="email"
      on:input={(event) => (email = event.target.value)}
    />
    <Button type="Submit" caption="Save" />
  </form>
  <MeetupGrid {meetups} on:toggleFavorite={toogleFavorite} />
</main>

<style>
  #main {
    margin-top: 5rem;
  }
  form {
    width: 30rem;
    max-width: 90%;
    margin: auto;
  }
</style>
