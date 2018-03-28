<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:300');
@import '/fontello.css';

body, html {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}
</style>
