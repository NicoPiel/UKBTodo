<template>
    <q-page class="row items-center justify-evenly">
        <TodoTable></TodoTable>
    </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import TodoTable from '../components/TodoTable.vue';

console.log('Loading index..');

export default defineComponent({
    name: 'IndexPage',
    components: {TodoTable},
});
</script>
