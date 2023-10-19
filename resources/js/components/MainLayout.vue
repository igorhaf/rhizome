<!-- resources/js/components/MainLayout.vue -->

<template>
    <div class="h-screen flex flex-col">
        <header-component></header-component>
        <div class="flex-1 flex">
            <column-one class="w-64 bg-gray-200"></column-one>
            <column-two class="flex-grow bg-gray-300"></column-two>
            <column-three class="w-64 bg-gray-200"></column-three>
        </div>
        <footer-component></footer-component>
    </div>
</template>

<script>
import HeaderComponent from "./HeaderComponent.vue";
import FooterComponent from "./FooterComponent.vue";
import ColumnOne from "./ColumnOne.vue";
import ColumnTwo from "./ColumnTwo.vue";
import ColumnThree from "./ColumnThree.vue";

export default {
    components: {
        HeaderComponent,
        FooterComponent,
        ColumnOne,
        ColumnTwo,
        ColumnThree
    }
}
</script>
