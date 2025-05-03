<template>
  <div class="home">
    <FormBuilder :initial="initialData" />
  </div>
</template>

<script setup lang="ts">
import { FormBuilder } from "@/widgets/FormBuilder";
import { initialData } from './constant'
</script>
