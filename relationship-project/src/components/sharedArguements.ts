import { ref, reactive } from "vue";
import { NodeManager } from "./dataStructure/NodeManager";
import { NodeBase } from "./dataStructure/NodeBase";
import HashTable from "./dataStructure/HashTable";

export const allNM = reactive<NodeManager>(new NodeManager())

export const treePrimary:any[] = reactive([])
export const treeMiddle:any[] = reactive([])
export const treeHigh:any[] = reactive([])
export const treeUni:any[] = reactive([])
export const treeOrd:any[] = reactive([])

export const treesAll:any[] = reactive([treePrimary,treeMiddle,treeHigh,treeUni,treeOrd])
//画子图用的变量
export const __activePartGraph = ref(false)
export const __partGraphCenter = ref<NodeBase>(new NodeBase(''))
//取消选择按钮变量
export const __cancelSelectionDisp = ref(false)

//用的用户变量
export const personStorage = reactive<PersonNode[]>([])//可以回去

//哈希表方便查找
export const NodesDisHash = new HashTable<number,any>()//可以回去
export const friendCanMade = ref<NodeBase[]>([])
export const friendNow = ref<NodeBase[]>([])
export const groupNow = ref<NodeBase[]>([])
export const friendRecommend = ref<NodeBase[]>([])
export const groupRecommend = ref<NodeBase[]>([])


  export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }


  export function deleteItemMult(Storage:NodeBase[], node_selected:NodeBase[]){
      
    //先删显示的
    let mnode: any
    node_selected.forEach((node:NodeBase)=>{
      Storage.forEach((pNode:NodeBase,index:number)=>{
            if(pNode==node){
                mnode=node
                Storage.splice(index,1)
            }
        })
        //再删后台的
        allNM.remove(mnode)
    })
}