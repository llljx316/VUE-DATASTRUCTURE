<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
// import users from './components/users.vue'
import AllInfo from './components/AllInfo.vue'
import graph from './components/graph.vue'

</script>

<template>

 
  <el-container>
    
    <el-main>
      <h1 style="margin-top: 0px; margin-bottom: 10px; font-size:xx-large; text-align: center; z-index: 1; color:rgba(0, 175, 0, 0.959)">社交关系网络</h1>
      <main style="width: 93vw; height:80vh; "> 
        <el-row id="main-ele" :gutter="10" style="width: 93vw;  height: 80vh; border-style:solid; justify-items: center; background-color: azure;
            border-width:5px; border-radius: 20px;">
          <el-col :span="12" style="height: 80vh;"><graph/></el-col>
          <el-col :span="12" style="height: 80vh; "><AllInfo /></el-col>
        </el-row>
        
      </main>
    </el-main>
      
  </el-container>
</template>

<style>





</style>
