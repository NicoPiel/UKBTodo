<template>
    <div class="q-pa-md">
        <Suspense>
            <template #default>
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

        <q-page-sticky position="bottom" :offset="[18, 18]">
            <q-btn v-ripple fab icon="add" color="accent"/>
        </q-page-sticky>
    </div>
</template>

<script lang="ts">
import {ref} from 'vue';
import {Todo} from '../../src-electron/orm/entity/entities';

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
    {
        name: 'assigned_to',
        align: 'left',
        label: 'Zugewiesen zu',
        // Todo: wird nicht angezeigt
        field: 'UserId',
        sortable: true,
    },
    {
        name: 'created_at',
        align: 'left',
        label: 'Erstellt am',
        field: (row: Todo) => new Date(row.createdAt).toLocaleString('de'),
        sortable: true
    },
    {
        name: 'deadline',
        align: 'left',
        label: 'Zu erledigen bis',
        field: (row: Todo) => new Date(row.deadline).toLocaleString('de'),
        sortable: true
    },
];

let rows = [];

async function fillRows(): Promise<Todo[]> {
    let result = await window.myAPI.findAllTodos();

    result.forEach(async (_, i, a) => {
        a[i] = a[i].dataValues;
        a[i].UserId = await getUsername(a[i].UserId);
    });

    return result;
}

async function getUsername(id: number): Promise<string> {
    const user = await window.myAPI.findUserById(id);
    return user.dataValues.name;
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
