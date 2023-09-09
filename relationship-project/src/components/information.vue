<script setup lang="ts">
import { __cancelSelectionDisp, __activePartGraph, 
    __partGraphCenter, allNM, treesAll, friendCanMade,
    treePrimary,treeMiddle,treeHigh,treeUni,treeOrd, friendRecommend, groupRecommend} from './sharedArguements';
import { ref, computed, watch } from 'vue'
import type { UploadFile, UploadInstance, UploadProps, UploadRawFile  } from 'element-plus'
import {genFileId } from 'element-plus'
import { NodeBase, NodeTag } from './dataStructure/NodeBase';
import { init } from 'echarts';


const upload = ref<UploadInstance>()

function handleCancelSelection(){
    __cancelSelectionDisp.value = false
    __activePartGraph.value = false
}

let file:any 

function handleImport(){
    allNM.toJsonableObject()
}

function handleExport(){

}

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const handleFile = (response:any, file:UploadFile, fileList) =>{
    //json获取
    console.log(file.raw!)
}

const classType = computed(()=>{return (__partGraphCenter.value.tag == NodeTag.PERSON) ? '人物' : '群组'})
const showAddGroup = computed(() => {return classType.value=='人物'})
// const handleRequest = (e) => {
// //   const fd = new FileReader()
// //   fd.readAsDataURL(e.file)
// //   // 将文件转化为base64格式传入后端
// //   fd.onload = () => {
// //     axios
// //       .post('./upload', {
// //         imgUrl: fd.result,
// //       })
// //       .then((res) => {
// //         file = res.data.data
// //       })
// //   }
  
