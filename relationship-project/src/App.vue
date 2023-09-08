<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
// import users from './components/users.vue'
import AllInfo from './components/AllInfo.vue'
import graph from './components/graph.vue'

</script>

<template>
  
  <el-container>
    <el-header style="width: 95vw; height:2vh">
        社交关系网络
    </el-header>

    <el-main>
      <main style="width: 95vw; height:80vh"> 
        <el-row id="main-ele" :gutter="10" style="width: 100%;  height: 100%; border-style:solid;
            border-width:5px; border-radius: 20px;">
          <el-col :span="12" style="width: 50%; height: 100%;"><graph/></el-col>
          <el-col :span="12" style="width: 50%; height: 100%; "><AllInfo /></el-col>
        </el-row>
        
      </main>
    </el-main>
      
  </el-container>
</template>

<style>
main,
#main-ele{
  /* justify-content:flex-start; */
  align-items:center; 
}

.border-item{
    border-style:solid;
    border-width:5px;
    border-radius: 20px;
    /* padding:1%; */
}
</style>
