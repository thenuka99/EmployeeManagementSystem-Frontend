<template>
  <div class="heading text-left py-4 pl-4 font-semibold">Designations</div>
  <ul class="px-3 pb-2 divide-y divide-slate-300">
    <li v-for="designation in designationState.designations" v-bind:key="designation._id"
      class="text-left px-1 font-normal ">
      <router-link :to="{ name: 'userByDesignation', params: { id: designation._id }, query: { page: 1 }, }">
        <button>{{ designation.name }}</button>
      </router-link>
    </li>
  </ul>
</template>
 
<script>
import { mapGetters } from 'vuex';

export default {
  computed: mapGetters({
    designationState: "getDesignationState",
  }),
  created: function () {
    this.$store.dispatch("getAllDesignations");
  },
}
</script>
 