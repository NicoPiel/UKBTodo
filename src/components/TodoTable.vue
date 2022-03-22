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
        field: (row) => row.dataValues.id,
    },
    {
        name: 'description',
        required: true,
        label: 'Beschreibung',
        align: 'left',
        field: (row) => row.dataValues.description,
    },
    {name: 'issued_by', align: 'left', label: 'Für', field: (row) => row.dataValues.issued_by, sortable: true},
    //{name: 'assigned_to', label: 'Zugewiesen zu', field: (row: Todo) => row.assigned_to, sortable: true},
    {name: 'deadline', align: 'left', label: 'Zu erledigen bis', field: (row) => row.dataValues.deadline, sortable: true},
];

// Todo: This is the issue

async function getRows() {
    return window.myAPI.findAllTodos();
}


export default {
    async setup() {
       console.log('Getting rows');
        const rows = await getRows();

        console.log('Got rows.');

        for (const row of rows) {
            console.log(row.dataValues.id);
        }

        console.log(rows);
        console.log('Printed rows.');


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
