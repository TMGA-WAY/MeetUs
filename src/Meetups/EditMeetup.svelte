<script>
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty, isValidEmail } from "../helpers/validation.js";

  let title = "";
  let titleValid = false;
  let subtitle = "";
  let subtitileValid = false;
  let address = "";
  let addressValid = false;
  let imageUrl = "";
  let imageUrlValid = false;
  let description = "";
  let descriptionValid = false;
  let email = "";
  let emailValid = false;
  let formIsValid = false;

  const dispatch = createEventDispatcher();

  $: titleValid = !isEmpty(title);
  $: subtitileValid = !isEmpty(subtitle);
  $: addressValid = !isEmpty(address);
  $: imageUrlValid = !isEmpty(imageUrl);
  $: descriptionValid = !isEmpty(description);
  $: emailValid = isValidEmail(email);

  $: formIsValid =
    titleValid &&
    subtitileValid &&
    addressValid &&
    imageUrl &&
    descriptionValid &&
    emailValid;

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

  function cancelForm() {
    dispatch("cancel");
  }
</script>

<Modal title="Edit meetup Data" on:cancel>
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      id="titile"
      label="Title"
      type="text"
      valid={titleValid}
      validityMessage="Please enter a valid title"
      value={title}
      on:input={(event) => (title = event.target.value)}
    />

    <TextInput
      id="subtitile"
      label="Subtitle"
      type="text"
      valid={subtitileValid}
      validityMessage="Please enter a valid subtitle"
      value={subtitle}
      on:input={(event) => (subtitle = event.target.value)}
    />

    <TextInput
      id="address"
      label="Address"
      type="text"
      valid={addressValid}
      validityMessage="Please enter a valid address"
      value={address}
      on:input={(event) => (address = event.target.value)}
    />

    <TextInput
      id="imageUrl"
      label="ImageUrl"
      type="text"
      valid={imageUrl}
      validityMessage="Please enter a valid image Url"
      value={imageUrl}
      on:input={(event) => (imageUrl = event.target.value)}
    />

    <TextInput
      id="description"
      label="Description"
      controlType="textarea"
      valid={descriptionValid}
      validityMessage="Please enter a valid Description"
      bind:value={description}
      type="text"
      on:input={(event) => (description = event.target.value)}
    />

    <TextInput
      id="email"
      label="Email"
      value={email}
      type="email"
      valid={emailValid}
      validityMessage="Please enter a valid Email"
      on:input={(event) => (email = event.target.value)}
    />
  </form>
  <div slot="footer">
    <Button type="button" on:click={submitForm} disabled={!formIsValid}
      >Save</Button
    >
    <Button type="button" mode="outline" on:click={cancelForm}>Cancel</Button>
  </div>
</Modal>

<style>
  form {
    width: 100%;
    /* max-width: 90%;
    margin: auto; */
  }
</style>
