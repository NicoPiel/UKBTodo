<template>
    <q-page class="row items-center justify-evenly">
        <Suspense>
            <template #default>
                <TodoTable/>
            </template>
            <template #fallback>
                <q-circular-progress
                    indeterminate
                    size="50px"
                    :thickness="0.22"
                    color="lime"
                    track-color="grey-3"
                    class="q-ma-md"
                />
            </template>
        </Suspense>

        <q-page-sticky position="bottom" :offset="[96, 96]">
            <q-btn to="/todo/new" v-ripple fab icon="add" color="accent"/>
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