// //   // 上传blob格式
// //   axios
// //     .post('./upload', {
// //       imgUrl: URL.createObjectURL(e.file),
// //     })
// //     .then((res) => {
// //       file = res.data.data
// //     })
// }

    // watch({personStorage, ()=>{}},(newval,oldval) => {
    //     let items: NodeBase[] = excludeAlreadyFriend.value
    //     items = []
    //     personStorage.forEach((node)=>{
    //         if(NodesDisHash.get(node.id) == undefined)
    //             items.push(node)
    //     })
    // })

    //选朋友需要用到的
    const userIdSelect = ref([])
    const friendDialogVisible = ref(false)

    function confirmDialogFriend(){
        userIdSelect.value.forEach((id) => {
            const item = allNM.getNodeById(id)
            if(item!=null) 
                __partGraphCenter.value.addRelation(item)
        })
        userIdSelect.value = []
    }

    //选群组需要的
    const groupDialogVisible = ref(false)
    const selectedOrd = ref<number[]>([])//注意默认读取字符串
    const selectedPri = ref<number[]>([])
    const selectedMid = ref<number[]>([])
    const selectedHig = ref<number[]>([])
    const selectedUni = ref<number[]>([])

    const selectedEle = [selectedOrd, selectedPri, selectedMid, selectedHig,selectedUni]

    function clearGroup(){
        selectedEle.forEach((item,index)=>{
            item.value=[]
        })
    }

    let orgSel:any[]

    function initDiaG(){
        //初始化
        orgSel = []
        clearGroup()
        __partGraphCenter.value.relations.forEach((item:NodeBase) =>{
            if(item.tag ==NodeTag.GROUP){
                selectedOrd.value.push(item.id)
            }
            else if(item.tag ==NodeTag.PRIMARY_SCHOOL){
                selectedPri.value.push(item.id)
            }
            else if(item.tag ==NodeTag.JUNIOR_HIGH){
                selectedMid.value.push(item.id)
            }
            else if(item.tag ==NodeTag.SENIOR_HIGH){
                selectedHig.value.push(item.id)
            }
            else if(item.tag ==NodeTag.UNIVERSITY){
                selectedUni.value.push(item.id)
            }
        })

        orgSel.push(selectedOrd.value)
        orgSel.push(selectedPri.value)
        orgSel.push(selectedMid.value)
        orgSel.push(selectedHig.value)
        orgSel.push(selectedUni.value)
        Object.assign(orgSel,orgSel)
        groupDialogVisible.value = true;
    }

    /**
     * 形成关系
     */

    function formRelation(NodeBase, id:number){
        const node = allNM.getNodeById(id)

        if(node==null) return
        if(orgSel.find((item:any)=>{item==node})==undefined)
            NodeBase.value.addRelation(node)
    } 
        
        
        


    function confirmGroupDialog(){
        //删除关系
        orgSel.forEach((item:any, index:number)=>{
            item.forEach((id)=>{
                if(selectedEle[index].value.find((now)=>now==id)==null) 
                    __partGraphCenter.value.removeRelation(allNM.getNodeById(id))
                })    
        })

        //添加关系
        selectedEle.forEach((selectedItem) => {
            selectedItem.value.forEach((id)=>{
                formRelation(__partGraphCenter,id)
            })
        })

        

        // if(selectedFri.value != undefined){
        groupDialogVisible.value = false;
    }

    //drawer
    const drawerVisable = ref(false)
    function handleFriendDrawerClick(){
        ;
    }

    function addOp(Row:any){
        const node = Row.node
        ElMessageBox.confirm('确定要添加吗？', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(() => {
            // 用户点击了确定按钮，执行删除操作
            __partGraphCenter.value.addRelation(node)
        })
    }


</script>

<template>
    <div class="down-textrue">
        <el-col id="down-item-total"  v-if = '__cancelSelectionDisp'>
            <el-row :span="12" id = "down-item-item">
                <p class="pinfo-item">
                    <!-- 信息 -->
                    {{classType}}:{{__partGraphCenter.name}}
                </p>
            </el-row>
            <el-row id = "down-item-item" :span="12">
                <el-button type="primary" @click="handleCancelSelection"
                >取消选择</el-button>
                <el-button type="primary" @click="()=>{friendDialogVisible = true;}">添加朋友</el-button>
                
                <!-- <el-button></el-button> -->
                
                <!-- 选择群组 -->
                <el-button v-if="showAddGroup" type="primary" @click="initDiaG">修改群组</el-button>
                

                <!-- 推荐朋友drawer -->
                <el-button @click="()=>{drawerVisable = true}" type="primary" v-if="__partGraphCenter.tag==NodeTag.PERSON">社交推荐</el-button>
                
            </el-row>
                <!-- 选朋友的弹框 -->
                <el-dialog
                    title="提示"
                    v-model="friendDialogVisible"
                    :before-close="()=>{return friendDialogVisible = false;}"
                >
                    <el-select v-model='userIdSelect' class="m-2" placeholder="不选则暂无朋友" multiple clearable >
                    <el-option
                        v-for="item in friendCanMade"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                    </el-select>
                    <el-button type="primary" @click="confirmDialogFriend">确认</el-button>
                </el-dialog>

                <!-- 选群组的弹框 -->
                <el-dialog
                    title="请修改或选择相应的群组"
                    v-model="groupDialogVisible"
                    width="30%"
                    :before-close="()=>{groupDialogVisible = false;}"
                >
                    <span class="dialog-body" >
                        <div>请选择普通群组:</div>
                        <el-select v-model='selectedOrd' class="m-2" placeholder="不选为没有" multiple clearable>
                        <el-option
                            v-for="item in treeOrd"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                        </el-select>
                        
                        

                        <div>请选择小学:</div>
                        <el-select v-model='selectedPri' class="m-2" placeholder="不选为没有" multiple clearable>
                            <!-- <el-option :value="null" label="空选项"></el-option>     -->
                        <el-option
                            v-for="item in treePrimary"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                        </el-select>

                        <div>请选择初中:</div>
                        <el-select v-model='selectedMid' class="m-2" placeholder="不选为没有"  multiple clearable>
                            <!-- <el-option :value="null" label="空选项"></el-option>     -->
                        <el-option
                            v-for="item in treeMiddle"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                        </el-select>

                        <div>请选择高中:</div>
                        <el-select v-model='selectedHig' class="m-2" placeholder="不选为没有"  multiple clearable>
                        <el-option
                            v-for="item in treeHigh"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                        </el-select>

                        <div>请选择大学:</div>
                        <el-select v-model='selectedUni' class="m-2" placeholder="不选为没有" multiple clearable >
                        <el-option
                            v-for="item in treeUni"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                        </el-select>
                        <div class="flex-row">
                            <el-button type="primary" @click="clearGroup" class="equal-button">清空</el-button>
                            <el-button type="primary" @click="confirmGroupDialog" class="equal-button">确定</el-button>
                        </div>
                    </span>
                </el-dialog>

                <!-- 推荐朋友的弹框 -->
                <el-drawer
                    title="推荐朋友和群组"
                    v-model="drawerVisable"
                    :direction="'rtl'"
                    :before-close="()=>{drawerVisable = false}"
                    destroy-on-close
                    >
                    <!-- <span>我来啦!</span>
                     -->
                     <el-table
                        :data="friendRecommend"
                        @cell-click="handleFriendDrawerClick"
                    >
                        <el-table-column
                            prop="node.name"
                            label="姓名"
                        ></el-table-column>
                        <el-table-column
                            prop="score"
                            label="分数"
                        ></el-table-column>

                        <el-table-column label="操作" align="center" min-width="100">
                            <template #default="scope">
                                <!-- {{ scope.row.date }} -->
                                <el-button type="primary" @click="addOp(scope.row)">加好友</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!-- 推荐群组 -->
                    <el-table
                        id="group-table"
                        :data="groupRecommend"
                        @cell-click="handleGroupDrawerClick"
                    >
                        <el-table-column
                            prop="node.name"
                            label="群组名称"
                        ></el-table-column>
                        <el-table-column
                            prop="score"
                            label="分数"
                        ></el-table-column>

                        <el-table-column label="操作" align="center" min-width="100">
                            <template #default="scope">
                                <!-- {{ scope.row.date }} -->
                                <el-button type="primary" @click="addOp(scope.row)">删除关系</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </el-drawer>

            <!-- 有部分选择的时候 -->
        </el-col> 
        
        
        <!-- <div class="right-side">
            导入
            <el-upload
                ref="upload"
                action=""
                class="upload-demo"
                :limit="1"
                :on-exceed="handleExceed"
                :auto-upload="true"
                :on-success="handleFile"
                :http-request="handleRequest"
                :show-file-list="false"
                accept=".json"
                :file-list="files"
            >
                <el-button class="ml-3" type="success">
                upload to server
                </el-button>
                <template #tip>
                <div class="el-upload__tip text-red">
                    limit 1 file, new file will cover the old file
                </div>
                </template>
            </el-upload>

            <el-button type="primary" @click="handleExport"
            >导出</el-button>
        </div> -->
    </div>
</template>

<style scoped>
    .down-textrue{
        height:100%;
        border-style:solid;
        border-width:5px;
        border-radius: 20px;
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
    }

    .pinfo-item{
        text-align: center;
        align-items: center;
        font-size: x-large;
    }

    .equal-button{
        flex: 1;
    }

    #down-item-item.el-row{
        align-items: center;
        justify-content: center;
    }

    #down-item-total{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
    }


    .el-row .down-item.total{
        align-items: center;
        justify-content: center;
        width:100%
        border-radius
    }


    .el-row .down-item.item{
        align-items: center;
        justify-content: center;
        width:100%
    }


</style>