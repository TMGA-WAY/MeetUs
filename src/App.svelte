<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";
  import meetups from "./Meetups/meetups-store";
  import MeetupDetail from "./Meetups/MeetupDetail.svelte";

  $: console.log(pageData);

  let editMode = null;
  let page = "overview";
  let pageData = {};
  let editedId;

  $: console.log("pagedata" + pageData);

  function cancelEdit() {
    editMode = null;
    editedId = null;
  }

  function saveMeetup(event) {
    editMode = null;
    editedId = null;
  }

  function showDetails(event) {
    page = "details";
    pageData.id = event.detail;
  }
  function closeDeatil() {
    page = "overview";
    pageData = {};
  }
  function startEdit(event) {
    editMode = "edit";
    editedId = event.detail;
  }
</script>

<Header />

<main id="main">
  {#if page === "overview"}
    {#if editMode === "edit"}
      <EditMeetup id={editedId} on:save={saveMeetup} on:cancel={cancelEdit} />
    {/if}

    <MeetupGrid
      meetups={$meetups}
      on:showdetails={showDetails}
      on:edit={startEdit}
      on:add={() => {
        editMode = "edit";
      }}
    />
  {:else}
    <MeetupDetail id={pageData.id} on:close={closeDeatil} />
  {/if}
</main>

<style>
  #main {
    margin-top: 5rem;
  }
</style>
