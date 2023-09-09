<script setup lang="ts">
    import users from './users.vue'
    import groups from './groups.vue'
    import goodFrend from './goodFriend.vue'
    import information from './information.vue'
</script>

<template>
    <div class="allinfoItem">
        <el-row class="flex-row-up" :gutter="3">
            <el-col class="info-item" :span="8" ><users/></el-col>
            <el-col class="info-item" :span="8"><groups/></el-col>
            <el-col class="info-item" :span="8"><goodFrend/></el-col>
        </el-row>
        <el-row class="down-info">
            <el-col class="info-item-down"><information/></el-col>
        </el-row>
    </div>
    
    
    
</template>

<style>
    .flex-row-up{
        flex:2;
        display: flex;
        flex-direction: row; 
        align-items: center;
        justify-items: center;
        /* gap:10px */
    }
    .allinfoItem{
        display: flex;
        gap:15px;
        flex-direction: column;
        flex-shrink: 1;
        height:95%;
        justify-items :center;
        margin-top: 10px; /* 设置上边距 */
        margin-bottom: 10px; /* 设置下边距 */
    }
    
    

    .down-info{
        flex:1;
    }
    

    .up-item{
      display:flex;
      flex-direction:column;
      justify-content:center;
      flex-shrink: 1;
    }

    .upper-item{
        flex: 1;
    }

    .info-item{
        /* flex:1; */
        height: 100%; 



    }

    .info-item-down{
        flex:1;
        height:100%;
    }

    

 
    

    
</style>
