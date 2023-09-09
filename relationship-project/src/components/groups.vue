<template>
    <!-- <h5 id = "head">群组信息</h5> -->
    <div class="up-texture">
      <h5>群组</h5>
      <el-tree 
        :data="treeDisplay"
        :props="defaultProps"
        lable="组别"
        id = "group-table"
        @node-click="handleNodeClick"
        :defaultExpandAll="true"
        :show-header="true"
        show-checkbox
        @check-change="handleCheckChange"
      ></el-tree>

    
    
    <!-- 添加按键 -->
    <div class="bottom-ele">
        <el-button class="bottom-button" 
          @click="showDialog" type="primary"><el-icon><Plus /></el-icon></el-button>
          <el-dialog
              title="添加群组"
              v-model="dialogVisible"
              width="30%"
              :before-close="handleClose"
          >
              <span class="dialog-body">
                <!-- 调整排版 -->
                <div>请输入群组名称:</div>
                <div style="display: flex; flex-direction: row;">
                  <el-tooltip placement="top" :disabled="NoEmpty">
                    <template #content> 不允许输入空字符串 </template>
                    <el-input v-model='input_name' placeholder="不能为空" clearable />
                  </el-tooltip>
                  <el-icon v-show="NoEmptyRev" style="color:red"><WarningFilled /></el-icon>
                </div>
                <!-- <el-input v-model="input_name" placeholder="不可以为空" clearable /> -->
                
                <div class="add-marg">请输入群组的影响力(默认为1): </div>
                <el-input-number v-model="input_rate" :precision="2" :step="0.1" :min="0"/>
                
                <div class="add-marg">请选择群组的类型</div>
                <el-select v-model='input_class' class="m-2" placeholder="不选为普通群组" >
                  <el-option
                    v-for="item in option_class"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
                <div class="add-marg">请选择已有个人数据中的群组成员: </div>
                <el-select v-model='userIdSelect' class="m-2" placeholder="不选则暂无朋友" multiple clearable >
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
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="confirmDialog">确 定</el-button>
                  </div>
                </template>
          </el-dialog>
        

    <!-- 删除的按键以及操作 -->      
          <el-button @click="handleDeleteSelected" type="danger" :disabled="disabledDelete"><el-icon><Delete /></el-icon></el-button>
      </div>
  </div>


  </template>
  
  <script setup lang="ts">
    // import {Edit} from '@element-plus/icons-vue'
    import {ref, reactive, computed} from 'vue'
    import { treePrimary,treeMiddle,treeHigh,treeUni,treeOrd, allNM,
      __activePartGraph, __cancelSelectionDisp, __partGraphCenter,personStorage  } from './sharedArguements';
    import  {NodeTag} from './dataStructure/NodeBase'
    import { GroupNode } from './dataStructure/GroupNode';
    import type { FreeKeyObject } from './dataStructure/FreeKeyObject';
    import { Plus, Delete, WarningFilled } from '@element-plus/icons-vue'
    import '../assets/test.css'
    


    //相关群组已经引进
      const userIdSelect = ref([])
    //树形结构数据

    const disabledDelete = computed(()=>{return ids_selected.length==0})
    

    const trees = [treePrimary,treeMiddle,treeHigh,treeUni,treeOrd]

    const treeDisplay = computed(()=>{
      return [
        {
          name: '小学',
          children: treePrimary,
        },{
          name: '初中',
          children: treeMiddle,
        },{
          name: '高中',
          children: treeHigh,
        },{
          name: '大学',
          children: treeUni,
        },{
          name:'普通群组',
          children: treeOrd,
        },
      ]
    })

    //输入框相关参数
    const input_name = ref('')
    const input_rate = ref(1)
    const input_class = ref<NodeTag>(NodeTag.GROUP)
    //输入框选项
    const option_class = [
      {
        value: NodeTag.GROUP,
        name: '团体',
      },
      {
        value: NodeTag.PRIMARY_SCHOOL,
        name: '小学',
      },
      {
        value: NodeTag.JUNIOR_HIGH,
        name: '初中',
      },
      {
        value: NodeTag.SENIOR_HIGH,
        name:'高中',
      },
      {
        value: NodeTag.UNIVERSITY,
        name: '大学',
      },
    ]
      
    

    //选项框数据
    
    const defaultProps= {
      children: 'children',
      label: 'name',
    };
    const dialogVisible= ref(false)

    
    function handleNodeClick(data:any) {
      // console.log(data)
      if(data.children == undefined){
        __cancelSelectionDisp.value = true
        __activePartGraph.value = true
        __partGraphCenter.value = allNM.getNodeById(data.id)
      }
    }

    function showDialog() { 
      dialogVisible.value = true;
    }

    function handleClose() {
      dialogVisible.value = false;
    }

    //插入的代码
    function confirmDialog(){
      if(input_name.value.trim()==''){
        NoEmpty.value = false
        return
      }

      NoEmpty.value = true

      let now_tag = (typeof input_class.value === 'undefined' ? NodeTag.GROUP : input_class.value)
      const ins = new GroupNode(input_name.value, now_tag, input_rate.value)
      allNM.insert(ins)
      switch(now_tag){
        case NodeTag.PRIMARY_SCHOOL:
          treePrimary.push(ins)
          break
        case NodeTag.JUNIOR_HIGH:
          treeMiddle.push(ins)
          break
        case NodeTag.SENIOR_HIGH:
          treeHigh.push(ins)
          break
        case NodeTag.UNIVERSITY:
          treeUni.push(ins)
          break
        default:
          treeOrd.push(ins)
          break
      }

      //加入关系
      userIdSelect.value.forEach((id)=>{
        const node = allNM.getNodeById(id)
        if(node!=undefined)
          ins.addRelation(node)
      })
      
      clear()
      handleClose()
    }

    function handleDeleteSelected(){
      ElMessageBox.confirm('确定要删除吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        // 用户点击了确定按钮，执行删除操作
        deleteItems();
      })
      .catch(() => {
        // 用户点击了取消按钮或在对话框之外点击，不执行任何操作
      });
    }

    
    //删除部分
    const ids_selected:number[] = reactive([])

    function littleDeleted(group: any[],id:number, obj:{is_deleted:boolean, node:NodeBase | undefined}){
    if(!obj.is_deleted){
      console.log(group.length)
      for(let i = 0; i < group.length; i++){
        if(group[i].id == id){
          obj.node = group[i]
          group.splice(i,1)
          obj.is_deleted = true
          return
        }
      }
    }
  }

    function deleteItems(){
      
      ids_selected.forEach((id)=>{
      //先删显示的
        const obj = {is_deleted:false, node:undefined}
        
        for(let i = 0; i<trees.length; ++i){
          littleDeleted(trees[i],id,obj)
          if(obj.is_deleted){
            break
          }
        }

        //再删后台的
        allNM.remove(obj.node)
      })
      
      

    }
    
    const handleCheckChange = (
      data: FreeKeyObject,
      checked: boolean,
      indeterminate: boolean
    ) => {
      if(data.children == undefined){
        if(checked){
          ids_selected.push(data.id)
        }else{
          ids_selected.splice(ids_selected.indexOf(data.id),1)
        }
      }
      console.log(data, checked, indeterminate,data.id)
    }

    //输入错误处理
    //输入错误处理
    const NoEmpty = ref(true)
    const NoEmptyRev = computed(()=>{
      return !NoEmpty.value
    })

    //清除相应的数据
    function clear(){
      input_name.value = ''
      input_rate.value = 1
      input_class.value = NodeTag.GROUP
      userIdSelect.value = []
    }



 
  </script>

<style scope>
/* 修改元素之间的垂直间距 */
.el-tree-node__content{
  height: 40px;
}






.bottom-ele{
  display:flex;
  justify-content: center;
  flex-flow:true;
  flex-shrink:true;
  gap:3px;
  margin:5px;
  flex:5
}

.bottom-ele .el-button{
  flex:1 ;
}

#group-table{
  height:43vh;
  overflow:auto;
  border-radius: 20px;
}


</style>