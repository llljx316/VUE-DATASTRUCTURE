<script setup lang="ts">
    import users from './users.vue'
    import groups from './groups.vue'
    import goodFrend from './goodFriend.vue'
    import information from './information.vue'
</script>

<template>
    <el-row class="up-info">
        <el-col :span="24"><information/></el-col>
    </el-row>
    <el-row :gutter="5" class="down-info">
        <el-col class="info-item" :span="8"><users/></el-col>
        <el-col class="info-item" :span="8"><groups/></el-col>
        <el-col class="info-item" :span="8"><goodFrend/></el-col>
    </el-row>
    
    
</template>

<style scoped>
    .up-info{
        /* margin-bottom: 5px; */
        margin-top: 2px;
        background-color:azure;
        height:30%;
    }

    .down-info{
        /* margin-bottom: 2px; */
        /* padding-right: 1%; */
        &:last-child{
            margin-bottom: 0;
        }
        background-color:azure;
        height: 69%;
    }

    .info-item{
        background-color:azure;
        min-height:95%
        /* margin-right: 2px; */
    }

    .border-item{
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 0%;
        height:95%
    }

    

 

    /* .el-col{
        border-style:solid;
        border-width:5px;
        border-radius: 20px;
    } */

    .el-table,
    .el-tree{
        height: 60%;
        overflow-y: auto; /* 启用垂直滚动条 */
    }
</style>
