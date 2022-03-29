<template>
    <div class="q-pa-md">
        <q-table
            class="todo-table"
            title="ToDos"
            :rows="rowStatus"
            :columns="columns"
            row-key="id"
            style="height: 65vw; width: 95vw;"
            virtual-scroll
            :virtual-scroll-sticky-size-start="48"
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
        >

            <template #body-cell-actions="props">
                <q-td key="actions" :props="props" auto-width>
                    <q-btn size="md" color="secondary" round dense icon="done"
                           @click="async () => await destroy(props.row.id)"/>
                    <q-btn to="/todo/{{ props.row.id }}/edit" size="md" color="secondary" round dense icon="edit"/>
                </q-td>
            </template>


        </q-table>
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
    {name: 'info', align: 'left', label: 'Zusatzinfo', field: 'info'},
    {name: 'issued_by', align: 'left', label: 'Für', field: 'issued_by', sortable: true},
    {
        name: 'assigned_to',
        align: 'left',
        label: 'Zugewiesen zu',
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
    {
        name: 'actions',
        label: 'Optionen'
    },
];

let rows;

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

async function destroy(id) {
    await window.myAPI.deleteTodoById(id);
    console.log('Deleted row ' + id);
    window.myAPI.reloadFocusedWindow();
}

export default {
    async setup() {
        const rowStatus = ref([]);

        rowStatus.value = await fillRows();

        return {
            columns,
            rows,
            rowStatus,
            pagination: ref({
                rowsPerPage: 0,
            }),
            destroy
        };
    },
};
</script>
