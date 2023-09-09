<template>
    <div  class="up-texture">
        <h5 v-if="__activePartGraph">已有的好友和群组</h5>
        <el-table
        :class="__activePartGraph&&__partGraphCenter.tag==NodeTag.PERSON?'table-item-half':'table-item-half-full'"
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
        class="table-item-half down-half"
        :data="groupNow"
        @cell-click="handleCellClick"
        v-if="__activePartGraph&&__partGraphCenter.tag==NodeTag.PERSON"
        style="border-radius: 20px;
            overflow: hidden;
            border-collapse: collapse;"
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
        import { NodeTag } from './dataStructure/NodeBase';

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
    
    <style scoped>

        .table-item-half-full{
            width:100%;
            height: 92%;
        }
        
        .table-item-half{
            width:100%;
            height:46%;
        }

        
        
    </style>