<template>
  <div class="user-profile">
    <scu-headline id="details-title" element="h2"
      >Your User Details:</scu-headline
    >
    <img :src="this.$auth.user.picture" alt="No image available" />
    <scu-headline id="name" element="h3"
      >Name: {{ this.$auth.user.name }}
    </scu-headline>
    <scu-headline id="email" element="h3"
      >Email: {{ this.$auth.user.email }}
    </scu-headline>
  </div>
</template>
<style scoped></style>
