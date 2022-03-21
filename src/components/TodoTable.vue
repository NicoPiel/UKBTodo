<template>
    <div class="q-pa-md">
        <q-table
            title="ToDos"
            :rows="rows"
            :columns="columns"
            row-key="id"
            fullscreen
            virtual-scroll
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
        />
    </div>
</template>

<script lang="ts">
import {Todo} from '../../src-electron/orm/entity/entities';
import {ref} from 'vue';

const columns = [
    {
        name: 'id',
        label: '#',
        field: (row: Todo) => row.id,
    },
    {
        name: 'description',
        required: true,
        label: 'Beschreibung',
        align: 'left',
        field: (row: Todo) => row.description,
        format: (val) => `${val}`,
        sortable: true,
    },
    {name: 'issued_by', align: 'center', label: 'Für', field: (row: Todo) => row.issued_by, sortable: true},
    {name: 'assigned_to', label: 'Zugewiesen zu', field: (row: Todo) => row.assigned_to, sortable: true},
    {name: 'deadline', label: 'Zu erledigen bis', field: (row: Todo) => row.deadline, sortable: true},
];

// Todo: This is the issue
const rows = window.myAPI.findAllTodos();

export default {
    setup() {
        return {
            columns,
            rows,
            pagination: ref({
                rowsPerPage: 0,
            }),
        };
    },
};
</script>
