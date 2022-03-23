<template>
    <div class="q-pa-md">
        <q-table
            class="todo-table"
            title="ToDos"
            :rows="rows"
            :columns="columns"
            row-key="id"
            fullscreen
            virtual-scroll
            :virtual-scroll-sticky-size-start="48"
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
        />
    </div>
</template>

<script lang="ts">
import {ref} from 'vue';

const columns = [
    {
        name: 'id',
        label: '#',
        required: true,
        field: 'id',
        sortable: true
    },
    {
        name: 'description',
        required: true,
        label: 'Beschreibung',
        align: 'left',
        field: 'description',
    },
    {name: 'issued_by', align: 'left', label: 'Für', field: 'issued_by', sortable: true},
    {name: 'assigned_to', label: 'Zugewiesen zu', field: 'assigned_to'},
    {name: 'deadline', align: 'left', label: 'Zu erledigen bis', field: 'deadline', sortable: true},
];

let rows = [];

async function getRows() {
    return window.myAPI.findAllTodos();
}

async function fillRows() {
    console.log('Getting rows');
    let result = await getRows();

    console.log('Got rows.');

    result.forEach((o, i, a) => {
        a[i] = a[i].dataValues;
    });

    console.log(result);
    console.log('Printed rows.');

    return result;
}

export default {
    async setup() {
        rows = await fillRows();

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

<style lang="sass">
.todo-table
    /* height or max-height is important */
    max-height: 1080px

    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #fff

    thead tr th
        position: sticky
        z-index: 1
    /* this will be the loading indicator */










    thead tr:last-child th
        /* height of all previous header rows */
        top: 48px

    thead tr:first-child th
        top: 0
</style>
