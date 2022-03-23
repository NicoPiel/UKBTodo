<template>
    <q-page class="row items-center justify-evenly">
        <todo-table></todo-table>
        <q-page-sticky position="bottom" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent"/>
        </q-page-sticky>
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
