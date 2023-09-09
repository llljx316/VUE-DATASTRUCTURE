<template>
<div class="up-texture">

    <h5>个人</h5>

    <el-table
        ref="multipleTableRef"
        class="table-person"
        :data="personStorage"
        @selection-change="handleCheckChange"
        @row-click="handleRowClick"
        
    >
        <el-table-column type="selection" width="100" />
        <el-table-column property="name" label="name" />
    </el-table>

    <!-- 添加按键 -->
    <div class="bottom-ele">
      <!-- <el-col :span="12"> -->
        <el-button
          @click="showDialog" type="primary"><el-icon><Plus/></el-icon></el-button>
          <!-- </el-col> -->
        <el-dialog
            title="请输入添加人信息"
            v-model="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
          <!-- <template> -->
              <span class="dialog-body">
                <div>请输入姓名:</div>
                <div style="display: flex; flex-direction: row;">
                  <el-tooltip placement="top" :disabled="NoEmpty">
                    <template #content> 不允许输入空字符串 </template>
                    <el-input v-model='input_user' placeholder="不能为空" clearable />
                  </el-tooltip>
                  <el-icon v-show="NoEmptyRev" style="color:red"><WarningFilled /></el-icon>
                </div>
                <div class="add-marg">请选择普通组织（可多个）:</div>
                <el-select v-model='selectedOrd' class="m-2" placeholder="不选为没有" multiple clearable>
                  <el-option
                    v-for="item in treeOrd"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                
                

                <div class="add-marg">请选择小学:</div>
                <el-select v-model='selectedPri' class="m-2" placeholder="不选为没有" multiple clearable>
                    <!-- <el-option :value="null" label="空选项"></el-option>     -->
                  <el-option
                    v-for="item in treePrimary"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>

                <div class="add-marg">请选择初中:</div>
                <el-select v-model='selectedMid' class="m-2" placeholder="不选为没有" multiple clearable >
                    <!-- <el-option :value="null" label="空选项"></el-option>     -->
                  <el-option
                    v-for="item in treeMiddle"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>

                <div class="add-marg">请选择高中:</div>
                <el-select v-model='selectedHig' class="m-2" placeholder="不选为没有" multiple clearable >
                  <el-option
                    v-for="item in treeHigh"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>

                <div class="add-marg">请选择大学:</div>
                <el-select v-model='selectedUni' class="m-2" placeholder="不选为没有"  multiple clearable>
                  <el-option
                    v-for="item in treeUni"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <div class="add-marg">请选择朋友:</div>
                <el-select v-model='selectedFri' class="m-2" placeholder="不选为没有" multiple clearable>
                  <el-option
                    v-for="item in personStorage"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                
                
              </span>
              <template #footer>
                <div class="flex-row">
                  <el-button type="default" @click="clear" class="add-marg">清空</el-button>
                  <el-button type="primary" @click="confirmDialog" class="add-marg">确定</el-button>
                </div>
              </template>
          <!-- </template> -->
          </el-dialog>
        

    <!-- 删除的按键以及操作 -->
      <!-- <el-col :span="11">           -->
        <el-button @click="handleDeleteSelected" type="danger" :disabled="deleteDisabled"><el-icon><Delete/></el-icon></el-button>
        <!-- </el-col> -->
      </div>

</div>
</template>

<script setup lang="ts">
import { treePrimary,treeMiddle,treeHigh,treeUni,treeOrd, allNM, __activePartGraph, __partGraphCenter
,__cancelSelectionDisp, personStorage, deleteItemMult } from './sharedArguements';
import {ref,computed, reactive} from 'vue'
import {PersonNode} from './dataStructure/PersonNode'
import type { FreeKeyObject } from './dataStructure/FreeKeyObject';
import type { NodeBase } from './dataStructure/NodeBase';
import {Plus,Delete,WarningFilled} from '@element-plus/icons-vue'

const deleteDisabled = computed(()=>{return node_selected.value.length==0})


const selectedOrd = ref([])//注意默认读取字符串
const selectedPri = ref([])
const selectedMid = ref([])
const selectedHig = ref([])
const selectedUni = ref([])
const selectedFri = ref([])

const selectedEle = [selectedOrd, selectedPri, selectedMid, selectedHig,selectedUni, selectedFri]
const input_user = ref('')

//显示数组
const dialogVisible = ref(false)

//输入错误处理
const NoEmpty = ref(true)
const NoEmptyRev = computed(()=>{
  return !NoEmpty.value
})

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
    //输入为空的处理
    if(input_user.value.trim()==''){
      NoEmpty.value = false
      return
    }

    NoEmpty.value = true

    const newPerson = new PersonNode(input_user.value)

    //添加关系
    selectedEle.forEach((selectedItem) => {
      selectedItem.value.forEach((id)=>{
        formRelation(newPerson,allNM.getNodeById(id))
      })
    })
    // 

    
    //添加到显示数组中（也当表格）
    personStorage.value.push(newPerson)

    //添加指针到管理器
    allNM.insert(newPerson)

    clear()

    //关闭
    handleClose()
    dialogVisible.value = false;

    
}


//应该是node的数组
const node_selected:any = ref([])

const handleCheckChange = (
    data: FreeKeyObject
) => {
        node_selected.value = data
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
        deleteItemMult(personStorage.value,node_selected.value)
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
    item.value=[]
  })
}

</script>

<style scoped>

    .bottom-ele{
      display:flex;
      justify-content: center;
      flex-flow:true;
      flex-shrink:true;
      gap:3px;
      margin:5px;
    }

    .bottom-ele .el-button{
      flex:1 ;
    }

    /* .flex-row{
      margin-top: 20px;
    } */
    .table-person{
      height:43vh;
      overflow:auto;
      border-radius: 20px;
    }

    
    

    
    
</style>

