<template>
    <!-- <h5 id = "head">群组信息</h5> -->
    <el-col class="border-item">
      <el-row style="height:85%" :span="24">
      <el-tree 
        class="info-item table-item"
        :data="treeDisplay"
        :props="defaultProps"
        lable="组别"
        id = "name-table"
        @node-click="handleNodeClick"
        :defaultExpandAll="true"
        :show-header="true"
        show-checkbox
        @check-change="handleCheckChange"
        style="width: 100%;"
      ></el-tree>
    
      </el-row>

    
    
    <!-- 添加按键 -->
    <div class="bottom-ele">
      <el-col :span="12">
        <el-button class="bottom-button" 
          icon="edit" @click="showDialog" type="primary">提交</el-button>
          </el-col>
          <el-dialog
              title="提示"
              v-model="dialogVisible"
              width="30%"
              :before-close="handleClose"
          >
          <span>这是一段信息</span>
          <template #footer>
              <span class="dialog-footer">
                <!-- 调整排版 -->
                <el-input v-model="input_name" placeholder="Please input" clearable />
                <el-input-number v-model="input_rate" :precision="2" :step="0.1" :min="0"/>
                <el-select v-model='input_class' class="m-2" placeholder="不选为普通群组"  clearable>
                  <el-option
                    v-for="item in option_class"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
                <el-select v-model='userIdSelect' class="m-2" placeholder="不选则暂无朋友" multiple clearable >
                  <el-option
                    v-for="item in personStorage"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="confirmDialog">确 定</el-button>
              </span>
          </template>
          </el-dialog>
        

    <!-- 删除的按键以及操作 -->
      <el-col :span="11">          
        <el-button @click="handleDeleteSelected" type="danger">删除选中</el-button>
        </el-col>
      </div>
  </el-col>


  </template>
  
  <script setup lang="ts">
    // import {Edit} from '@element-plus/icons-vue'
    import {ref, reactive, computed} from 'vue'
    import { treePrimary,treeMiddle,treeHigh,treeUni,treeOrd, allNM,
      __activePartGraph, __cancelSelectionDisp, __partGraphCenter,personStorage  } from './sharedArguements';
    import  {NodeTag} from './dataStructure/NodeBase'
    import { GroupNode } from './dataStructure/GroupNode';
    import {ElMessageBox } from 'element-plus'
    import type { FreeKeyObject } from './dataStructure/FreeKeyObject';
    

    //相关群组已经引进
      const userIdSelect = ref([])
    //树形结构数据
    

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
    const input_class = ref<NodeTag>()
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
    let ids_selected:number[] = reactive([])

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
      
      //先删显示的
      const obj = {is_deleted:false, node:undefined}
      ids_selected.forEach((id)=>{
        for(let i = 0; i<trees.length; ++i){
          littleDeleted(trees[i],id,obj)
          if(obj.is_deleted){
            break
          }
        }
      })
      
      //再删后台的
      allNM.remove(obj.node)

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



 
  </script>

<style scope>
/* 修改元素之间的垂直间距 */
.el-tree-node__content{
  height: 40px;
}

.el-tree{
  min-height: 85%;
  overflow-y: auto; /* 启用垂直滚动条 */
  border-color:black
}


</style>