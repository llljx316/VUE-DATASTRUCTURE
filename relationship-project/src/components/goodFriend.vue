<template>
    <div  class="info-item border-item">
        <el-table
        id="name-table"
        :data="friendNow"
        @cell-click="handleCellClick"
        v-if="__activePartGraph"
        >
        <el-table-column
            prop="name"
            label="好友姓名"
        ></el-table-column>
        
        <el-table-column label="操作" align="center" min-width="100">
            <template #default="scope">
                <!-- {{ scope.row.date }} -->
                <el-button type="text" @click="deleteOp(scope.row)">删除关系</el-button>
            </template>
        </el-table-column>

        </el-table>

        <el-table
        id="group-table"
        :data="groupNow"
        @cell-click="handleCellClick"
        v-if="__activePartGraph"
        >
        <el-table-column
            prop="name"
            label="群组名称"
        ></el-table-column>
        
        <el-table-column label="操作" align="center" min-width="100">
            <template #default="scope">
                {{ scope.row.date }}

            <el-button type="text" @click="deleteOp(scope.row)">删除关系</el-button>

            </template>
        </el-table-column>

        </el-table>

    </div>
    </template>
    
    <script setup lang="ts">
        import { __activePartGraph,friendNow, groupNow, allNM, __partGraphCenter } from './sharedArguements';
        import { ref } from 'vue'
        import {ElMessageBox} from 'element-plus'

        function deleteOp(node:any){
            ElMessageBox.confirm('确定要删除吗？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
            .then(() => {
                // 用户点击了确定按钮，执行删除操作
                __partGraphCenter.value.removeRelation(node)
            })
            .catch(() => {
                // 用户点击了取消按钮或在对话框之外点击，不执行任何操作
            });
            
        }

        //click有时间就弄

        function handleCellClick(){
            console.log('click')
        }
    </script>
    
    <style>
        
    </style>