<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";
  import meetups from "./Meetups/meetups-store";
  import MeetupDetail from "./Meetups/MeetupDetail.svelte";
  import LoadingSpinner from "./UI/LoadingSpinner.svelte";
  import Error from "./UI/Error.svelte";

  $: console.log(pageData);

  let editMode = null;
  let page = "overview";
  let pageData = {};
  let editedId;
  let isLoading = true;
  let error;

  fetch(`https://myapplicationproject-9ac7c.firebaseio.com/meetups.json`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Fetching meetups failed, please try again later!");
      }

      return res.json();
    })
    .then((data) => {
      const loadedMeetups = [];
      for (const key in data) {
        loadedMeetups.push({ ...data[key], id: key });
      }
      setTimeout(() => {
        isLoading = false;
        meetups.setMeetups(loadedMeetups.reverse());
      }, 1000);
    })
    .catch((err) => {
      error = err;
      console.log(err);
    });

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

  function clearError() {
    error = null;
  }
</script>

{#if error}
  <Error message={error} on:cancel={clearError} />
{/if}

<Header />

<main id="main">
  {#if page === "overview"}
    {#if editMode === "edit"}
      <EditMeetup id={editedId} on:save={saveMeetup} on:cancel={cancelEdit} />
    {/if}

    {#if isLoading}
      <LoadingSpinner />
    {:else}
      <MeetupGrid
        meetups={$meetups}
        on:showdetails={showDetails}
        on:edit={startEdit}
        on:add={() => {
          editMode = "edit";
        }}
      />
    {/if}
  {:else}
    <MeetupDetail id={pageData.id} on:close={closeDeatil} />
  {/if}
</main>

<style>
  #main {
    margin-top: 5rem;
  }
</style>
