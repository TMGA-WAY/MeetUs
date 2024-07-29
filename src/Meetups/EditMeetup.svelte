<script>
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";

  let title = "";
  let subtitle = "";
  let address = "";
  let imageUrl = "";
  let description = "";
  let email = "";
  const dispatch = createEventDispatcher();

  

  function submitForm() {
    dispatch("save", {
      title: title,
      subtitle: subtitle,
      address: address,
      email: email,
      description: description,
      imageUrl: imageUrl,
    });
  }
</script>

<Modal title="Edit meetup Data" on:cancel>
  <form on:submit|preventDefault={submitForm}>
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
    <!-- <Button type="submit">Save</Button> -->
  </form>
</Modal>

<style>
  form {
    width: 100%;
    /* max-width: 90%;
    margin: auto; */
  }
</style>
