<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../UI/Button.svelte";
  import MeetupFilter from "./MeetupFilter.svelte";
  import MeetupItem from "./MeetupItem.svelte";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";

  export let meetups;
  const dispatch = createEventDispatcher();
  let favOnly = false;

  $: filteredMeetups = favOnly ? meetups.filter((m) => m.isFavorite) : meetups;

  function setFilter(event) {
    favOnly = event.detail === 1;
  }
</script>

<section class="meetup-controls">
  <MeetupFilter on:select={setFilter} />
  <Button on:click={() => dispatch("add")}>New Meetup</Button>
</section>

{#if filteredMeetups.length === 0}
  <p id="no-meetups">No meetups found, you can start adding some.</p>
{/if}

<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
    <div transition:scale animate:flip={{ duration: 300 }}>
      <MeetupItem
        id={meetup.id}
        title={meetup.title}
        subtitle={meetup.subtitle}
        imageUrl={meetup.imageUrl}
        address={meetup.address}
        description={meetup.description}
        email={meetup.contactEmail}
        isFav={meetup.isFavorite}
        on:showdetails
        on:edit
      />
    </div>
  {/each}
</section>

<style>
  #meetups {
    margin-top: 5rem;
  }

  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }

  .no-meetups {
    margin: 1rem;
  }
</style>
