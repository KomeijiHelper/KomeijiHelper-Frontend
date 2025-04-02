<template>
  <div id="app">
    <h1>Vue Chat Room</h1>
    <Chat />
  </div>
</template>

<script>
import Chat from '../components/Chat.vue';

export default {
  components: {
    Chat,
  },
};
</script>

<style>
#app {
  text-align: center;
}
</style>
