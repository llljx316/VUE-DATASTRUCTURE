import type { FreeKeyObject } from "./FreeKeyObject"
import { GroupNode } from "./GroupNode"
import { NodeBase, NodeTag } from "./NodeBase"
import { PersonNode } from "./PersonNode"
import HashTable  from './HashTable'

export class NodeManager {
    private nextId = 1 // 下一个分配的节点 id。
    // nodes = new Array<NodeBase>() // 节点列表。
    nodes:HashTable<number,NodeBase> = new HashTable<number,NodeBase>()

    /**
     * 加入新节点。
     * @param node 要加入的节点。
     */
    insert(node: NodeBase) {
        node.id = this.nextId++
        this.nodes.put(node.id,node)
    }

    /**
     * 删除节点。会自动解除该节点与其他节点的关联关系。
     * @param node 要删除的节点。
     */
    remove(node: NodeBase) {
        this.removeById(node.id)
    }

     /**
     * 删除节点。(通过id)。会自动解除该节点与其他节点的关联关系。
     * @param id 要删除的节点的id。
     */
     removeById(id: number) {
        const delNode = this.nodes.get(id)
        if(delNode!=undefined){
            // 解除组织和好友关系。
            for (const relationNode of delNode.relations) {
                relationNode.removeRelation(delNode, false)
            }

            this.nodes.remove(delNode.id)
        }
    }

    

    /**
     * 通过节点 id 获取节点对象。
     * @param id 节点 id。
     * @returns 节点对象。若 id 对应节点不存在，返回 null。
     */
    getNodeById(id: number): NodeBase | undefined {
        return this.nodes.get(id)
    }

    /**
     * 获取下一个节点的id
     * @returns 下一个节点会分配的id值
     */
    getNextId(): number {
        return this.nextId
    }

    /*
     * 序列化格式：JSON 字符串
     * {
     *     "nextId": int,
     *     "nodes": [
     *         {
     *             "id": int,
     *             "tag": string,
     *             "name": string,
     *             "relations": [ id: int ]
     *             "gender": int, // optional
     *             "coef": float // optional
     *         },
     *         ...
     *     ]
     * }
     */

    /**
     * 转为可序列化对象。
     */
    toJsonableObject(): FreeKeyObject {
        const res: FreeKeyObject = {

        }
        
        res.nextId = this.nextId

        res.nodes = new Array<FreeKeyObject>()
        this.nodes.getTable()
        this.nodes.forEach((nodeid,node) => {
            res.nodes.push(node.toJsonableObject())
        })

        return res
    }

    toString(): String {
        return JSON.stringify(this.toJsonableObject())
    }

    /**
     * 导入数据。
     * @param data json 格式字符串。内部数据格式应满足本节点管理器的规定。
     */
    import(data: string) {
        const obj = JSON.parse(data)
        this.nextId = obj.nextId
        this.nodes.clear()// 清空。其内部会自动解除元素绑定。

        const idMap = new Map<number, NodeBase>()
        
        for (let node of (obj.nodes as Array<FreeKeyObject>)) {
            if (node.tag == NodeTag.PERSON) {
                let newNode = new PersonNode(node.name, node.gender, node.id)
                idMap.set(node.id, newNode)
                this.nodes.push(newNode)
            } else {
                let newNode = new GroupNode(node.name, node.tag, node.coef, node.id)
                idMap.set(node.id, newNode)
                this.nodes.push(newNode)
            }
        }

        // 绑定关系。
        for (let node of (obj.nodes as Array<FreeKeyObject>)) {
            let idList = node.relations as Array<number>
            let targetNode = idMap.get(node.id)!
            targetNode.relations = idList.map(it => idMap.get(it)!)
        }

    } // function import
} // class NodeManager
