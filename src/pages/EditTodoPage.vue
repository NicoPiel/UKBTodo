<template>
    <div>
        {{ $route.params.id }}
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'EditTodoPage',
    components: {},
});
</script>

<style scoped>

</style>
