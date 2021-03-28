<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { RequireVue } from '@/modules/core/constants';

// tslint:disable-next-line:no-var-requires
const { BDropdown, BDropdownItem } = require('buefy/dist/components/dropdown') as RequireVue;
// tslint:disable-next-line:no-var-requires
const { BIcon } = require('buefy/dist/components/icon') as RequireVue;

@Component({ components: { BDropdown, BDropdownItem, BIcon }})
export default class extends Vue {}
</script>

<template>
    <div>
        <b-dropdown aria-role="list">
            <button class="button is-primary" slot="trigger" slot-scope="{ active }">
                <span>Click me!</span>
                <BIcon :icon="active ? 'chevron-up' : 'chevron-down'" />
            </button>

            <b-dropdown-item aria-role="listitem">Action</b-dropdown-item>
            <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
            <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
        </b-dropdown>
    </div>
</template>