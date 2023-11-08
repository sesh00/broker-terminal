<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: left; /* Align text to the left */
  color: #2c3e50;
  margin-top: 10px;
}

header {
  line-height: 1.5;
  text-align: left; /* Align text to the left */
}

.logo {
  display: block;
  margin: 0 0 2rem 0; /* Adjust margin as needed */
}

@media (min-width: 1024px) {
  header {
    display: flex;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
