<script setup lang="ts">
import { __cancelSelectionDisp, __activePartGraph } from './sharedArguements';

function handleCancelSelection(){
    __cancelSelectionDisp.value = false
    __activePartGraph.value = false
}


</script>

<template>
    <el-row class="border-item">
        <el-button type="primary" @click="handleCancelSelection"
        v-if = '__cancelSelectionDisp'>取消选择</el-button>
    </el-row>
</template>

<style scoped>
    .el-row{
        background-color:azure;
        min-height:150px;
    }
</style>