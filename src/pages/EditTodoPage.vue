<template>
    <Suspense>
        <q-page class="row items-center justify-evenly">
            <EditTodoForm/>
        </q-page>
    </Suspense>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import EditTodoForm from 'components/EditTodoForm.vue';

export default defineComponent({
    name: 'EditTodoPage',
    components: {EditTodoForm},
});
</script>

<style scoped>

</style>
