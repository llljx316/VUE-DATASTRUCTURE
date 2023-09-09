<template>
    <el-row class="fileProcess">
        <input type="file" id="fileInput" @change="handleFileUpload"
        style="display: none;" />
        <el-tooltip placement="top">
                    <template #content> 上传本网页生成JSON文件,重复保存前的操作 </template>
        <el-button class="btn-file" id="btn-upload" @click="openFileInput" type="success" circle>
        <el-icon><Upload/></el-icon>
        </el-button></el-tooltip>
        <el-tooltip placement="top">
          <template #content> 下载本次JSON数据,以便下次继续使用 </template>
          <el-button class="btn-file" id="btn-download" @click="downloadNodeManagerAsJson" type="info" circle>
            <el-icon><Download/></el-icon>
         </el-button>
        </el-tooltip>
          
    </el-row>
</template>

<script setup lang="ts">
    import { allNM,refreshPersonAndGroups } from './sharedArguements';
    import { Upload, Download } from '@element-plus/icons-vue'

    function openFileInput() {
      // 当按钮被点击时，触发文件上传元素的点击事件
      document.getElementById("fileInput").click();
    }

    function handleFileUpload(event) {
      // 当用户选择文件后，将文件内容读取为字符串并传递给 importDefaultData 函数
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target.result;
          allNM.import(fileContent);
          
          refreshPersonAndGroups()
        };
        //renew_lists
        
        reader.readAsText(selectedFile);
        
      }

    }
    //文件下载
    function convertNodeManagerToJson() {
      let serializedNodes = []
      allNM.nodes.forEachSimple((node) => {
        serializedNodes.push(node.toJsonableObject());
      });

      return {
        nextId: allNM.getNextId(),
        nodes: serializedNodes,
      };
    }

    function downloadNodeManagerAsJson() {
      const nodeManagerData = convertNodeManagerToJson();

      // 创建一个 Blob 对象，用于保存 JSON 数据
      const blob = new Blob([JSON.stringify(nodeManagerData)], { type: 'application/json' });

      // 创建一个下载链接
      const url = URL.createObjectURL(blob);

      // 创建一个虚拟的下载链接并模拟点击
      const a = document.createElement('a');
      a.href = url;
      a.download = 'node-manager-data.json'; // 文件名
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      // 清除 Blob 和链接对象
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
</script>