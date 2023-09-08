import { ref, reactive } from "vue";
import { NodeManager } from "./dataStructure/NodeManager";
import { NodeBase } from "./dataStructure/NodeBase";

export const allNM = reactive<NodeManager>(new NodeManager())

export const treePrimary:any[] = reactive([])
export const treeMiddle:any[] = reactive([])
export const treeHigh:any[] = reactive([])
export const treeUni:any[] = reactive([])
export const treeOrd:any[] = reactive([])

export const treesAll:any[] = reactive([treePrimary,treeMiddle,treeHigh,treeUni,treeOrd])

export function littleDeleted(group: any[],id:number, obj:{is_deleted:boolean, node:NodeBase | undefined}){
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