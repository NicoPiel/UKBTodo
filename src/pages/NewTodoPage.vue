<template>
    <Suspense>
        <q-page class="row items-center justify-evenly">
            <NewTodoForm/>
        </q-page>
    </Suspense>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import NewTodoForm from 'components/NewTodoForm.vue';

export default defineComponent({
    name: 'NewTodoPage',
    components: {NewTodoForm},
});
</script>

<style scoped>

</style>
