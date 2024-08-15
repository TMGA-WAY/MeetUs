<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";
  import meetups from "./Meetups/meetups-store";

  let title = "";
  let subtitle = "";
  let address = "";
  let imageUrl = "";
  let description = "";
  let email = "";

  // let meetups =
  let editMode = null;
  function cancelEdit() {
    editMode = null;
  }

  function addMeetup(event) {
    editMode = null;
  }

  function toogleFavorite(event) {
    const id = event.detail;
    meetups.toggleFavorite(id);
  }
</script>

<Header />

<main id="main">
  <div class="meetup-controls">
    <Button on:click={() => (editMode = "add")}>New Meetup</Button>
  </div>
  {#if editMode === "add"}
    <EditMeetup on:save={addMeetup} on:cancel={cancelEdit} />
  {/if}

  <MeetupGrid meetups={$meetups} on:toggleFavorite={toogleFavorite} />
</main>

<style>
  #main {
    margin-top: 5rem;
  }
  .meetup-controls {
    margin: 1rem;
  }
</style>
