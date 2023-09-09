<template>
<div class="info-item border-item">
    <!-- <el-table
    id="name-table"
    :data="tableData"
    @cell-click="handleCellClick"
    >
    <el-table-column
        prop="name"
        label="姓名"
    ></el-table-column>
    </el-table> -->

    <el-table
        ref="multipleTableRef"
        class="table-item"
        :data="personStorage"
        style="width: 100%"
        @selection-change="handleCheckChange"
        @row-click="handleRowClick"
    >
        <el-table-column type="selection" width="100" />
        <el-table-column property="name" label="name" />
    </el-table>
    <!-- <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])"
        >Toggle selection status of second and third rows</el-button
        >
        <el-button @click="toggleSelection()">Clear selection</el-button>
    </div> -->

    <!-- 添加按键 -->
    <div class="bottom-ele">
      <el-col :span="12">
        <el-button class="bottom-button" 
          @click="showDialog" type="primary">添加</el-button>
          </el-col>
        <el-dialog
            title="请输入添加人姓名"
            v-model="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
          <template #footer>
              <span class="dialog-footer" >
                <el-input v-model='input_user' placeholder="请输入姓名" clearable />
                <div>请选择普通组织（可多个）:</div>
                <el-select v-model='selectedOrd' class="m-2" placeholder="不选为没有" multiple clearable>
                  <el-option
                    v-for="item in treeOrd"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                
                

                <div>请选择小学:</div>
                <el-select v-model='selectedPri' class="m-2" placeholder="不选为没有">
                    <!-- <el-option :value="null" label="空选项"></el-option>     -->
                  <el-option
                    v-for="item in treePrimary"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>

                <div>请选择初中:</div>
                <el-select v-model='selectedMid' class="m-2" placeholder="不选为没有" >
                    <!-- <el-option :value="null" label="空选项"></el-option>     -->
                  <el-option
                    v-for="item in treeMiddle"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>

                <div>请选择高中:</div>
                <el-select v-model='selectedHig' class="m-2" placeholder="不选为没有" >
                  <el-option
                    v-for="item in treeHigh"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>

                <div>请选择大学:</div>
                <el-select v-model='selectedUni' class="m-2" placeholder="不选为没有" >
                  <el-option
                    v-for="item in treeUni"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
                <div>请选择朋友:</div>
                <el-select v-model='selectedFri' class="m-2" placeholder="不选为没有" multiple clearable>
                  <el-option
                    v-for="item in personStorage"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>

                <el-button @click="clear">清空</el-button>
                <el-button type="primary" @click="confirmDialog">确定</el-button>
              </span>
          </template>
          </el-dialog>
        

    <!-- 删除的按键以及操作 -->
      <el-col :span="11">          
        <el-button @click="handleDeleteSelected" type="danger">删除选中</el-button>
        </el-col>
      </div>

</div>
</template>

<script setup lang="ts">
import { treePrimary,treeMiddle,treeHigh,treeUni,treeOrd, allNM, __activePartGraph, __partGraphCenter
,__cancelSelectionDisp, personStorage, deleteItemMult } from './sharedArguements';
import {ref,reactive} from 'vue'
import {PersonNode} from './dataStructure/PersonNode'
import type { FreeKeyObject } from './dataStructure/FreeKeyObject';
import {ElMessageBox } from 'element-plus'
import type { NodeBase } from './dataStructure/NodeBase';


const selectedOrd = ref([])//注意默认读取字符串
const selectedPri = ref()
const selectedMid = ref()
const selectedHig = ref()
const selectedUni = ref()
const selectedFri = ref([])

const selectedEle = [selectedOrd, selectedPri, selectedMid, selectedHig,selectedUni, selectedFri]
const input_user = ref('')

//显示数组
const dialogVisible = ref(false)

function handleCellClick(row:number, column:number, event:any) {
    // 处理单元格点击事件，你可以在这里执行你的自定义逻辑
    console.log("Cell clicked:", row, column, event);
}

//简单的函数直接抄
function showDialog() {
    dialogVisible.value = true;
}

function handleClose(){
  dialogVisible.value = false;

}

/**
 * 形成关系
 */
function formRelation(NodeBase:any, node:any){
    if(node==null) return
    NodeBase.addRelation(node)     
    

}

function confirmDialog(){
    console.log(selectedOrd)
    const newPerson = new PersonNode(input_user.value)

    //添加关系
    selectedOrd.value.forEach((id)=>{
        const item = allNM.getNodeById(id)
        formRelation(newPerson,item)
    })
    formRelation(newPerson,selectedPri.value)
    formRelation(newPerson,selectedMid.value)
    formRelation(newPerson,selectedHig.value)
    formRelation(newPerson,selectedUni.value)
    // if(selectedFri.value != undefined){
      selectedFri.value.forEach((id)=>{
        formRelation(newPerson,allNM.getNodeById(id))
      })
    // }

    
    //添加到显示数组中（也当表格）
    personStorage.push(newPerson)

    //添加指针到管理器
    allNM.insert(newPerson)

    clear()

    //关闭
    handleClose()
    dialogVisible.value = false;

    
}


//应该是node的数组
let node_selected:any = []

const handleCheckChange = (
    data: FreeKeyObject
) => {
        node_selected = data
        console.log(data)
    }

//删除的处理
function handleDeleteSelected(){
    ElMessageBox.confirm('确定要删除吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        // 用户点击了确定按钮，执行删除操作
        // deleteItems();
        deleteItemMult(personStorage,node_selected)
      })
      .catch(() => {
        // 用户点击了取消按钮或在对话框之外点击，不执行任何操作
      });
}



const handleRowClick = (row:any) => {
  __partGraphCenter.value = row
  __activePartGraph.value = true
  __cancelSelectionDisp.value = true
}

/**
 * 清除输入的值
 */
function clear(){
  input_user.value=''
  selectedEle.forEach((item,index)=>{
    if(index==0||index==5) item.value=[]
    else item.value=null
  })
}

</script>

<style scoped>
    .info-item{
        display: flex;
        flex-direction: column;
    }

    
    .bottom-button {
        /* text-align: center; */
        /* position: fixed; */
        margin-bottom: 0%;
        /* background-color: #fff; */
        /* border-top: 1px solid #ccc; */
    }
</style>

