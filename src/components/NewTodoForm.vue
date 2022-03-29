<template>
    <div class="q-gutter-y-md column">
        <q-input autogrow clearable outlined v-model="description" label="Beschreibung"/>
        <q-input autogrow clearable outlined v-model="info" label="Zusatzinfo"/>
        <q-input autogrow clearable outlined v-model="issued_by" label="Für"/>
        <div class="row">
            <q-date v-model="date_only"/>
            <q-time v-model="time" @update:model-value="printTime"/>
        </div>

    </div>
</template>

<script setup lang="ts">
import {Ref, ref, UnwrapRef} from 'vue';

const description: Ref<UnwrapRef<string>> = ref('');
const info: Ref<UnwrapRef<string>> = ref('');
const issued_by: Ref<UnwrapRef<string>> = ref('');
const date_only: Ref<UnwrapRef<string>> = ref('');
const time: Ref<UnwrapRef<string>> = ref('');

const date = new Date(Date.parse(date_only.value.replaceAll('/', '-')));


function printTime() {
    console.log(Date.parse(date_only.value.replaceAll('/', '-')));
    console.log(time.value);
    console.log(Number.parseInt(time.value.split(':')[0]));
    console.log(Number.parseInt(time.value.split(':')[1]));
    console.log(date);
}

</script>
