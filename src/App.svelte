<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";
  import meetups from "./Meetups/meetups-store";
  import MeetupDetail from "./Meetups/MeetupDetail.svelte";

  $: console.log(pageData);

  let editMode = null;
  let page = "overview";
  let pageData = {};

  $: console.log("pagedata" + pageData);

  function cancelEdit() {
    editMode = null;
  }

  function addMeetup(event) {
    editMode = null;
  }

  function showDetails(event) {
    page = "details";
    pageData.id = event.detail;
  }
  function closeDeatil() {
    page = "overview";
    pageData = {};
  }
</script>

<Header />

<main id="main">
  {#if page === "overview"}
    <div class="meetup-controls">
      <Button on:click={() => (editMode = "add")}>New Meetup</Button>
    </div>
    {#if editMode === "add"}
      <EditMeetup on:save={addMeetup} on:cancel={cancelEdit} />
    {/if}

    <MeetupGrid meetups={$meetups} on:showdetails={showDetails} />
  {:else}
    <MeetupDetail id={pageData.id} on:close={closeDeatil} />
  {/if}
</main>

<style>
  #main {
    margin-top: 5rem;
  }
  .meetup-controls {
    margin: 1rem;
  }
</style>
