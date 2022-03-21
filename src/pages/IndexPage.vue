<template>
    <q-page class="row items-center justify-evenly">
        <todo-table></todo-table>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TodoTable from '../components/TodoTable.vue';

export default defineComponent({
    name: 'IndexPage',
    components: { TodoTable },
});
</script>
