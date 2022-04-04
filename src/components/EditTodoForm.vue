<template>
    <div class="q-gutter-y-md column">
        <q-input autogrow clearable outlined v-model="description" label="Beschreibung"/>
        <q-input autogrow clearable outlined v-model="info" label="Zusatzinfo"/>
        <q-input autogrow clearable outlined v-model="issued_by" label="Zu erledigen für:"/>
        <q-input autogrow clearable outlined v-model="created_by" label="Erstellt durch:"/>
        <q-select clearable outlined v-model="assigned_to" label="Zugewiesen zu" :options="options" emit-value/>
        <div class="row">
            <q-date v-model="date" mask="YYYY-MM-DD HH:mm"/>
            <q-time v-model="date" mask="YYYY-MM-DD HH:mm"/>
        </div>
        <q-btn label="Speichern" color="primary" @click="submit" ripple rounded to="/"></q-btn>
    </div>
</template>

<script lang="ts">
import {Ref, ref, UnwrapRef} from 'vue';
import {Todo, User} from 'app/src-electron/orm/entity/entities';
import {useRoute} from 'vue-router';

let todo: Todo;

const description: Ref<UnwrapRef<string>> = ref('');
const info: Ref<UnwrapRef<string>> = ref('');
const issued_by: Ref<UnwrapRef<string>> = ref('');
const assigned_to: Ref<UnwrapRef<number>> = ref(null);
const created_by: Ref<UnwrapRef<string>> = ref('');
const date: Ref<UnwrapRef<number>> = ref(Date.now());
let options = [];

async function submit() {
    const newTodo = {
        description: description.value,
        issued_by: issued_by.value,
        info: info.value,
        deadline: new Date(date.value),
        UserId: assigned_to?.value,
        created_by: created_by.value,
    };

    await window.myAPI.updateTodo(todo.id, newTodo);
}

async function getUsers(): Promise<User[]> {
    return window.myAPI.findAllUsers();
}

export default {
    async setup() {
        const route = useRoute();
        todo = await window.myAPI.findTodoById(route.params.id);
        todo = todo.dataValues;

        description.value = todo.description;
        issued_by.value = todo.issued_by;
        info.value = todo.info;
        assigned_to.value = todo.UserId;
        date.value = new Date(todo.deadline).getTime();
        created_by.value = todo.created_by;

        const users: User[] = await getUsers();

        options = [];

        users.forEach((u, i, a) => {
            const user = u.dataValues;

            options.push({
                label: user.name,
                value: user.id,
            });
        });

        return {
            description,
            issued_by,
            info,
            assigned_to,
            date,
            created_by,
            options,
            todo,
            submit,
            getUsers
        }
    }
}

</script>
