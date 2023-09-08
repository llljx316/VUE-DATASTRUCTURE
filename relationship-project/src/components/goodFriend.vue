<template>
    <div  class="info-item border-item">
        <el-table
        id="name-table"
        :data="tableData"
        @cell-click="handleCellClick"
        >
        <el-table-column
            prop="name"
            label="好友姓名"
        ></el-table-column>
        <el-table-column
            prop="details"
            label="关系详情"
        ></el-table-column>
        </el-table>
    </div>
    </template>
    
    <script lang="ts">
    export default {
    data() {
        return {
        tableData: [
            { name: "Alice", details: "0"},
            { name: "Bob", details: "0"},
            { name: "Charlie", details: "0"},
        ],
        };
    },
    methods: {
        handleCellClick(row:number, column:number, event:any) {
        // 处理单元格点击事件，你可以在这里执行你的自定义逻辑
        console.log("Cell clicked:", row, column, event);
        },
    },
    };
    </script>
    
    <style>
        
    </style>